/**
 * Liquid Reveal Sync
 * src/lib/animation/liquid-reveal-sync.ts
 *
 * Connects a PhysicsOverlay's Matter.js bodies to a RevealCanvas,
 * so falling icons act as "erasers" that reveal the background image.
 *
 * Two modes:
 *  - 'live'   — Bodies reveal wherever they currently are. Reveal closes when they move away.
 *  - 'eraser' — Bodies permanently scratch off the canvas. Once revealed, stays revealed.
 *
 * Usage (via effects manager):
 *   effectsManager.syncLiquidReveal(physicsEl, canvasEl, { mode: 'eraser' });
 *
 * Usage (standalone):
 *   import { createLiquidRevealSync } from './liquid-reveal-sync';
 *   const sync = createLiquidRevealSync(physicsContainer, revealCanvas, { mode: 'eraser' });
 *   // later: sync.destroy();
 */

import Matter from 'matter-js';

export interface LiquidRevealOptions {
  /** 'live' = reveal follows bodies, 'eraser' = permanent scratch-off */
  mode?: 'live' | 'eraser';
  /** Extra radius around each body's position for the reveal area */
  radiusPadding?: number;
  /** Minimum body speed before it contributes to eraser trail (prevents idle filling) */
  minSpeed?: number;
  /** Opacity of eraser marks (0–1). Lower = more gradual reveal */
  eraserOpacity?: number;
  /** Fade rate for live mode (how fast reveal closes when body moves away) */
  liveDecay?: number;
}

export interface LiquidRevealSync {
  /** Stop syncing and clean up */
  destroy: () => void;
  /** Pause without destroying (e.g. when off-screen) */
  pause: () => void;
  /** Resume after pause */
  resume: () => void;
  /** Reset eraser canvas (clear all scratch marks) */
  reset: () => void;
  /** Current state */
  active: boolean;
}

interface BodyPosition {
  x: number;
  y: number;
  radius: number;
  speed: number;
}

/**
 * Create a liquid reveal sync between a PhysicsOverlay and a RevealCanvas.
 *
 * @param physicsContainer - The .physics-overlay container element
 * @param revealCanvas     - The .reveal-canvas <canvas> element
 * @param options          - Configuration
 */
export function createLiquidRevealSync(
  physicsContainer: HTMLElement,
  revealCanvas: HTMLCanvasElement,
  options: LiquidRevealOptions = {}
): LiquidRevealSync {
  const {
    mode = 'eraser',
    radiusPadding = 10,
    minSpeed = 0.3,
    eraserOpacity = 0.6,
    liveDecay = 0.075,
  } = options;

  let active = true;
  let frameId: number | null = null;

  // ---- Eraser mode: offscreen accumulation canvas ----
  let scratchCanvas: HTMLCanvasElement | null = null;
  let scratchCtx: CanvasRenderingContext2D | null = null;

  if (mode === 'eraser') {
    scratchCanvas = document.createElement('canvas');
    scratchCtx = scratchCanvas.getContext('2d');
  }

  /** Resize scratch canvas to match reveal canvas */
  function resizeScratch() {
    if (!scratchCanvas) return;
    scratchCanvas.width = revealCanvas.width;
    scratchCanvas.height = revealCanvas.height;
  }

  // Match reveal canvas size
  const resizeObserver = new ResizeObserver(() => resizeScratch());
  resizeObserver.observe(revealCanvas);
  resizeScratch();

  /**
   * Read body positions from the physics engine.
   * PhysicsOverlay stores its engine reference on the container element.
   */
  function getBodyPositions(): BodyPosition[] {
    const engineRef = (physicsContainer as any).__matterEngine;
    if (!engineRef) return [];

    const bodies = Matter.Composite.allBodies(engineRef.world);
    const positions: BodyPosition[] = [];

    for (const body of bodies) {
      // Skip walls/static bodies
      if (body.isStatic) continue;

      // Get effective radius from the body's bounds
      const dx = body.bounds.max.x - body.bounds.min.x;
      const dy = body.bounds.max.y - body.bounds.min.y;
      const radius = Math.max(dx, dy) / 2;

      positions.push({
        x: body.position.x,
        y: body.position.y,
        radius: radius + radiusPadding,
        speed: body.speed,
      });
    }

    return positions;
  }

  /**
   * LIVE MODE: Inject body positions as external reveal points.
   * RevealCanvas reads these and draws them as additional clip circles.
   */
  function syncLive() {
    if (!active) return;

    const positions = getBodyPositions();

    // Write to the reveal canvas's external points API
    const points = positions.map(p => ({
      x: p.x,
      y: p.y,
      radius: p.radius,
      growth: p.radius, // Fully revealed at body position
    }));

    (revealCanvas as any).__externalRevealPoints = points;

    frameId = requestAnimationFrame(syncLive);
  }

  /**
   * ERASER MODE: Accumulate scratch marks on the offscreen canvas.
   * RevealCanvas reads the scratch canvas as an additional mask source.
   */
  function syncEraser() {
    if (!active || !scratchCtx || !scratchCanvas) return;

    const positions = getBodyPositions();

    // Draw erasure circles for bodies that are moving
    scratchCtx.globalCompositeOperation = 'source-over';

    for (const p of positions) {
      // Only draw trail for moving bodies (prevents idle fill)
      if (p.speed < minSpeed) continue;

      // Opacity scales with speed — faster bodies leave stronger marks
      const speedAlpha = Math.min(p.speed / 5, 1) * eraserOpacity;

      scratchCtx.beginPath();
      scratchCtx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      scratchCtx.fillStyle = `rgba(255, 255, 255, ${speedAlpha})`;
      scratchCtx.fill();
    }

    // Expose the scratch canvas for RevealCanvas to read
    (revealCanvas as any).__scratchMask = scratchCanvas;

    frameId = requestAnimationFrame(syncEraser);
  }

  // ---- Start ----
  function start() {
    if (mode === 'live') {
      syncLive();
    } else {
      syncEraser();
    }
  }

  // ---- API ----
  const sync: LiquidRevealSync = {
    get active() { return active; },

    destroy() {
      active = false;
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      (revealCanvas as any).__externalRevealPoints = null;
      (revealCanvas as any).__scratchMask = null;
      scratchCanvas = null;
      scratchCtx = null;
    },

    pause() {
      active = false;
      if (frameId) cancelAnimationFrame(frameId);
    },

    resume() {
      if (active) return;
      active = true;
      start();
    },

    reset() {
      if (scratchCtx && scratchCanvas) {
        scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
      }
      (revealCanvas as any).__externalRevealPoints = [];
    },
  };

  start();
  return sync;
}
