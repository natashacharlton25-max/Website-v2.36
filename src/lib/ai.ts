/**
 * AI Vibe Engine
 * Dynamically generates creative prompts and profile text using Google Gemini, Groq, or OpenAI.
 * Uses the 28-Personality Prompt Generator Engine for deterministic, unique voices.
 */
import { selectPersonality } from './personalities';
import { getOrSet } from './edge-cache';

interface AIConfig {
  provider: 'gemini' | 'groq' | 'openai';
  apiKey: string;
  endpoint: string;
  model: string;
}

function getEnvValue(key: string): string | undefined {
  // 1. Try system env first
  if (typeof process !== 'undefined' && process.env[key]) {
    return process.env[key];
  }
  // 2. Try Vite import.meta.env
  if (import.meta && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return undefined;
}

function getAIConfig(): AIConfig | null {
  const localEndpoint = getEnvValue('LOCAL_AI_ENDPOINT');
  const localModel = getEnvValue('LOCAL_AI_MODEL');

  // Prioritize Local AI if configured in .env
  if (localEndpoint) {
    return {
      provider: 'openai',
      apiKey: 'none',
      endpoint: localEndpoint,
      model: localModel || 'llama3'
    };
  }

  const openAiKey = getEnvValue('OPENAI_API_KEY');
  const geminiKey = getEnvValue('GOOGLE_AI_API_KEY');
  const groqKey = getEnvValue('GROQ_API_KEY');

  // Prioritize OpenAI first
  if (openAiKey) {
    return {
      provider: 'openai',
      apiKey: openAiKey,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini'
    };
  }

  // Fallback to Gemini (free tier)
  if (geminiKey) {
    return {
      provider: 'gemini',
      apiKey: geminiKey,
      endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      model: 'gemini-2.5-flash'
    };
  }

  // Fallback to Groq (fast free tier)
  if (groqKey) {
    return {
      provider: 'groq',
      apiKey: groqKey,
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.3-70b-versatile'
    };
  }

  return null;
}

export async function callLLM(prompt: string): Promise<string | null> {
  const config = getAIConfig();
  if (!config) {
    console.warn('No AI API Key or Local AI configured.');
    return null;
  }

  try {
    if (config.provider === 'gemini') {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        console.error('Gemini API Error:', await response.text());
        return null;
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    } else {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (config.apiKey && config.apiKey !== 'none') {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
        })
      });

      if (!response.ok) {
        console.error(`${config.provider.toUpperCase()} API Error:`, await response.text());
        return null;
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || null;
    }
  } catch (err) {
    console.error('Failed to call AI:', err);
    return null;
  }
}

/**
 * Generates an aesthetic search query for the NASA/Unsplash API.
 * Uses a personality-driven tone for unique vibe queries.
 */
export async function generateVibeQuery(planetName: string): Promise<string> {
  const cached = await getOrSet(`vibe-${planetName}`, async () => {
    const personality = selectPersonality(`vibe:${planetName}`);
    const prompt = `You are an art director channeling the personality "${personality.name}": ${personality.tone}
Generate a 3-4 word visual search query to find an incredibly aesthetic, atmospheric photo of ${planetName} or its environment. Return ONLY the search words, no quotes or explanation.`;

    const query = await callLLM(prompt);
    return query || `${planetName} planet space`;
  }, 86400 * 30);
  return cached || `${planetName} planet space`;
}

/**
 * Generates a creative bio for the planet profile.
 * Each celestial body always gets the SAME personality (deterministic hash of name).
 */
export async function generateCosmicBio(planetName: string): Promise<string> {
  const personality = selectPersonality(planetName);
  const fallbackBio = `Just orbiting. ${personality.emojis} #space #${planetName}`;

  const cached = await getOrSet(`bio-${planetName}`, async () => {
    const prompt = `You are writing an Instagram-style bio for a celestial social media platform called Cosmogram.

Target Object: ${planetName}
Adopt this Personality Archetype: "${personality.name}"
Tone: ${personality.tone}
Emoji Style: ${personality.emojis}

Constraint: Write a punchy bio, maximum 25 words. Blend scientific facts seamlessly with the personality archetype. Make it witty, evocative, and ready for a social profile header. Use the required emoji style. No filler text. Return ONLY the bio text.`;

    const bio = await callLLM(prompt);
    return bio || fallbackBio;
  }, 86400 * 30);
  return cached || fallbackBio;
}

// ─── 4-Style Caption Engine ───────────────────────────────────────────────────

interface CaptionStyle {
  name: string;
  color: string;
  minWords: number;
  maxWords: number;
  tone: string;
  dataPoints: string[];
  emojis: string;
}

const CAPTION_STYLES: CaptionStyle[] = [
  {
    name: 'Thrill Seeker',
    color: 'red',
    minWords: 3,
    maxWords: 8,
    tone: 'Young, fast-paced, high-energy, explosive. Action words and punchy hype. Like a thrill seeker posting from the edge of the universe.',
    dataPoints: ['action', 'speed', 'adrenaline', 'scale', 'impact'],
    emojis: '🚀🔥⚡'
  },
  {
    name: 'Chill Realist',
    color: 'green',
    minWords: 10,
    maxWords: 18,
    tone: 'Calm, warm, grounded, genuine. Wholesome but to the point. Like someone who quietly appreciates the moment without overthinking it.',
    dataPoints: ['texture', 'colour', 'atmosphere', 'natural beauty', 'quiet wonder'],
    emojis: '🌿🌍☀️'
  },
  {
    name: 'Empathetic Soul',
    color: 'blue',
    minWords: 22,
    maxWords: 38,
    tone: 'Heartfelt, reflective, emotional. Add depth and explain why this image moves you. Like someone who feels deeply and wants others to feel it too.',
    dataPoints: ['emotion', 'connection', 'meaning', 'human experience', 'vulnerability'],
    emojis: '💙🌊🫂'
  },
  {
    name: 'The Philosopher',
    color: 'purple',
    minWords: 38,
    maxWords: 60,
    tone: 'Deep, philosophical, poetic and quote-worthy. Channel great thinkers. Reference cosmic scale, existence, time, consciousness. Build to a profound insight.',
    dataPoints: ['existence', 'infinity', 'time', 'consciousness', 'cosmic perspective', 'the sublime'],
    emojis: '🔮✨🌌'
  }
];

export async function generateCaption(
  planetName: string,
  visualContext: string,
  index: number = 0
): Promise<string> {
  const style = CAPTION_STYLES[index % CAPTION_STYLES.length];
  const fallback = `${planetName} ${style.emojis.substring(0, 4)}`;

  return (await getOrSet(`caption-${planetName}-${index}`, async () => {
    const targetWords = Math.floor(
      Math.random() * (style.maxWords - style.minWords + 1) + style.minWords
    );

    const personality = selectPersonality(`caption:${planetName}:${index}`);

    const prompt = `You are writing a photo caption for a celestial social media platform called Cosmogram.

Planet: ${planetName}
Image context: ${visualContext}

Caption Style: "${style.name}" (${style.color})
Tone: ${style.tone}
Focus on these data points from the image: ${style.dataPoints.join(', ')}.
Personality voice layered on top: "${personality.name}" (Tone: ${personality.tone})

STRICT CONSTRAINTS:
1. NEVER use em-dashes (— or -- or - representing a dash punctuation break) in your output. Use commas, semicolons, parentheses, or periods instead.
2. Use ONLY a few emojis (maximum 1 or 2 emojis matching the style), NOT a stack or sequence of them.
3. STRICT word count: Write EXACTLY ${targetWords} words (±2 words maximum). Not shorter, not longer.

Return ONLY the caption text. No hashtags. No quotes around the caption.`;

    const caption = await callLLM(prompt);
    return caption || fallback;
  }, 86400 * 30)) || fallback;
}

export async function generateProfileData(name: string): Promise<any> {
  return await getOrSet(`profile-data-${name}`, async () => {
    const prompt = `You are a space cataloging agent. Create a structured profile for the celestial body or astronomical object named "${name}".
Respond ONLY with a valid JSON block of this schema, and no other text or explanation:
{
  "id": "lowercase-slug",
  "handle": "unique-handle-starting-with-@",
  "type": "type of object (e.g. Planet, Gas Giant, Moon, Star, Comet)",
  "bio": "A single-sentence descriptive, modern, and engaging biography.",
  "distance": "Average distance from Earth (e.g. '225M km' or '1.4B km' or '4.2 light years')",
  "magnitude": "Apparent magnitude from Earth (e.g. '-2.94' or '0.5' or '5.38')",
  "discovered": "Discovery year, or 'Antiquity' if ancient (e.g. '1781' or 'Antiquity')",
  "themeColor": "Choose ONE from: 'rose', 'amber', 'sky', 'purple', 'emerald', 'indigo'"
}
Ensure that the JSON is fully parseable. Do not include markdown code block markers (\`\`\`json) in your response, just the raw JSON.`;

    const result = await callLLM(prompt);
    if (!result) return null;

    try {
      const cleanJson = result.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error('Failed to parse AI profile response:', result, e);
      return null;
    }
  }, 86400 * 30);
}
