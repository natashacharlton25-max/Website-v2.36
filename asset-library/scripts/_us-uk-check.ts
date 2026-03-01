/**
 * Temporary script: check alt_symbols words for US English and propose UK equivalents.
 * Run: npx tsx scripts/_us-uk-check.ts
 */
import { execSync } from 'node:child_process';

function d1Query(sql: string): any {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: process.cwd() });
  return JSON.parse(raw);
}

// Known US→UK swaps for common AAC/content vocabulary
const usToUk: Record<string, string> = {
  'baby carriage': 'pram',
  'trash': 'bin',
  'soccer ball': 'football',
  'flashlight': 'torch',
  'cookie': 'biscuit',
  'airplane': 'aeroplane',
  'sidewalk': 'pavement',
  'diaper': 'nappy',
  'candy': 'sweets',
  'faucet': 'tap',
  'elevator': 'lift',
  'gas': 'petrol',
  'trunk': 'boot',
  'hood': 'bonnet',
  'truck': 'lorry',
  'soccer': 'football',
  'sneaker': 'trainer',
  'sweater': 'jumper',
  'pants': 'trousers',
  'apartment': 'flat',
  'fall': 'autumn',
  'cell phone': 'mobile',
  'flashlight': 'torch',
  'garbage': 'rubbish',
  'fries': 'chips',
  'chips': 'crisps',
  'eggplant': 'aubergine',
  'zucchini': 'courgette',
  'jelly': 'jam',
  'eraser': 'rubber',
  'line': 'queue',
  'mailbox': 'postbox',
  'stroller': 'pushchair',
  'crosswalk': 'zebra crossing',
  'license plate': 'number plate',
  'windshield': 'windscreen',
  'parking lot': 'car park',
  'freeway': 'motorway',
  'drapes': 'curtains',
  'fanny pack': 'bum bag',
};

// The 154 content-symbol base_names (hyphenated Phosphor names)
const contentSymbols = [
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

// Query alt_symbols for these words (word form = base_name with hyphens replaced by spaces)
const wordForms = contentSymbols.map(s => s.replace(/-/g, ' '));

// Query all alt_symbols at once
const allSymbols = d1Query("SELECT id, word FROM alt_symbols ORDER BY word");
const symbolMap = new Map<string, { id: string; word: string }>();
for (const row of allSymbols[0].results) {
  symbolMap.set(row.word.toLowerCase(), row);
}

console.log('=== US→UK REVIEW FOR CONTENT-SYMBOL ALT_SYMBOLS ===\n');

const flagged: { baseName: string; currentWord: string; proposedUk: string; symbolId: string }[] = [];
const missing: string[] = [];
const ok: string[] = [];

for (let i = 0; i < contentSymbols.length; i++) {
  const baseName = contentSymbols[i];
  const wordForm = wordForms[i];
  const symbol = symbolMap.get(wordForm.toLowerCase());

  if (!symbol) {
    missing.push(baseName);
    continue;
  }

  const ukEquiv = usToUk[symbol.word.toLowerCase()];
  if (ukEquiv) {
    flagged.push({
      baseName,
      currentWord: symbol.word,
      proposedUk: ukEquiv,
      symbolId: symbol.id,
    });
  } else {
    ok.push(`${baseName} → "${symbol.word}"`);
  }
}

if (flagged.length > 0) {
  console.log(`FLAGGED: US English → UK English (${flagged.length})\n`);
  console.log('  base_name          | current word      | proposed UK       | symbol_id');
  console.log('  -------------------|-------------------|-------------------|----------');
  for (const f of flagged) {
    const bn = f.baseName.padEnd(19);
    const cw = f.currentWord.padEnd(19);
    const uk = f.proposedUk.padEnd(19);
    console.log(`  ${bn}| ${cw}| ${uk}| ${f.symbolId}`);
  }
}

console.log(`\nNO ALT_SYMBOL MATCH (${missing.length}):`);
for (const m of missing) {
  console.log(`  ${m}`);
}

console.log(`\nOK — already fine (${ok.length}):`);
for (const o of ok) {
  console.log(`  ${o}`);
}

console.log(`\n=== SUMMARY ===`);
console.log(`  Flagged US→UK: ${flagged.length}`);
console.log(`  Missing symbol: ${missing.length}`);
console.log(`  Already OK:     ${ok.length}`);
