import { setTimeout } from 'node:timers/promises';

const SYMBOTALK = 'https://symbotalkapiv1.azurewebsites.net';

const words = ['ink', 'vintage', 'hardback', 'upright', 'shelf', 'ornate', 'watercolour', 'background'];

async function main() {
  for (const word of words) {
    try {
      const res = await fetch(`${SYMBOTALK}/search/?name=${encodeURIComponent(word)}&lang=en&repo=arasaac&limit=1`);
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
    } catch (e: any) {
      console.log(`  ${word.padEnd(16)} error: ${e.message?.slice(0, 40)}`);
    }
    await setTimeout(300);
  }
}

main();
