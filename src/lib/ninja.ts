import { getOrSet } from './edge-cache';

function getEnvValue(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key];
  if (import.meta.env && import.meta.env[key]) return import.meta.env[key];
  return undefined;
}

export async function getRandomQuote(): Promise<{ quote: string; author: string } | null> {
  const apiKey = getEnvValue('NINJA_API_KEY');
  if (!apiKey) return null;

  const today = new Date().toISOString().slice(0, 10);
  return await getOrSet(`ninja-quote-${today}`, async () => {
    const categories = ['computers', 'funny', 'art', 'knowledge', 'science', 'success', 'humor'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
        headers: { 'X-Api-Key': apiKey }
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data[0] || null;
    } catch (e) {
      console.error('[API Ninjas Quotes Error]', e);
      return null;
    }
  }, 86400);
}

export async function getRandomJoke(): Promise<string | null> {
  const apiKey = getEnvValue('NINJA_API_KEY');
  if (!apiKey) return null;

  const today = new Date().toISOString().slice(0, 10);
  return await getOrSet(`ninja-joke-${today}`, async () => {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/jokes?limit=1', {
        headers: { 'X-Api-Key': apiKey }
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data[0]?.joke || null;
    } catch (e) {
      console.error('[API Ninjas Jokes Error]', e);
      return null;
    }
  }, 86400);
}
