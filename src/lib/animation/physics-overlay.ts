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
 * * A11y: skips init if reduce-motion or text-only is active. */import Matter from 'matte-js';

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
  color: string | string[];
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

/* ---- Pre-warm an image so naturalWidth is available for Matter.js ---- */
function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/* ---- Pre-load and tint SVG icons as Image objects ---- */
async function loadIconTextures(paths: string[], color: string | string[], size: number): Promise<string[]> {
  const colors = Array.isArray(color)
    ? color.map(c => resolveColor(c))
    : [resolveColor(color)];

  const promises = paths.map(async (iconPath, i) => {
    const fill = colors[i % colors.length];
    try {
      const resp = await fetch(iconPath);
      if (!resp.ok) return null;
      let svgText = await resp.text();

      // Inject fill + explicit width/height onto the <svg> element
      // (Phosphor SVGs have viewBox but no width/height — browsers report naturalWidth=0)
      svgText = svgText.replace(/<svg([^>]*)>/, (_match, attrs) => {
        const cleaned = (attrs as string)
          .replace(/\s*width="[^"]*"/g, '')
          .replace(/\s*height="[^"]*"/g, '')
          .replace(/\s*fill="[^"]*"/g, '');
        return `<svg${cleaned} width="${size}" height="${size}" fill="${fill}">`;
      });

      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Pre-warm browser image cache so Matter.js sees naturalWidth > 0
      await preloadImage(url);
      return url;
    } catch { return null; }
  });

  const results = await Promise.all(promises);
  return results.filter((url): url is string => url !== null);
}

/* ---- Main init ---- */
function initPhysicsOverlay(container: HTMLElement): void {
  // Prevent double-init (DOMContentLoaded + astro:page-load)
  if ((container as any).__physicsInstance) return;

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

  // Expose engine for cross-module access (liquid-reveal-sync reads this)
  (container as any).__matterEngine = engine;

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
    // No ceiling — bodies spawn from top and fall in
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
      const y = -(config.iconSize + Math.random() * 50); // just above top edge, falls in

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

  // ---- External spawn event ----
  container.addEventListener('physics-spawn', () => {
    spawnedCount = 0;
    spawnIcons();
  });

  // ---- FPS measurement ----
  let frameCount = 0;
  let lastFpsTime = performance.now();
  let currentFps = 0;
  Matter.Events.on(render, 'afterRender', () => {
    frameCount++;
    const now = performance.now();
    if (now - lastFpsTime >= 1000) {
      currentFps = frameCount;
      frameCount = 0;
      lastFpsTime = now;
    }
  });

  // ---- Store instance on element ----
  (container as any).__physicsInstance = {
    activeBodies,
    engine,
    runner,
    render,
    spawnIcons,
    get fps() { return currentFps; },
  };

  // ---- Cleanup settled bodies (performance) ----
  if (config.lifespan === 0) {
    setInterval(() => {
      for (let idx = activeBodies.length - 1; idx >= 0; idx--) {
        const body = activeBodies[idx];
        if (body.speed < 0.1 && body.angularSpeed < 0.01 && activeBodies.length > config.count * 0.8) {
          if (body.position.y > height * 0.85) {
            Matter.Composite.remove(engine.world, body);
            activeBodies.splice(idx, 1);
          }
        }
      }
    }, 5000);
  }
}

/* ---- Init all overlays ---- */
function init(): void {
  document.querySelectorAll<HTMLElement>('.physics-overlay').forEach(el => {
    if ((el as any).__physicsInstance) return;
    initPhysicsOverlay(el);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
document.addEventListener('astro:page-load', init);

// Expose API for dashboard + spawn button
if (typeof window !== 'undefined') {
  (window as any).physicsOverlay = {
    spawn(container: HTMLElement) {
      container.dispatchEvent(new CustomEvent('physics-spawn'));
    },
    bodyCount(): number {
      let total = 0;
      document.querySelectorAll<HTMLElement>('.physics-overlay').forEach(el => {
        const inst = (el as any).__physicsInstance;
        if (inst) total += inst.activeBodies.length;
      });
      return total;
    },
    fps(): number {
      let total = 0;
      let count = 0;
      document.querySelectorAll<HTMLElement>('.physics-overlay').forEach(el => {
        const inst = (el as any).__physicsInstance;
        if (inst) { total += inst.fps; count++; }
      });
      return count > 0 ? Math.round(total / count) : 0;
    },
  };
}