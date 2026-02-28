/**
 * Export alt_symbols + asset links from local D1 as SQL for remote import.
 *
 * Usage:
 *   npx tsx scripts/export-alt-sql.ts > /tmp/seed-alt-remote.sql
 *   npx wrangler d1 execute asset-library --remote --file=/tmp/seed-alt-remote.sql
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BATCH_SIZE = 50;

function wranglerQuery(sql: string): any[] {
  const result = execSync(
    `npx wrangler d1 execute asset-library --local --command="${sql.replace(/"/g, '\\"')}" --json`,
    { cwd: process.cwd(), encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
  );
  const parsed = JSON.parse(result);
  return parsed[0]?.results || [];
}

function escapeSql(val: string | null): string {
  if (val === null || val === undefined) return 'NULL';
  return `'${val.replace(/'/g, "''")}'`;
}

function main() {
  const lines: string[] = [];

  // Export alt_symbols
  console.error('Exporting alt_symbols...');
  const symbols = wranglerQuery('SELECT * FROM alt_symbols');
  console.error(`  Found ${symbols.length} symbols`);

  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    const batch = symbols.slice(i, i + BATCH_SIZE);
    const values = batch.map(s =>
      `(${escapeSql(s.id)}, ${escapeSql(s.word)}, ${escapeSql(s.icon_id)}, ${s.aac_id ?? 'NULL'}, ${escapeSql(s.aac_url)}, ${escapeSql(s.created_at)}, ${escapeSql(s.updated_at)})`
    ).join(',\n  ');

    lines.push(`INSERT OR IGNORE INTO alt_symbols (id, word, icon_id, aac_id, aac_url, created_at, updated_at) VALUES\n  ${values};`);
  }

  // Export asset alt_symbol_id links
  console.error('Exporting asset links...');
  const links = wranglerQuery('SELECT slug, alt_symbol_id FROM assets WHERE alt_symbol_id IS NOT NULL');
  console.error(`  Found ${links.length} linked assets`);

  for (let i = 0; i < links.length; i += BATCH_SIZE) {
    const batch = links.slice(i, i + BATCH_SIZE);
    // Use individual UPDATEs since SQLite doesn't support UPDATE with CASE in batches easily
    for (const link of batch) {
      lines.push(`UPDATE assets SET alt_symbol_id = ${escapeSql(link.alt_symbol_id)} WHERE slug = ${escapeSql(link.slug)};`);
    }
  }

  const output = lines.join('\n');
  const outPath = path.join(process.cwd(), 'scripts', 'seed-alt-remote.sql');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.error(`\nWritten to ${outPath}`);
  console.error(`  ${symbols.length} symbols, ${links.length} asset links`);
  console.error(`\nRun: npx wrangler d1 execute asset-library --remote --file=./scripts/seed-alt-remote.sql`);
}

main();
