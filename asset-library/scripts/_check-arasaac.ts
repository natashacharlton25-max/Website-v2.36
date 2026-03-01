import { setTimeout } from 'node:timers/promises';

const SYMBOTALK = 'https://symbotalkapiv1.azurewebsites.net';

const words = [
  'hand-drawn', 'ink', 'illustration', 'vintage', 'hardback',
  'standing', 'upright', 'shelf', 'decorative', 'spines',
  'ornate', 'lettering', 'against', 'warm', 'golden',
  'watercolour', 'wash', 'background',
];

async function main() {
  for (const word of words) {
    const clean = word.replace(/-/g, ' ');
    try {
      const res = await fetch(`${SYMBOTALK}/search/?name=${encodeURIComponent(clean)}&lang=en&repo=arasaac&limit=1`);
      if (res.ok) {
        const results = await res.json() as any[];
        if (Array.isArray(results) && results.length > 0 && results[0].image_url) {
          console.log(`  ${word.padEnd(16)} AAC YES`);
        } else {
          console.log(`  ${word.padEnd(16)} no`);
        }
      } else {
        console.log(`  ${word.padEnd(16)} no (${res.status})`);
      }
    } catch {
      console.log(`  ${word.padEnd(16)} error`);
    }
    await setTimeout(120);
  }
}

main();
