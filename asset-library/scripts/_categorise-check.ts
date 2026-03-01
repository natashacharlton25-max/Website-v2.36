/**
 * Temporary script: find content-symbol and decorative candidates from base_names.
 * Run: npx tsx scripts/_categorise-check.ts
 */
import { execSync } from 'node:child_process';

function d1Query(sql: string): any {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: process.cwd() });
  return JSON.parse(raw);
}

// Get all distinct base_names for non-image assets
const result = d1Query("SELECT DISTINCT base_name FROM assets WHERE type <> 'image' ORDER BY base_name");
const names: string[] = result[0].results.map((r: any) => r.base_name);

// ─── Content-symbol candidates ──────────────────
// Concrete nouns / AAC vocabulary: things, animals, people, food, nature, body, transport, objects, emotions
const contentWords = new Set([
  // Animals
  'bird', 'butterfly', 'cat', 'dog', 'fish', 'horse', 'bug', 'paw-print',
  // People & body
  'baby', 'person', 'person-simple', 'user', 'hand', 'ear', 'eye', 'brain', 'heart', 'skull', 'bone', 'tooth',
  // Food & drink
  'apple', 'beer', 'coffee', 'cookie', 'egg', 'hamburger', 'ice-cream', 'martini', 'orange', 'pepper', 'pizza', 'wine',
  // Nature & weather
  'flower', 'leaf', 'tree', 'sun', 'moon', 'cloud', 'cloud-rain', 'cloud-snow', 'cloud-lightning', 'rainbow', 'snowflake', 'drop', 'fire', 'mountains', 'globe',
  // Home & places
  'house', 'church', 'factory', 'buildings', 'lighthouse', 'tent', 'castle', 'barn', 'bridge', 'garage',
  // Transport
  'airplane', 'bicycle', 'boat', 'bus', 'car', 'motorcycle', 'rocket', 'train', 'truck', 'ambulance', 'taxi',
  // Objects (concrete, tangible)
  'alarm-clock', 'anchor', 'baby-carriage', 'backpack', 'balloon', 'bandaids', 'barbell', 'basket', 'bathtub',
  'bed', 'bell', 'binoculars', 'bomb', 'book', 'boot', 'broom', 'cake', 'camera', 'candle',
  'chair', 'couch', 'crown', 'diamond', 'dress', 'drum', 'eyeglasses', 'fan', 'flashlight', 'football',
  'gift', 'guitar', 'hammer', 'handbag', 'headphones', 'high-heel', 'hourglass', 'key', 'knife', 'lamp',
  'lego', 'lifebuoy', 'lightbulb', 'lightning', 'lock', 'magnet', 'mailbox', 'medal', 'megaphone',
  'microphone', 'money', 'paint-brush', 'parachute', 'park', 'pencil', 'piano', 'pill', 'plug',
  'puzzle-piece', 'robot', 'scissors', 'shield', 'shoe', 'shovel', 'siren', 'soccer-ball', 'star',
  'stethoscope', 'sword', 'syringe', 'target', 'tennis-ball', 'thermometer', 'toilet', 'toolbox',
  'trash', 'treasure-chest', 'trophy', 'umbrella', 'wallet', 'watch', 'wheelchair', 'wrench',
  // Emotions / states (common in AAC)
  'smiley', 'smiley-sad', 'smiley-angry', 'smiley-wink', 'smiley-nervous', 'smiley-blank', 'smiley-meh', 'smiley-melting', 'smiley-sticker',
  // Music
  'music-note', 'music-notes', 'vinyl-record',
]);

const matched = names.filter(n => contentWords.has(n));
const notFound = [...contentWords].filter(w => names.indexOf(w) === -1);

console.log(`\n=== CONTENT-SYMBOL CANDIDATES (${matched.length} matched) ===`);
for (const m of matched) {
  console.log(`  ${m}`);
}
console.log(`\n=== Words NOT in base_names (${notFound.length}) ===`);
for (const u of notFound) {
  console.log(`  ${u}`);
}

// ─── Decorative candidates ──────────────────────
// Look for patterns suggesting decorative use: abstract shapes, lines, patterns
const decorativePatterns = [
  /divider/i, /separator/i, /line/i, /dots-three/i, /dots-six/i, /dots-nine/i,
  /circle-half/i, /square-half/i, /swatches/i, /gradient/i, /wave/i,
  /asterisk/i, /sparkle/i, /starburst/i, /flourish/i, /ornament/i,
];

// Also check lottie assets
const lottieResult = d1Query("SELECT DISTINCT base_name, name FROM assets WHERE type = 'lottie' ORDER BY base_name");
const lotties: { base_name: string; name: string }[] = lottieResult[0].results;

const decorativeCandidates = names.filter(n => decorativePatterns.some(p => p.test(n)));

console.log(`\n=== DECORATIVE CANDIDATES from icons (${decorativeCandidates.length}) ===`);
for (const d of decorativeCandidates) {
  console.log(`  ${d}`);
}

console.log(`\n=== ALL LOTTIES (${lotties.length}) ===`);
for (const l of lotties) {
  console.log(`  ${l.base_name} (${l.name})`);
}

console.log(`\n=== SUMMARY ===`);
console.log(`  Total base_names: ${names.length}`);
console.log(`  Content-symbol:   ${matched.length}`);
console.log(`  Decorative icons: ${decorativeCandidates.length}`);
console.log(`  Lotties:          ${lotties.length}`);
console.log(`  Remaining ui-control: ${names.length - matched.length - decorativeCandidates.length}`);
