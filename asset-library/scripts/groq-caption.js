/**
 * groq-caption.js — Batch image captioning via Groq Llama 4 Scout Vision
 *
 * For each concept in bci-symbol-matches.json:
 *   1. Download best-match image
 *   2. Send to Groq Llama 4 Scout for captioning
 *   3. Save caption alongside CLIP results
 *
 * Free tier, cloud-based, no local GPU needed.
 * Rate limit: ~30 req/min on free tier, we add 2.5s delay.
 *
 * Usage: node asset-library/scripts/groq-caption.js [--limit=10]
 */

const fs = require('node:fs');
const { resolve } = require('node:path');
const https = require('node:https');
const http = require('node:http');

const SCRIPTS_DIR = resolve(__dirname);
const PROJECT_DIR = resolve(__dirname, '../..');

// Load .env manually
const envFile = fs.readFileSync(resolve(PROJECT_DIR, '.env'), 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]*)=(.*)/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const GROQ_API_KEY = envVars.GROQ_API_KEY;
if (!GROQ_API_KEY) { console.error('GROQ_API_KEY not found in .env'); process.exit(1); }

const matches = JSON.parse(
  fs.readFileSync(resolve(SCRIPTS_DIR, 'bci-symbol-matches.json'), 'utf8')
);
const concepts = JSON.parse(
  fs.readFileSync(resolve(PROJECT_DIR, 'bci-concept-definitions.json'), 'utf8')
).concepts;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Convert SVG to PNG using sharp (if available) or canvas
let sharp;
try { sharp = require('sharp'); } catch (e) { sharp = null; }

async function downloadBase64(url) {
  const buf = await downloadBuffer(url);
  const isSvg = url.includes('.svg') || buf.toString('utf8', 0, 100).includes('<svg');

  if (isSvg && sharp) {
    const pngBuf = await sharp(buf).resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
    return pngBuf.toString('base64');
  } else if (isSvg) {
    throw new Error('SVG needs sharp: npm install sharp');
  }
  return buf.toString('base64');
}

function captionGroq(imgBase64, concept) {
  // Build multi-choice options from is/isNot
  const word = concept.word.replace(/_/g, ' ');
  const isWords = (concept.is || '').split(/\s+/).filter(w => w.length > 3).slice(0, 3);
  const isNotPhrases = (concept.isNot || '').split(',').map(p => p.trim()).filter(p => p.length > 2).slice(0, 4);

  const choices = [word, ...isWords.slice(0, 2), ...isNotPhrases.slice(0, 3)];
  const uniqueChoices = [...new Set(choices)].slice(0, 6);
  const choiceList = uniqueChoices.map((c, i) => `${i + 1}. ${c}`).join('\n');

  const prompt = `This is an AAC pictogram symbol. Do TWO things:

1. DESCRIBE: In 5-10 words, what does this image literally show?

2. CLASSIFY: Which of these concepts does this image BEST represent?
${choiceList}

Reply in this exact format:
DESCRIPTION: [your 5-10 word description]
BEST MATCH: [number and concept]
CONFIDENCE: [high/medium/low]`;

  const payload = JSON.stringify({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [{
      role: 'user',
      content: [{
        type: 'image_url',
        image_url: { url: 'data:image/png;base64,' + imgBase64 }
      }, {
        type: 'text',
        text: prompt
      }]
    }],
    max_tokens: 80
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_API_KEY,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.error) reject(new Error(j.error.message || JSON.stringify(j.error)));
          else resolve(j.choices?.[0]?.message?.content || '');
        } catch (e) { reject(new Error('JSON parse: ' + data.substring(0, 100))); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 95;

  const entries = Object.entries(matches).filter(([id, m]) => {
    if (m.skipped) return false;
    if (!m.best || !m.best.image_url) return false;
    if (!concepts[id]) return false;
    return true;
  }).slice(0, limit);

  console.log(`Captioning ${entries.length} images via Groq Llama 4 Scout...\n`);

  const results = [];
  let errors = 0;

  for (let i = 0; i < entries.length; i++) {
    const [bciId, m] = entries[i];
    const c = concepts[bciId];
    const imageUrl = m.best.image_url;

    try {
      const imgBase64 = await downloadBase64(imageUrl);
      const response = await captionGroq(imgBase64, c);

      // Parse structured response
      const responseLower = response.toLowerCase();
      const descMatch = response.match(/DESCRIPTION:\s*(.+)/i);
      const bestMatch = response.match(/BEST MATCH:\s*(\d+\.?\s*)?(.+)/i);
      const confMatch = response.match(/CONFIDENCE:\s*(\w+)/i);

      const description = descMatch ? descMatch[1].trim() : response.trim();
      const bestChoice = bestMatch ? bestMatch[2].trim().toLowerCase() : '';
      const confidence = confMatch ? confMatch[1].trim().toLowerCase() : 'unknown';

      const word = c.word.toLowerCase().replace(/_/g, ' ');
      const isNotPhrases = (c.isNot || '').toLowerCase().split(',').map(p => p.trim()).filter(p => p.length > 2);

      // Check if best choice matches concept or isNot
      const choiceMatchesConcept = bestChoice.includes(word) || word.includes(bestChoice);
      const choiceMatchesIsNot = isNotPhrases.some(p => bestChoice.includes(p) || p.includes(bestChoice));

      let verdict = 'UNCLEAR';
      if (choiceMatchesConcept && confidence !== 'low') verdict = 'PASS';
      else if (choiceMatchesConcept && confidence === 'low') verdict = 'WARN';
      else if (choiceMatchesIsNot) verdict = 'FAIL';
      // Also check description for word match as fallback
      else if (description.toLowerCase().includes(word)) verdict = 'PASS';

      results.push({
        bci_index: bciId,
        word: c.word,
        image_url: imageUrl,
        match_name: m.best.name,
        match_set: m.best.set,
        description,
        best_choice: bestChoice,
        confidence,
        full_response: response.trim().substring(0, 200),
        verdict
      });

      const icon = { PASS: '✓', WARN: '~', FAIL: '✗', UNCLEAR: '?' }[verdict];
      console.log(`  [${i + 1}/${entries.length}] ${icon} ${c.word}: "${description.substring(0, 50)}" → choice="${bestChoice}" (${confidence})`);

    } catch (err) {
      errors++;
      console.log(`  [${i + 1}/${entries.length}] ✗ ${c.word}: ERROR ${err.message.substring(0, 60)}`);
      results.push({
        bci_index: bciId, word: c.word, image_url: imageUrl,
        match_name: m.best.name, match_set: m.best.set,
        caption: 'ERROR: ' + err.message.substring(0, 80),
        verdict: 'ERROR'
      });
    }

    // Rate limit: 2.5s between requests
    if (i < entries.length - 1) await sleep(2500);
  }

  // Write JSON
  const outPath = resolve(SCRIPTS_DIR, 'groq-caption-results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

  // Write CSV
  const csvHeader = 'bci_index,word,verdict,description,best_choice,confidence,match_name,match_set,image_url';
  function esc(v) {
    if (v == null) return '';
    const s = String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  const csvRows = [csvHeader, ...results.map(r => [
    r.bci_index, esc(r.word), r.verdict, esc(r.description || r.caption || ''),
    esc(r.best_choice || ''), esc(r.confidence || ''),
    esc(r.match_name), esc(r.match_set), esc(r.image_url)
  ].join(','))];
  fs.writeFileSync(resolve(SCRIPTS_DIR, 'groq-caption-results.csv'), csvRows.join('\n'));

  // Summary
  const pass = results.filter(r => r.verdict === 'PASS').length;
  const warn = results.filter(r => r.verdict === 'WARN').length;
  const fail = results.filter(r => r.verdict === 'FAIL').length;
  const unclear = results.filter(r => r.verdict === 'UNCLEAR').length;
  const errCount = results.filter(r => r.verdict === 'ERROR').length;

  console.log(`\nWrote ${results.length} results to groq-caption-results.json + .csv`);
  console.log(`\n=== SUMMARY ===`);
  console.log(`  PASS:    ${pass}`);
  console.log(`  WARN:    ${warn}`);
  console.log(`  FAIL:    ${fail}`);
  console.log(`  UNCLEAR: ${unclear}`);
  console.log(`  ERROR:   ${errCount}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
