#!/usr/bin/env node

/**
 * Upload Bliss AAC symbols to Asset Library API via bulk endpoint.
 * Reads from /public/symbols/bliss/ folder, uploads in batches of 200.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const symbolsDir = path.join(rootDir, 'public', 'symbols', 'bliss');

// Read token from .env
const envPath = path.join(rootDir, '.env');
let token;
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/ASSET_API_TOKEN=(.+)/);
  if (match) token = match[1].trim();
}
if (!token) { console.error('Missing ASSET_API_TOKEN'); process.exit(1); }

const API_URL = 'https://asset-library.natashacharlton25.workers.dev';

const files = fs.readdirSync(symbolsDir).filter(f => f.endsWith('.svg')).sort();
console.log(`Found ${files.length} Bliss symbols`);

const BATCH_SIZE = 200;
let uploaded = 0;
let failed = 0;
let skipped = 0;

for (let i = 0; i < files.length; i += BATCH_SIZE) {
  const batch = files.slice(i, i + BATCH_SIZE);
  const batchNum = Math.floor(i / BATCH_SIZE) + 1;
  const totalBatches = Math.ceil(files.length / BATCH_SIZE);
  console.log(`\nBatch ${batchNum}/${totalBatches} (${batch.length} symbols)...`);

  const assets = batch.map(file => {
    const id = file.replace('.svg', '');
    const slug = `bliss-${id}`;
    const content = fs.readFileSync(path.join(symbolsDir, file), 'utf8');
    return {
      name: `Bliss ${id}`,
      slug,
      type: 'svg',
      source: 'bliss',
      license: 'cc-by-sa-4.0',
      tags: ['aac-symbol', 'bliss'],
      content,
      created_by: 'upload-bliss-symbols.js'
    };
  });

  try {
    const res = await fetch(`${API_URL}/v1/assets/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ assets })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`  ❌ HTTP ${res.status}: ${text.slice(0, 200)}`);
      failed += batch.length;
      continue;
    }

    const result = await res.json();
    let batchCreated = 0, batchExists = 0, batchFailed = 0;
    for (const r of result.results || []) {
      if (r.status === 'created') { uploaded++; batchCreated++; }
      else if (r.status === 'exists') { skipped++; batchExists++; }
      else { failed++; batchFailed++; }
    }
    console.log(`  ✅ ${batchCreated} created, ${batchExists} exists, ${batchFailed} failed`);
  } catch (err) {
    console.error(`  ❌ Network error: ${err.message}`);
    failed += batch.length;
  }
}

console.log(`\n✅ Uploaded: ${uploaded}`);
console.log(`⏭️  Skipped: ${skipped}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Total: ${files.length}`);
