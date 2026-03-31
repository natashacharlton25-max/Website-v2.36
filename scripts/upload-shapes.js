#!/usr/bin/env node

/**
 * Upload SVG shapes to Asset Library API via bulk endpoint.
 * Reads from /svg shapes/ folder, uploads in batches of 50.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const shapesDir = path.join(rootDir, '4sPcycMSQHlrtNTStxvoTt4Xd7g');

const API_URL = process.env.ASSET_API_URL || 'https://asset-library.natashacharlton25.workers.dev';
const API_TOKEN = process.env.ASSET_API_TOKEN;

if (!API_TOKEN) {
  // Try reading from .env
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/ASSET_API_TOKEN=(.+)/);
    if (match) process.env.ASSET_API_TOKEN = match[1].trim();
  }
}

const token = process.env.ASSET_API_TOKEN;
if (!token) {
  console.error('Missing ASSET_API_TOKEN');
  process.exit(1);
}

// Read all SVG files
const files = fs.readdirSync(shapesDir).filter(f => f.endsWith('.svg')).sort((a, b) => {
  const numA = parseInt(a.match(/\d+/)?.[0] || '0');
  const numB = parseInt(b.match(/\d+/)?.[0] || '0');
  return numA - numB;
});

console.log(`Found ${files.length} SVG shapes`);

// Build bulk payload
const assets = files.map(file => {
  const num = file.match(/\d+/)?.[0] || '0';
  const slug = `shape-${num.padStart(3, '0')}`;
  const content = fs.readFileSync(path.join(shapesDir, file), 'utf8');

  return {
    name: `Shape ${num}`,
    slug,
    type: 'svg',
    source: 'mind-the-box',
    license: 'proprietary',
    tags: ['mask-shape', 'decorative'],
    content,
    created_by: 'upload-shapes.js'
  };
});

// Upload in batches of 50
const BATCH_SIZE = 50;
let uploaded = 0;
let failed = 0;

for (let i = 0; i < assets.length; i += BATCH_SIZE) {
  const batch = assets.slice(i, i + BATCH_SIZE);
  console.log(`\nUploading batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} shapes)...`);

  try {
    const res = await fetch(`${API_URL}/v1/assets/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ assets: batch })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`  ❌ HTTP ${res.status}: ${text}`);
      failed += batch.length;
      continue;
    }

    const result = await res.json();
    for (const r of result.results || []) {
      if (r.status === 'created' || r.status === 'exists') {
        uploaded++;
        console.log(`  ✅ ${r.slug} — ${r.status}`);
      } else {
        failed++;
        console.log(`  ❌ ${r.slug} — ${r.error || r.status}`);
      }
    }
  } catch (err) {
    console.error(`  ❌ Network error: ${err.message}`);
    failed += batch.length;
  }
}

console.log(`\n✅ Uploaded: ${uploaded}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Total: ${files.length}`);
