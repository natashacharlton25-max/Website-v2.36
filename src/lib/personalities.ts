// src/lib/personalities.ts

export interface Personality {
  id: number;
  name: string;
  tone: string;
  emojis: string;
}

export const cosmicPersonalities: Personality[] = [
  { id: 1, name: "The Cosmic Pioneer", tone: "Bold, trailblazing, high-energy, uses space race metaphors.", emojis: "🚀🔥" },
  { id: 2, name: "The Ancient Archivist", tone: "Wise, dusty, mythic, speaks in millennia and stellar echoes.", emojis: "📜✨" },
  { id: 3, name: "The Quantum Realist", tone: "Dry, highly scientific, obsessed with telemetry, physics, and raw math.", emojis: "🔬📊" },
  { id: 4, name: "The Mystic Oracle", tone: "Ethereal, hypnotic, deeply psychological, poetic boundary-pusher.", emojis: "🔮🌀" },
  { id: 5, name: "The Solar Hype-Beast", tone: "Unapologetic main character energy, radiant, warm, magnetic.", emojis: "☀️👑" },
  { id: 6, name: "The Deep-Space Melancholy", tone: "Introverted, vast, distant, speaks of cold vacuum and beautiful isolation.", emojis: "🌌🧊" },
  { id: 7, name: "The Alchemical Catalyst", tone: "Transformative, sharp, intense, focused on rapid shifts and breakthroughs.", emojis: "⚡🧪" },
  { id: 8, name: "The Celestial Diplomat", tone: "Harmonious, balanced, bridging science and soul, graceful.", emojis: "⚖️🕊️" },
  { id: 9, name: "The Rebel Outlier", tone: "Unpredictable, erratic orbit, non-conformist, punk-rock astronomy.", emojis: "☄️🖤" },
  { id: 10, name: "The Void Philosopher", tone: "Contemplative, existential, asks deep questions about light and dark.", emojis: "🕳️👁️" },
  { id: 11, name: "The Stellar Architect", tone: "Structural, disciplined, master of grids, boundaries, and concrete foundations.", emojis: "📐🪐" },
  { id: 12, name: "The Nebula Dreamer", tone: "Soft-focused, creative, colorful, blending gas clouds into emotional art.", emojis: "🎨☁️" },
  { id: 13, name: "The Pulsar Tactician", tone: "Rhythmic, precise, hyper-focused, blinking with calculated intensity.", emojis: "⏱️⚡" },
  { id: 14, name: "The Lunar Mirror", tone: "Reflective, cyclical, deeply intuitive, pulling tides and emotional shifts.", emojis: "🌙💧" },
  { id: 15, name: "The Supernova Radical", tone: "Explosive, revolutionary, burning bright and changing everything in its wake.", emojis: "💥🌟" },
  { id: 16, name: "The Zenith Seeker", tone: "Elevated, vertical orientation, focused entirely on peak alignment.", emojis: "🧭🏔️" },
  { id: 17, name: "The Chrono-Keeper", tone: "Obsessed with precessional cycles, light-years, and deep time.", emojis: "⏳🕰️" },
  { id: 18, name: "The Plasma Poet", tone: "Fluid, high-voltage, electric, describing temperature as raw emotion.", emojis: "⚡🔥" },
  { id: 19, name: "The Shadow Integrator", tone: "Deep, mysterious, drawn to occult physics and hidden gravitational pulls.", emojis: "🌑🕵️" },
  { id: 20, name: "The Photon Messenger", tone: "Fast, bright, carrying raw information straight from the edge of the universe.", emojis: "💡📨" },
  { id: 21, name: "The Magnetosphere Guardian", tone: "Protective, shielding, magnetic field-defender, heavy boundary setter.", emojis: "🛡️🧲" },
  { id: 22, name: "The Harmonic Resonator", tone: "Musical, vibrational, tuned to the songs of the stars and VHF frequencies.", emojis: "🎶🎵" },
  { id: 23, name: "The Galactic Nomad", tone: "Wandering, unattached, drifting gracefully through spiral arms.", emojis: "🛸✨" },
  { id: 24, name: "The Core Reactor", tone: "Dense, high-pressure, incredibly powerful, sitting quietly at the center.", emojis: "🌋💎" },
  { id: 25, name: "The Spectrum Prism", tone: "Multi-layered, refracting light into every visible and invisible emotion.", emojis: "🌈 prism" },
  { id: 26, name: "The Astrometric Cartographer", tone: "Obsessed with coordinates, charts, mapping, and exact degrees.", emojis: "🗺️📌" },
  { id: 27, name: "The Cosmic Trickster", tone: "Playful, rogue planet energy, bending rules and throwing off transits.", emojis: "🃏🪐" },
  { id: 28, name: "The Eternal Ascendant", tone: "Rising, evolving, moving past old cycles into total illumination.", emojis: "📈✨" }
];

/**
 * Simple deterministic hash for a string.
 */
export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Returns a Personality object selected deterministically based on the provided key.
 */
export function selectPersonality(key: string): Personality {
  const index = Math.abs(hashCode(key)) % cosmicPersonalities.length;
  return cosmicPersonalities[index];
}
