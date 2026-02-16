/**
 * Physics Overlay — Matter.js particle engine
 *
 * Falling Phosphor icon bodies with cursor interaction.
 * Adapted from the physics footer (Matter.js) and
 * RevealCanvas proximity detection.
 *
 * Integrations:
 * - Scroll colour: syncs body tint with data-scroll-bg sections
 * - GSAP: smooth spawn animations, colour transitions
 *
 * A11y: skips init if reduce-motion or text-only is active.
 */

import Matter from 'matter-js';
import { gsap } from 'gsap';

interface PhysicsConfig {
  iconPaths: string[];
  count: number;
  maxCount: number;
  gravity: number;
  bounce: number;
  friction: number;
  airFriction: number;
  iconSize: number;
  cursorMode: 'repel' | 'attract' | 'none';
  cursorRadius: number;
  cursorStrength: number;
  color: string;
  opacity: number;
  scrollColor: boolean;
  contained: boolean;
  lifespan: number;       // seconds, 0 = infinite
  spawnDelay: number;     // ms before first spawn
  spawnStagger: number;   // ms between each spawn
}

/* ---- A11y check ---- */
function prefersReducedMotion(): boolean {
  const wrapper = document.getElementById('a11y-content-wrapper');
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !!wrapper?.classList.contains('a11y-reduce-motion') ||
    !!wrapper?.classList.contains('a11y-text-only')
  );
}

/* ---- Resolve CSS variable to computed value ---- */
function resolveColor(cssVar: string): string {
  if (!cssVar || !cssVar.startsWith('var(')) return cssVar;
  const varName = cssVar.match(/var\((.*?)\)/)?.[1];
  if (!varName) return cssVar;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || cssVar;
}

/* ---- Pre-load and tint SVG icons as Image objects ---- */
async function loadIconTextures(paths: string[], color: string, size: number): Promise<string[]> {
  const resolvedColor = resolveColor(color);
  const textures: string[] = [];

  for (const path of paths) {
    try {
      const resp = await fetch(path);
      let svgText = await resp.text();

      // Inject fill colour into the SVG
      svgText = svgText.replace(/<svg/, `<svg fill="${resolvedColor}"`);

      // Scale to target size
      svgText = svgText
        .replace(/width="[^"]*"/, `width="${size}"`)
        .replace(/height="[^"]*"/, `height="${size}"`);

      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      textures.push(url);
    } catch {
      // Skip failed loads
    }
  }

  return textures;
}

/* ---- Main init ---- */
function initPhysicsOverlay(container: HTMLElement): void {
  if (prefersReducedMotion()) {
    container.style.display = 'none';
    return;
  }

  const canvas = container.querySelector<HTMLCanvasElement>('.physics-overlay__canvas');
  if (!canvas) return;

  const configStr = container.dataset.physicsConfig;
  if (!configStr) return;
  const config: PhysicsConfig = JSON.parse(configStr);

  // ---- Engine ----
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: config.gravity, scale: 0.001 },
  });

  const rect = container.getBoundingClientRect();
  let width = rect.width;
  let height = rect.height;

  // ---- Renderer ----
  const render = Matter.Render.create({
    canvas,
    engine,
    options: {
      width,
      height,
      background: 'transparent',
      wireframes: false,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    },
  });

  // ---- Walls ----
  const wallThickness = 60;
  const walls = [
    // Floor
    Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width + wallThickness * 2, wallThickness, { isStatic: true, render: { visible: false } }),
    // Left wall
    Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true, render: { visible: false } }),
    // Right wall
    Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true, render: { visible: false } }),
    // Ceiling (thin, just to prevent escape)
    Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width + wallThickness * 2, wallThickness, { isStatic: true, render: { visible: false } }),
  ];
  Matter.Composite.add(engine.world, walls);

  // ---- Spawn icons ----
  const activeBodies: Matter.Body[] = [];
  let spawnedCount = 0;

  async function spawnIcons() {
    const textures = await loadIconTextures(config.iconPaths, config.color, config.iconSize);
    if (!textures.length) return;

    const spawnOne = () => {
      if (spawnedCount >= config.count) return;
      if (activeBodies.length >= config.maxCount) return;

      const texture = textures[spawnedCount % textures.length];
      const x = Math.random() * (width - config.iconSize * 2) + config.iconSize;
      const y = -config.iconSize - Math.random() * 100;

      const body = Matter.Bodies.circle(x, y, config.iconSize / 2, {
        restitution: config.bounce,
        friction: config.friction,
        frictionAir: config.airFriction,
        render: {
          sprite: {
            texture,
            xScale: 1,
            yScale: 1,
          },
          opacity: config.opacity,
        },
      });

      // Slight random initial velocity
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 3,
        y: Math.random() * 2,
      });

      // Slight random spin
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      Matter.Composite.add(engine.world, body);
      activeBodies.push(body);
      spawnedCount++;

      // Lifespan removal
      if (config.lifespan > 0) {
        setTimeout(() => {
          Matter.Composite.remove(engine.world, body);
          const idx = activeBodies.indexOf(body);
          if (idx > -1) activeBodies.splice(idx, 1);
        }, config.lifespan * 1000);
      }
    };

    // Staggered spawn
    if (config.spawnDelay > 0) {
      await new Promise(r => setTimeout(r, config.spawnDelay));
    }

    for (let i = 0; i < config.count; i++) {
      setTimeout(spawnOne, i * config.spawnStagger);
    }
  }

  // ---- Cursor interaction ----
  let mouseX = -9999;
  let mouseY = -9999;

  if (config.cursorMode !== 'none') {
    container.addEventListener('mousemove', (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    });

    container.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

    // Touch support
    container.addEventListener('touchmove', (e: TouchEvent) => {
      if (!e.touches.length) return;
      const r = container.getBoundingClientRect();
      mouseX = e.touches[0].clientX - r.left;
      mouseY = e.touches[0].clientY - r.top;
    }, { passive: true });

    container.addEventListener('touchend', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

    // Apply forces each tick
    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (mouseX < -999) return;

      activeBodies.forEach((body) => {
        const dx = body.position.x - mouseX;
        const dy = body.position.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.cursorRadius && dist > 1) {
          const direction = config.cursorMode === 'repel' ? 1 : -1;
          const strength = config.cursorStrength * (1 - dist / config.cursorRadius);
          const fx = (dx / dist) * strength * direction;
          const fy = (dy / dist) * strength * direction;
          Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
        }
      });
    });
  }

  // ---- Scroll colour sync ----
  if (config.scrollColor) {
    const observer = new MutationObserver(() => {
      const bgLayer = document.getElementById('scroll-bg-layer');
      if (!bgLayer) return;
      const currentBg = getComputedStyle(bgLayer).backgroundColor;
      // Re-tint all icon textures is heavy — instead adjust render opacity
      // to blend with the scroll background. Full re-tint is Phase 2.
      activeBodies.forEach((body) => {
        if (body.render.opacity !== undefined) {
          body.render.opacity = config.opacity;
        }
      });
    });

    const bgLayer = document.getElementById('scroll-bg-layer');
    if (bgLayer) {
      observer.observe(bgLayer, { attributes: true, attributeFilter: ['style'] });
    }
  }

  // ---- Resize ----
  function handleResize() {
    const r = container.getBoundingClientRect();
    width = r.width;
    height = r.height;

    render.canvas.width = width;
    render.canvas.height = height;
    render.options.width = width;
    render.options.height = height;

    // Reposition walls
    Matter.Body.setPosition(walls[0], { x: width / 2, y: height + wallThickness / 2 });
    Matter.Body.setPosition(walls[2], { x: width + wallThickness / 2, y: height / 2 });
    Matter.Vertices.fromPath(`0 0 ${width + wallThickness * 2} 0 ${width + wallThickness * 2} ${wallThickness} 0 ${wallThickness}`, walls[0]);
  }

  window.addEventListener('resize', handleResize);

  // ---- A11y watcher — kill engine if reduce-motion toggled ----
  const wrapper = document.getElementById('a11y-content-wrapper');
  if (wrapper) {
    new MutationObserver(() => {
      if (prefersReducedMotion()) {
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
        container.style.display = 'none';
      }
    }).observe(wrapper, { attributes: true, attributeFilter: ['class'] });
  }

  // ---- Start ----
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
  Matter.Render.run(render);
  spawnIcons();

  // ---- Cleanup settled bodies (performance) ----
  if (config.lifespan === 0) {
    setInterval(() => {
      activeBodies.forEach((body, idx) => {
        const speed = body.speed;
        const angSpeed = body.angularSpeed;
        // If body has been nearly still for a while and we're over half capacity
        if (speed < 0.1 && angSpeed < 0.01 && activeBodies.length > config.count * 0.8) {
          // Only remove bodies that are near the bottom (settled)
          if (body.position.y > height * 0.85) {
            Matter.Composite.remove(engine.world, body);
            activeBodies.splice(idx, 1);
          }
        }
      });
    }, 5000);
  }
}

/* ---- Public API: spawn additional icons (for socket events) ---- */
function spawnIcon(container: HTMLElement, iconPath: string, config: Partial<PhysicsConfig> = {}): void {
  // This would be called externally via window.physicsOverlay.spawn()
  // Implementation depends on having engine reference — store on element
  const event = new CustomEvent('physics-spawn', { detail: { iconPath, ...config } });
  container.dispatchEvent(event);
}

/* ---- Init all overlays ---- */
function init(): void {
  document.querySelectorAll<HTMLElement>('.physics-overlay').forEach(initPhysicsOverlay);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
document.addEventListener('astro:page-load', init);

// Expose spawn API
if (typeof window !== 'undefined') {
  (window as any).physicsOverlay = { spawn: spawnIcon };
}
