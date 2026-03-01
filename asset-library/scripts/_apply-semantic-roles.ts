/**
 * Apply semantic_role categorisation to assets.
 * - 154 base_names → 'content-symbol'
 * - All lotties → 'decorative'
 * - Everything else stays 'ui-control' (the default)
 *
 * Run: npx tsx scripts/_apply-semantic-roles.ts
 */
import { execSync } from 'node:child_process';

function d1Query(sql: string): any {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: process.cwd() });
  return JSON.parse(raw);
}

const contentSymbolBaseNames = [
  'airplane','ambulance','anchor','baby','baby-carriage','backpack','balloon','bandaids','barbell','barn',
  'basket','bathtub','bed','bell','bicycle','binoculars','bird','boat','bomb','bone','book','boot','brain',
  'bridge','broom','bug','buildings','bus','butterfly','cake','camera','car','cat','chair','church','cloud',
  'cloud-lightning','cloud-rain','cloud-snow','coffee','cookie','couch','crown','diamond','dog','dress','drop',
  'ear','egg','eye','eyeglasses','factory','fan','fire','fish','flashlight','flower','football','garage','gift',
  'globe','guitar','hamburger','hammer','hand','handbag','headphones','heart','high-heel','horse','hourglass',
  'house','ice-cream','key','knife','lamp','leaf','lego','lifebuoy','lightbulb','lighthouse','lightning','lock',
  'magnet','mailbox','martini','medal','megaphone','microphone','money','moon','motorcycle','mountains',
  'music-note','music-notes','orange','paint-brush','parachute','park','paw-print','pencil','pepper','person',
  'person-simple','pill','pizza','plug','puzzle-piece','rainbow','robot','rocket','scissors','shield','shovel',
  'siren','skull','smiley','smiley-angry','smiley-blank','smiley-meh','smiley-melting','smiley-nervous',
  'smiley-sad','smiley-sticker','smiley-wink','snowflake','soccer-ball','star','stethoscope','sun','sword',
  'syringe','target','taxi','tennis-ball','tent','thermometer','toilet','toolbox','tooth','train','trash',
  'treasure-chest','tree','trophy','truck','umbrella','user','vinyl-record','wallet','watch','wheelchair',
  'wine','wrench',
];

// Build IN clause — SQLite max is 999 params, we have 154 so fine
const inList = contentSymbolBaseNames.map(n => `'${n}'`).join(',');

// 1. Set content-symbol
const csResult = d1Query(`UPDATE assets SET semantic_role = 'content-symbol' WHERE base_name IN (${inList})`);
const csChanges = csResult[0]?.meta?.changes || 0;
console.log(`content-symbol: ${csChanges} rows updated`);

// 2. Set decorative for all lotties
const decResult = d1Query("UPDATE assets SET semantic_role = 'decorative' WHERE type = 'lottie'");
const decChanges = decResult[0]?.meta?.changes || 0;
console.log(`decorative (lotties): ${decChanges} rows updated`);

// 3. Verify counts
const verifyResult = d1Query("SELECT semantic_role, COUNT(*) as cnt FROM assets GROUP BY semantic_role ORDER BY semantic_role");
console.log('\nFinal distribution:');
for (const row of verifyResult[0].results) {
  console.log(`  ${row.semantic_role}: ${row.cnt}`);
}
