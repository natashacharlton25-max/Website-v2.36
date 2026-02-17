/**
 * Effects Manager — Coordinates the Holy Trinity
 *
 * Prevents PatternOverlay, RevealCanvas, and PhysicsOverlay from
 * competing for CPU/GPU. Uses IntersectionObserver to only run
 * effects that are visible, and prioritises based on focus.
 *
 * Priority tiers:
 *   1. PhysicsOverlay  — heaviest (Matter.js engine + render loop)
 *   2. RevealCanvas     — medium (canvas 2D + proximity on rAF)
 *   3. PatternOverlay   — lightest (CSS-only, GSAP magnetic optional)
 *
 * Strategy:
 * - Only one physics engine runs at a time
 * - Canvas effects pause when off-screen (IntersectionObserver)
 * - PatternOverlay magnetic pauses when Physics is active in same viewport
 * - All effects respect a11y (manager checks once, effects trust it)
 *
 * Features:
 * - Unified RAF loop (single requestAnimationFrame drives all effects)
 * - FPS monitoring with auto-throttle (pauses heaviest at <30fps, recovers at >55fps)
 * - Visibility-based activation/deactivation
 * - Liquid Reveal sync (PhysicsOverlay bodies as RevealCanvas erasers)
 * - GSAP cleanup for physics body removal (fade+scale before destroy)
 * - Tab visibility (pause all when tab is hidden)
 * - Performance budget: caps total active effects
 * - Icon Texture Cache (pre-rendered, colour-keyed Phosphor sprites)
 *
 * Usage:
 *   // Auto-initialises. No manual setup needed.
 *   // Effects register themselves via CustomEvents.
 *   // Or manually:
 *   import { effectsManager } from './effects-manager';
 *   effectsManager.register('physics', element, { engine, runner, render });
 *
 *   // Unified tick (replaces individual rAF loops):
 *   effectsManager.registerTick(canvasEl, (dt) => { drawFrame(dt); });
 *
 *   // Pre-load sprites:
 *   const textures = await effectsManager.textureCache.getTextures(
 *     ['heart', 'star'], 'light', '#3f51b5', 24
 *   );
 *
 * Integrations:
 * - scroll-color-background.ts (colour sync)
 * - pattern-overlay.ts (magnetic pause)
 * - physics-overlay.ts (engine pause/resume)
 * - RevealCanvas (rAF pause)
 * - iconMapper.ts (themed icon selection)
 */

import Matter from 'matter-js';
import { gsap } from 'gsap';
import { createLiquidRevealSync, type LiquidRevealSync, type LiquidRevealOptions } from './liquid-reveal-sync';

/* ==================================================================
   TYPES
   ================================================================== */

type EffectType = 'physics' | 'reveal-canvas' | 'pattern';

interface PhysicsHandle {
  engine: Matter.Engine;
  runner: Matter.Runner;
  render: Matter.Render;
  bodies: Matter.Body[];
}

interface RevealCanvasHandle {
  canvas: HTMLCanvasElement;
  animationId: number | null;
  pause: () => void;
  resume: () => void;
}

interface PatternHandle {
  element: HTMLElement;
  magnetic: boolean;
  pause: () => void;
  resume: () => void;
}

type EffectHandle = PhysicsHandle | RevealCanvasHandle | PatternHandle;

interface RegisteredEffect {
  type: EffectType;
  element: HTMLElement;
  handle: EffectHandle;
  active: boolean;
  visible: boolean;
  priority: number; // 1 = highest (physics), 3 = lowest (pattern)
}

/* ==================================================================
   CONSTANTS
   ================================================================== */

const MAX_ACTIVE_HEAVY = 1;    // Only 1 physics engine at a time
const MAX_ACTIVE_MEDIUM = 2;   // Up to 2 canvas effects
const CLEANUP_FADE_DURATION = 0.5;
const SETTLED_CHECK_INTERVAL = 5000;
const SETTLED_SPEED_THRESHOLD = 0.1;
const SETTLED_ANGULAR_THRESHOLD = 0.01;

/* ==================================================================
   MANAGER
   ================================================================== */

class EffectsManager {
  private effects: Map<HTMLElement, RegisteredEffect> = new Map();
  private observer: IntersectionObserver;
  private tabVisible = true;

  /* ---- Unified RAF loop ---- */
  private rafId: number | null = null;
  private running = false;
  private lastTime = 0;
  private frameCount = 0;
  private fps = 60;
  private fpsInterval: ReturnType<typeof setInterval> | null = null;
  private tickCallbacks: Map<HTMLElement, (dt: number) => void> = new Map();

  /* ---- Performance budget ---- */
  private readonly TARGET_FPS = 55;         // Below this, start throttling
  private readonly CRITICAL_FPS = 30;       // Below this, disable heaviest effect
  private throttling = false;

  /* ---- Liquid reveal syncs ---- */
  private liquidSyncs: Map<string, LiquidRevealSync> = new Map();

  constructor() {
    // IntersectionObserver for visibility tracking
    this.observer = new IntersectionObserver(
      (entries) => this.handleVisibility(entries),
      { rootMargin: '100px', threshold: 0.1 }
    );

    // Tab visibility
    document.addEventListener('visibilitychange', () => {
      this.tabVisible = !document.hidden;
      if (this.tabVisible) {
        this.resumeVisible();
        this.startLoop();
      } else {
        this.pauseAll();
        this.stopLoop();
      }
    });

    // Listen for effect registration events
    document.addEventListener('effects:register', ((e: CustomEvent) => {
      const { type, element, handle } = e.detail;
      this.register(type, element, handle);
    }) as EventListener);

    // FPS monitoring (sample every 2 seconds)
    this.fpsInterval = setInterval(() => {
      this.fps = this.frameCount / 2;
      this.frameCount = 0;
      this.adjustPerformance();
    }, 2000);
  }

  /* ==================================================================
     UNIFIED RAF LOOP
     Single requestAnimationFrame drives all effects.
     Eliminates multiple independent loops fighting for frame budget.
     ================================================================== */

  private startLoop(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  private stopLoop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick(time: number): void {
    if (!this.running) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.05); // Cap delta to 50ms (20fps floor)
    this.lastTime = time;
    this.frameCount++;

    // Tick all active effects that have registered a tick callback
    this.tickCallbacks.forEach((callback, element) => {
      const effect = this.effects.get(element);
      if (effect?.active) {
        callback(dt);
      }
    });

    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  /**
   * Register a per-frame tick callback for an effect.
   * This replaces the effect's internal rAF loop.
   * The manager calls it once per frame when the effect is active.
   *
   * @example
   * effectsManager.registerTick(canvasEl, (dt) => {
   *   // Update proximity circles, draw frame
   *   updateCircles(dt);
   *   drawFrame();
   * });
   */
  registerTick(element: HTMLElement, callback: (dt: number) => void): void {
    this.tickCallbacks.set(element, callback);
    if (!this.running && this.tabVisible) this.startLoop();
  }

  unregisterTick(element: HTMLElement): void {
    this.tickCallbacks.delete(element);
    if (this.tickCallbacks.size === 0) this.stopLoop();
  }

  /* ---- Performance auto-adjustment ---- */

  private adjustPerformance(): void {
    // Skip FPS checks if the RAF loop isn't actively running
    // (no tick callbacks means fps=0 is expected, not a performance problem)
    if (!this.running || this.tickCallbacks.size === 0) return;

    if (this.fps < this.CRITICAL_FPS && !this.throttling) {
      // Emergency: pause the heaviest active effect
      this.throttling = true;
      this.pauseHeaviest();
      console.warn(`[EffectsManager] FPS critical (${this.fps.toFixed(0)}). Paused heaviest effect.`);
    } else if (this.fps >= this.TARGET_FPS && this.throttling) {
      // Recovery: re-enable throttled effects
      this.throttling = false;
      this.resumeVisible();
    }
  }

  private pauseHeaviest(): void {
    // Find the heaviest active effect and deactivate it
    let heaviest: RegisteredEffect | null = null;
    this.effects.forEach((e) => {
      if (e.active && (!heaviest || e.priority < heaviest.priority)) {
        heaviest = e;
      }
    });
    if (heaviest) this.deactivate(heaviest);
  }

  /** Current FPS (read-only, for debug overlay) */
  get currentFps(): number { return this.fps; }

  /** Whether manager is currently throttling effects */
  get isThrottling(): boolean { return this.throttling; }

  /* ---- Registration ---- */

  register(type: EffectType, element: HTMLElement, handle: EffectHandle): void {
    const priority = type === 'physics' ? 1 : type === 'reveal-canvas' ? 2 : 3;

    const effect: RegisteredEffect = {
      type,
      element,
      handle,
      active: false,
      visible: false,
      priority,
    };

    this.effects.set(element, effect);
    this.observer.observe(element);
  }

  unregister(element: HTMLElement): void {
    const effect = this.effects.get(element);
    if (!effect) return;

    if (effect.active) this.deactivate(effect);
    this.observer.unobserve(element);
    this.effects.delete(element);
  }

  /* ---- Visibility ---- */

  private handleVisibility(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      const effect = this.effects.get(entry.target as HTMLElement);
      if (!effect) return;

      effect.visible = entry.isIntersecting;

      if (entry.isIntersecting && this.tabVisible) {
        this.tryActivate(effect);
      } else {
        this.deactivate(effect);
      }
    });
  }

  /* ---- Activation / Budget ---- */

  private tryActivate(effect: RegisteredEffect): void {
    if (effect.active) return;

    // Check budget
    const activePhysics = this.countActive('physics');
    const activeCanvas = this.countActive('reveal-canvas');

    if (effect.type === 'physics' && activePhysics >= MAX_ACTIVE_HEAVY) {
      // Pause lowest-priority physics to make room
      this.pauseLowestPriority('physics');
    }

    if (effect.type === 'reveal-canvas' && activeCanvas >= MAX_ACTIVE_MEDIUM) {
      return; // Hard cap on canvas effects
    }

    // If physics is active in same viewport region, pause pattern magnetic
    if (effect.type === 'pattern') {
      const patternHandle = effect.handle as PatternHandle;
      if (patternHandle.magnetic && this.hasActivePhysicsNear(effect.element)) {
        // Still activate but without magnetic
        patternHandle.pause();
        effect.active = true;
        return;
      }
    }

    this.activate(effect);
  }

  private activate(effect: RegisteredEffect): void {
    if (effect.active) return;
    effect.active = true;

    switch (effect.type) {
      case 'physics': {
        const h = effect.handle as PhysicsHandle;
        Matter.Runner.run(h.runner, h.engine);
        Matter.Render.run(h.render);
        break;
      }
      case 'reveal-canvas': {
        const h = effect.handle as RevealCanvasHandle;
        h.resume();
        break;
      }
      case 'pattern': {
        const h = effect.handle as PatternHandle;
        h.resume();
        break;
      }
    }
  }

  private deactivate(effect: RegisteredEffect): void {
    if (!effect.active) return;
    effect.active = false;

    switch (effect.type) {
      case 'physics': {
        const h = effect.handle as PhysicsHandle;
        Matter.Runner.stop(h.runner);
        Matter.Render.stop(h.render);
        break;
      }
      case 'reveal-canvas': {
        const h = effect.handle as RevealCanvasHandle;
        h.pause();
        break;
      }
      case 'pattern': {
        const h = effect.handle as PatternHandle;
        h.pause();
        break;
      }
    }
  }

  /* ---- Helpers ---- */

  private countActive(type: EffectType): number {
    let count = 0;
    this.effects.forEach((e) => { if (e.type === type && e.active) count++; });
    return count;
  }

  private pauseLowestPriority(type: EffectType): void {
    let lowest: RegisteredEffect | null = null;
    this.effects.forEach((e) => {
      if (e.type === type && e.active) {
        if (!lowest || e.priority > lowest.priority) lowest = e;
      }
    });
    if (lowest) this.deactivate(lowest);
  }

  private hasActivePhysicsNear(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    let found = false;
    this.effects.forEach((e) => {
      if (e.type === 'physics' && e.active) {
        const pr = e.element.getBoundingClientRect();
        // Overlapping vertically?
        if (rect.top < pr.bottom && rect.bottom > pr.top) found = true;
      }
    });
    return found;
  }

  private pauseAll(): void {
    this.effects.forEach((e) => this.deactivate(e));
  }

  private resumeVisible(): void {
    this.effects.forEach((e) => {
      if (e.visible) this.tryActivate(e);
    });
  }

  /* ==================================================================
     LIQUID REVEAL — Sync PhysicsOverlay bodies as RevealCanvas erasers
     Uses standalone liquid-reveal-sync module for full eraser/live modes.
     ================================================================== */

  /**
   * Connect a PhysicsOverlay to a RevealCanvas so falling icons
   * "scratch off" the canvas to reveal the image underneath.
   *
   * @param physicsEl — the .physics-overlay container
   * @param canvasEl  — the .reveal-canvas <canvas> element
   * @param options   — LiquidRevealOptions (mode, radiusPadding, etc.)
   */
  syncLiquidReveal(
    physicsEl: HTMLElement,
    canvasEl: HTMLCanvasElement,
    options?: LiquidRevealOptions
  ): void {
    const key = `${physicsEl.id || 'p'}-${canvasEl.id || 'c'}`;

    // Don't double-sync
    if (this.liquidSyncs.has(key)) return;

    const sync = createLiquidRevealSync(physicsEl, canvasEl, options);
    this.liquidSyncs.set(key, sync);
  }

  /**
   * Disconnect a specific PhysicsOverlay ↔ RevealCanvas sync.
   */
  unsyncLiquidReveal(physicsEl: HTMLElement, canvasEl: HTMLCanvasElement): void {
    const key = `${physicsEl.id || 'p'}-${canvasEl.id || 'c'}`;
    const sync = this.liquidSyncs.get(key);
    if (sync) {
      sync.destroy();
      this.liquidSyncs.delete(key);
    }
  }

  /**
   * Destroy all active liquid reveal syncs.
   */
  destroyAllSyncs(): void {
    this.liquidSyncs.forEach(sync => sync.destroy());
    this.liquidSyncs.clear();
  }

  /* ==================================================================
     GSAP CLEANUP — Smooth removal of settled physics bodies
     ================================================================== */

  /**
   * Enable GSAP-powered fade+scale removal for settled bodies
   * in a PhysicsOverlay. Much smoother than instant removal.
   *
   * Call after registration:
   *   effectsManager.enableGSAPCleanup(physicsElement);
   */
  enableGSAPCleanup(physicsEl: HTMLElement, options: {
    checkInterval?: number;
    speedThreshold?: number;
    angularThreshold?: number;
    floorThreshold?: number;
    capacityThreshold?: number;
  } = {}): void {
    const effect = this.effects.get(physicsEl);
    if (!effect || effect.type !== 'physics') return;

    const physics = effect.handle as PhysicsHandle;
    const {
      checkInterval = SETTLED_CHECK_INTERVAL,
      speedThreshold = SETTLED_SPEED_THRESHOLD,
      angularThreshold = SETTLED_ANGULAR_THRESHOLD,
      floorThreshold = 0.85,
      capacityThreshold = 0.8,
    } = options;

    setInterval(() => {
      if (!effect.active) return;

      const height = physicsEl.getBoundingClientRect().height;
      const maxBodies = physics.bodies.length;

      // Only clean up when over capacity threshold
      const config = JSON.parse(physicsEl.dataset.physicsConfig || '{}');
      if (maxBodies <= (config.count || 30) * capacityThreshold) return;

      physics.bodies.forEach((body, idx) => {
        if (body.speed > speedThreshold || body.angularSpeed > angularThreshold) return;
        if (body.position.y < height * floorThreshold) return;

        // GSAP fade+scale before Matter.js removal
        const sprite = body.render.sprite;
        if (!sprite) {
          Matter.Composite.remove(physics.engine.world, body);
          physics.bodies.splice(idx, 1);
          return;
        }

        gsap.to(sprite, {
          xScale: 0,
          yScale: 0,
          duration: CLEANUP_FADE_DURATION,
          ease: 'power2.in',
          onUpdate: () => {
            // Also fade opacity
            if (body.render.opacity !== undefined) {
              body.render.opacity = Math.max(0, body.render.opacity - 0.02);
            }
          },
          onComplete: () => {
            Matter.Composite.remove(physics.engine.world, body);
            const i = physics.bodies.indexOf(body);
            if (i > -1) physics.bodies.splice(i, 1);
          },
        });
      });
    }, checkInterval);
  }

  /* ==================================================================
     LUMINANCE-WEIGHTED MASS — heavier icons fall faster
     ================================================================== */

  /**
   * Adjust physics body mass based on icon colour luminance.
   * Darker = heavier = falls faster. Lighter = floatier.
   *
   * @param physicsEl — the PhysicsOverlay container
   * @param minMass — mass for lightest icons (default: 0.5)
   * @param maxMass — mass for darkest icons (default: 3)
   */
  applyLuminanceMass(physicsEl: HTMLElement, minMass = 0.5, maxMass = 3): void {
    const effect = this.effects.get(physicsEl);
    if (!effect || effect.type !== 'physics') return;

    const physics = effect.handle as PhysicsHandle;

    // Get the resolved colour
    const config = JSON.parse(physicsEl.dataset.physicsConfig || '{}');
    const color = config.color || 'var(--brand-c-primary)';
    const resolved = resolveColorToRGB(color);
    const luminance = getLuminance(resolved);

    // Map luminance (0 = dark, 1 = light) to mass (high = heavy, low = light)
    const mass = maxMass - (luminance * (maxMass - minMass));

    physics.bodies.forEach((body) => {
      Matter.Body.setMass(body, mass);
    });
  }
}

/* ==================================================================
   UTILITY — Colour helpers
   ================================================================== */

function resolveColorToRGB(cssVar: string): { r: number; g: number; b: number } {
  const temp = document.createElement('div');
  let color = cssVar;
  if (cssVar.startsWith('var(')) {
    const varName = cssVar.match(/var\((.*?)\)/)?.[1];
    if (varName) {
      color = getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || cssVar;
    }
  }
  temp.style.backgroundColor = color;
  temp.style.display = 'none';
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).backgroundColor;
  document.body.removeChild(temp);

  const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return { r: 128, g: 128, b: 128 };
  return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
}

function getLuminance(rgb: { r: number; g: number; b: number }): number {
  // Relative luminance (0 = black, 1 = white)
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

/* ==================================================================
   ICON TEXTURE CACHE
   Pre-renders Phosphor SVGs as colour-keyed Image objects.
   Eliminates redundant fetch + re-encode per body spawn.
   ================================================================== */

class IconTextureCache {
  private cache: Map<string, string> = new Map(); // key → blob URL
  private pending: Map<string, Promise<string>> = new Map();

  /** Build a cache key from icon path + colour + size */
  private key(path: string, color: string, size: number): string {
    return `${path}|${color}|${size}`;
  }

  /**
   * Get a single icon texture (blob URL). Cached after first fetch.
   */
  async getTexture(iconPath: string, color: string, size: number): Promise<string> {
    const k = this.key(iconPath, color, size);

    // Return cached
    if (this.cache.has(k)) return this.cache.get(k)!;

    // Return in-flight (dedup concurrent requests for same icon)
    if (this.pending.has(k)) return this.pending.get(k)!;

    const promise = this.createTexture(iconPath, color, size);
    this.pending.set(k, promise);

    try {
      const url = await promise;
      this.cache.set(k, url);
      return url;
    } finally {
      this.pending.delete(k);
    }
  }

  /**
   * Batch-load multiple icon textures. Returns in same order as input.
   */
  async getTextures(
    iconNames: string[],
    weight: string = 'light',
    color: string = '#000000',
    size: number = 24
  ): Promise<string[]> {
    const paths = iconNames.map(name =>
      `/Icons/phosphor/${name}${weight !== 'regular' ? `-${weight}` : ''}.svg`
    );

    return Promise.all(paths.map(p => this.getTexture(p, color, size)));
  }

  /**
   * Re-tint all cached textures with a new colour.
   * Used when scroll-color-background changes the theme.
   * Returns new blob URLs (old ones are revoked).
   */
  async retint(newColor: string): Promise<void> {
    const entries = Array.from(this.cache.entries());
    const resolvedColor = resolveColorToRGB(newColor);
    const hex = `rgb(${resolvedColor.r}, ${resolvedColor.g}, ${resolvedColor.b})`;

    for (const [key, oldUrl] of entries) {
      const [path, , sizeStr] = key.split('|');
      const size = parseInt(sizeStr);
      const newUrl = await this.createTexture(path, hex, size);

      // Revoke old blob to free memory
      URL.revokeObjectURL(oldUrl);
      this.cache.set(this.key(path, hex, size), newUrl);
      // Remove old colour entry
      this.cache.delete(key);
    }
  }

  /** Number of cached textures */
  get size(): number { return this.cache.size; }

  /** Revoke all blob URLs and clear cache */
  dispose(): void {
    this.cache.forEach(url => URL.revokeObjectURL(url));
    this.cache.clear();
    this.pending.clear();
  }

  /* ---- Internal ---- */

  private async createTexture(iconPath: string, color: string, size: number): Promise<string> {
    try {
      const resp = await fetch(iconPath);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      let svgText = await resp.text();

      // Resolve CSS variable if needed
      let resolvedColor = color;
      if (color.startsWith('var(')) {
        const rgb = resolveColorToRGB(color);
        resolvedColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      }

      // Inject fill colour — handles both <svg fill="..."> and no-fill cases
      if (svgText.includes('fill=')) {
        svgText = svgText.replace(/fill="[^"]*"/g, `fill="${resolvedColor}"`);
      } else {
        svgText = svgText.replace(/<svg/, `<svg fill="${resolvedColor}"`);
      }

      // Set dimensions
      svgText = svgText
        .replace(/width="[^"]*"/, `width="${size}"`)
        .replace(/height="[^"]*"/, `height="${size}"`);

      // Create blob URL (more efficient than base64 data URI)
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.warn(`[TextureCache] Failed to load ${iconPath}:`, err);
      // Return a fallback circle SVG
      const fallback = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="${color}"/></svg>`;
      const blob = new Blob([fallback], { type: 'image/svg+xml' });
      return URL.createObjectURL(blob);
    }
  }
}

/* ==================================================================
   SINGLETON EXPORT
   ================================================================== */

const textureCache = new IconTextureCache();

export const effectsManager = Object.assign(new EffectsManager(), {
  textureCache,
});

// Expose globally for cross-script access
if (typeof window !== 'undefined') {
  (window as any).effectsManager = effectsManager;
}
