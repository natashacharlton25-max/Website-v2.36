/**
 * Seed 73 decorative shapes into D1
 * Usage: node scripts/seed-shapes.cjs
 */
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l.includes('=')).map(l => {
    const [k, ...v] = l.split('=');
    return [k.trim(), v.join('=').trim()];
  })
);

const API_URL = env.ASSET_API_URL;
const API_TOKEN = env.ASSET_API_TOKEN;
const SHAPES_DIR = 'C:\\Users\\natas\\Downloads\\4sPcycMSQHlrtNTStxvoTt4Xd7g';

async function main() {
  const files = fs.readdirSync(SHAPES_DIR).filter(f => f.endsWith('.svg')).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
    return numA - numB;
  });

  console.log(`Seeding ${files.length} shapes...`);

  const assets = files.map(file => {
    const num = file.match(/\d+/)?.[0] || '0';
    const slug = `shape-${num.padStart(3, '0')}`;
    let content = fs.readFileSync(path.join(SHAPES_DIR, file), 'utf8');

    // Normalise: remove hardcoded fill colour, set fill="currentColor"
    content = content.replace(/fill="rgb\([^"]*\)"/g, 'fill="currentColor"');
    content = content.replace(/fill="#[0-9a-fA-F]+"/g, 'fill="currentColor"');

    return {
      name: `Shape ${num}`,
      slug,
      type: 'svg',
      source: 'shapes',
      license: 'proprietary',
      tags: ['shape', 'decorative'],
      content,
      created_by: 'seed-shapes',
    };
  });

  // Batch upload
  for (let i = 0; i < assets.length; i += 50) {
    const batch = assets.slice(i, i + 50);
    const res = await fetch(`${API_URL}/v1/assets/bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assets: batch }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`Batch ${Math.floor(i / 50) + 1}: ${data.created} created, ${data.skipped} skipped`);
    } else {
      console.log(`Batch ${Math.floor(i / 50) + 1}: FAILED ${res.status}`);
    }
  }

  // Verify
  const check = await fetch(`${API_URL}/v1/assets/shape-001`, {
    headers: { 'Authorization': `Bearer ${API_TOKEN}` },
  });
  console.log(`\nVerify shape-001: ${check.ok ? 'OK' : 'FAIL'}`);
  console.log('Done!');
}

main().catch(err => { console.error(err); process.exit(1); });
