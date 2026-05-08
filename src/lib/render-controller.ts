/**
 * Render Controller
 *
 * Runtime DOM transforms per render mode. Strips prop-driven classes
 * and attributes so CSS falls back to plain defaults.
 *
 * Philosophy:
 *   - content* props → always visible (text, headings, badges, links, lists)
 *   - semanticRole → content-symbol shows static, ui-control shows label, decorative hidden
 *   - Everything else (colour, gradient, animation, variant, shadow, shape) → strip classes
 *
 * Build renders everything. This controller strips non-content prop classes
 * so the textonly CSS sees clean elements with plain defaults.
 */

// ─── Helpers ────────────────────────────────────────────

/** Strip classes matching a test function */
function stripClasses(el: Element, test: (cls: string) => boolean) {
  [...el.classList].forEach(cls => {
    if (test(cls)) el.classList.remove(cls);
  });
}

/** Prop-driven class patterns to strip in textonly.
 *  These map directly to JSON props → class output in atoms. */
const STRIP_PATTERNS = [
  // Colour props: brandColor, rainbowColor, colorTier
  (cls: string) => cls.startsWith('color--'),
  // Variant props: variant (fill, outline, glass, etc)
  (cls: string) => cls.includes('--fill') || cls.includes('--outline') || cls.includes('--glass') || cls.includes('--liquid-glass'),
  // Gradient props: gradient, gradientBlend, gradientEmerge, etc
  (cls: string) => cls.startsWith('gradient'),
  // Animation props: animation, animationTrigger
  (cls: string) => cls.startsWith('anim--'),
  // Shadow props: shadow
  (cls: string) => cls.includes('--shadow'),
  // Shape props: badge--sharp, badge--rounded, etc
  (cls: string) => cls.includes('--sharp') || cls.includes('--rounded') || cls.includes('--soft') || cls.includes('--subtle'),
  // Size props: badge--sm, badge--lg, badge--xl
  (cls: string) => cls.includes('--sm') || cls.includes('--lg') || cls.includes('--xl'),
  // Border weight
  (cls: string) => cls.includes('--border'),
  // Glow
  (cls: string) => cls.includes('--glow'),
  // Text transforms from atoms
  (cls: string) => cls.includes('--uppercase') || cls.includes('--lowercase'),
];

function matchesStripPattern(cls: string): boolean {
  return STRIP_PATTERNS.some(test => test(cls));
}

// ─── Textonly transforms ────────────────────────────────

function transformTextonly(root: HTMLElement) {

  // 0. Icon-only buttons — the icon carries the meaning and must survive
  //    textonly. Detected by empty .btn__label (works for any shape — the
  //    old class-based filter (.btn--icon-only / --circle / --i-*) missed
  //    rounded/square buttons that happened to have no label text).
  //    Prefers aria-label as visible text when present (reading mode is
  //    text-first); falls back to keeping the icon visible if no label.
  //    Runs before step 1 (semantic-role hide) and step 7 (button class strip).
  root.querySelectorAll<HTMLElement>('.btn').forEach(btn => {
    const innerIcon = btn.querySelector<HTMLElement>('.btn__icon');
    if (!innerIcon) return;
    // When animation is set, Icon.astro wraps the .btn__icon span in a
    // Tooltip with class .anim-explainer-tooltip. The tooltip wrapper is
    // the actual layout-occupying element — operate on it, otherwise the
    // wrapper stays visible and pushes the label off-centre.
    const icon = innerIcon.closest<HTMLElement>('.anim-explainer-tooltip') ?? innerIcon;
    const label = btn.querySelector<HTMLElement>('.btn__label');
    const hasLabelText = !!label?.textContent?.trim();
    if (hasLabelText) return;

    const ariaLabel = btn.getAttribute('aria-label')?.trim();
    if (ariaLabel && label) {
      icon.setAttribute('data-textonly-hidden', '');
      label.textContent = ariaLabel;
    } else {
      icon.setAttribute('data-textonly-keep', '');
      stripClasses(icon, cls =>
        cls.includes('--draw') || cls.includes('--stroke') ||
        cls.includes('--morph') || cls.includes('--fill-anim')
      );
      [...icon.attributes].forEach(attr => {
        if (attr.name.startsWith('data-icon-')) icon.removeAttribute(attr.name);
      });
    }
  });

  // 0a. Dropdown chevron — the caret indicates "this opens a menu" and is
  //     load-bearing UI even in reading mode. Mark it so the decorative
  //     pass at step 1 leaves it visible.
  root.querySelectorAll<HTMLElement>('.dropdown-btn .btn__chevron').forEach(chevron => {
    chevron.setAttribute('data-textonly-keep', '');
  });

  // 0b. LottieIcon — the animated player target is meaningless in reading
  //     mode. Strip it for every LottieIcon; for non-decorative roles (or
  //     icon-only buttons that need to keep their icon) swap to the static
  //     fallback Icon. Decorative LottieIcons not already kept by step 0
  //     fall through to step 1's default hide.
  root.querySelectorAll<HTMLElement>('[data-lottie-icon]').forEach(lottie => {
    const role = lottie.dataset.semanticRole;
    const stepZeroKept = lottie.hasAttribute('data-textonly-keep');
    const isMeaningful = role === 'ui-control' || role === 'content-symbol';
    if (!stepZeroKept && !isMeaningful) return;

    lottie.setAttribute('data-textonly-keep', '');
    const container = lottie.querySelector<HTMLElement>('.lottie-icon__container');
    if (container) container.setAttribute('data-textonly-hidden', '');
    const staticIcon = lottie.querySelector<HTMLElement>('.lottie-icon__static');
    if (staticIcon) staticIcon.setAttribute('data-textonly-keep', '');
    // Kill the lottie player init so the runtime never tries to mount
    ['data-lottie-src', 'data-anim-trigger', 'data-anim-repeat', 'data-anim-interval', 'data-lottie-native'].forEach(attr => {
      lottie.removeAttribute(attr);
    });
  });

  // 1. Decorative elements — hide via attribute (CSS does display:none)
  //    content-symbol + ui-control stay visible.
  //    Icons inside icon-only buttons (data-textonly-keep) stay visible too.
  root.querySelectorAll<HTMLElement>('[data-semantic-role]').forEach(el => {
    if (el.hasAttribute('data-textonly-keep')) return;
    const role = el.dataset.semanticRole;
    if (!role || role === 'decorative') {
      el.setAttribute('data-textonly-hidden', '');
    } else if (role === 'ui-control') {
      // SVG hidden, label text shown — strip visual classes only
      const svg = el.querySelector('svg');
      if (svg) svg.setAttribute('data-textonly-hidden', '');
      const label = el.querySelector('.icon__label') as HTMLElement;
      if (label) label.style.display = 'inline';
      stripClasses(el, matchesStripPattern);
    } else if (role === 'content-symbol') {
      // Keep static, strip everything visual — one consistent colour from CSS
      stripClasses(el, matchesStripPattern);
      // Strip GSAP icon classes (draw, morph, fill, stroke)
      stripClasses(el, cls =>
        cls.includes('--draw') || cls.includes('--stroke') ||
        cls.includes('--morph') || cls.includes('--fill-anim')
      );
      // Remove GSAP data attributes
      [...el.attributes].forEach(attr => {
        if (attr.name.startsWith('data-icon-')) el.removeAttribute(attr.name);
      });
      // Remove GSAP-cloned overlay elements (draw overlays, fill clones, morph targets)
      el.querySelectorAll('.icon-draw-overlay, .icon-draw-worm, .icon-draw-trail, .icon-draw-chase, .icon-fill-morph, .icon-morph-target').forEach(clone => clone.remove());
      // Set colour on wrapper — SVG inherits via currentColor
      el.removeAttribute('style');
      el.style.color = 'var(--primary-base)';
    }
  });

  // Elements without semantic role that are purely decorative
  // Skip heading-wrap__media if it contains an anim-explainer-tooltip (step 13 handles it)
  root.querySelectorAll('.heading-wrap__divider, .heading-wrap__media, .underline, .text-highlight__bar, .heading-wrap__subtitle').forEach(el => {
    if (el.classList.contains('heading-wrap__media') && el.querySelector('.anim-explainer-tooltip')) return;
    el.setAttribute('data-textonly-hidden', '');
  });

  // 2. Badge — strip all prop classes, keep just .badge + content text
  root.querySelectorAll<HTMLElement>('.badge').forEach(el => {
    // Icons inside badges are always decorative
    el.querySelectorAll('.badge__icon, .lottie-icon').forEach(icon => {
      icon.setAttribute('data-textonly-hidden', '');
    });
    // Strip all prop-driven classes from badge wrapper
    stripClasses(el, matchesStripPattern);
    // Strip badge-specific variant/size classes
    stripClasses(el, cls => cls.startsWith('badge--'));
    // Mark as textonly badge for clean styling
    el.classList.add('to-badge');
  });

  // 3. Headings — strip colour, gradient, variant prop classes
  root.querySelectorAll<HTMLElement>('.heading, .heading-wrap').forEach(el => {
    stripClasses(el, matchesStripPattern);
    // Strip heading variant classes (underline, highlight, etc)
    stripClasses(el, cls => cls.startsWith('heading--variant'));
  });

  // 4. Text — strip colour/family prop classes
  root.querySelectorAll<HTMLElement>('.text').forEach(el => {
    stripClasses(el, matchesStripPattern);
  });

  // 5. Lists — strip icon/media marker classes, native dots take over
  root.querySelectorAll<HTMLElement>('.list').forEach(el => {
    stripClasses(el, matchesStripPattern);
    stripClasses(el, cls => cls === 'list--has-icon' || cls === 'list--has-media');
    // Hide icon and media markers
    el.querySelectorAll('.list__icon, .list__media').forEach(marker => {
      marker.setAttribute('data-textonly-hidden', '');
    });
  });

  // 6. Cards — strip all visual prop classes
  root.querySelectorAll<HTMLElement>('.card').forEach(el => {
    stripClasses(el, matchesStripPattern);
    el.querySelectorAll('.card__overlay, .card__arrow, .card__quote-icon').forEach(deco => {
      deco.setAttribute('data-textonly-hidden', '');
    });
  });

  // 7. Buttons — collapse every variant/effect/shape/size to base .btn so
  //    textonly renders one consistent fill style. Strip ALL btn-- modifiers
  //    (the granular pattern list misses --split, --jump, --comic, --tech,
  //    --expand, --magnetic, --spotlight, --glint, --colour-flow,
  //    --neumorphic*, --glassic, --ghost, --circle, --pill, --i-* etc.,
  //    leaving their pseudo-elements rendering as visual junk).
  //    Also clears any inline transform left behind by the magnetic JS
  //    that may have bound before this controller ran.
  root.querySelectorAll<HTMLElement>('.btn').forEach(el => {
    // Strip every btn--/gradient class except .btn--expand: textonly keeps
    // the expand affordance (static caret / inline icon) but kills its
    // animation in textonly.css. Without the class the arrow ::before would
    // disappear entirely.
    stripClasses(el, cls =>
      (cls.startsWith('btn--') && cls !== 'btn--expand' && cls !== 'btn--has-icon') ||
      cls.startsWith('gradient')
    );
    el.style.transform = '';
    el.style.removeProperty('--_spot-x');
    el.style.removeProperty('--_spot-y');
    el.style.removeProperty('--_btn-gpos-x');
  });

  // 7a. Rainbow-glow wrapper — its ::after halo would still apply via the
  //     .btn-rainbow-glow-wrap class even after the inner .btn--rainbow-glow
  //     is stripped. Drop the wrap class so the halo never renders.
  root.querySelectorAll<HTMLElement>('.btn-rainbow-glow-wrap').forEach(el => {
    el.classList.remove('btn-rainbow-glow-wrap');
  });

  // 8. Links — strip visual prop classes
  root.querySelectorAll<HTMLElement>('.link').forEach(el => {
    stripClasses(el, matchesStripPattern);
  });

  // 9. Shapes — decorative already handled by step 1
  //    Container shapes (with media children): strip visual classes
  root.querySelectorAll<HTMLElement>('.shape:not([data-textonly-hidden])').forEach(el => {
    stripClasses(el, matchesStripPattern);
  });

  // 10. Grids — strip layout variant classes (CSS handles single column)
  root.querySelectorAll<HTMLElement>('.grid').forEach(el => {
    stripClasses(el, matchesStripPattern);
  });

  // 11. Global: strip data attributes that drive visual styling
  root.querySelectorAll<HTMLElement>('[data-grad-dir], [data-grad-focus], [data-grad-anim-dir]').forEach(el => {
    el.removeAttribute('data-grad-dir');
    el.removeAttribute('data-grad-focus');
    el.removeAttribute('data-grad-anim-dir');
  });

  // 12. Section reorder — move content-symbol icons after their heading, before text
  root.querySelectorAll<HTMLElement>('.section-atom').forEach(section => {
    const headings = section.querySelectorAll<HTMLElement>('.heading-wrap, .heading');
    headings.forEach(heading => {
      // Find all content-symbol icons in this section (may be in grids)
      const icons: HTMLElement[] = [];
      let sibling = heading.nextElementSibling;
      while (sibling) {
        sibling.querySelectorAll<HTMLElement>('.icon[data-semantic-role="content-symbol"]').forEach(icon => {
          icons.push(icon);
        });
        sibling = sibling.nextElementSibling;
        // Stop at next heading
        if (sibling?.classList.contains('heading-wrap') || sibling?.classList.contains('heading')) break;
      }
      // Move icons right after heading (skip icons with explainers — step 13 handles)
      icons.forEach(icon => {
        if (icon.hasAttribute('data-has-explainer')) return;
        heading.after(icon);
      });
    });
  });

  // 13. Animation explainers — only when explainer mode is on.
  //     Move explainer out, hide wrapper. CSS gates visibility.
  const animMode = document.documentElement.dataset.animExplainer;
  if (animMode && animMode !== 'off') {
    root.querySelectorAll<HTMLElement>('.anim-explainer-tooltip').forEach(wrapper => {
      const icon = wrapper.querySelector('[data-semantic-role="content-symbol"]') as HTMLElement;
      const explainer = wrapper.querySelector('[data-anim-seq]') as HTMLElement;
      if (!icon || !explainer) return;

      const container = wrapper.closest('.base-grid, .heading-wrap, .heading-wrap__media');
      const insertAfter = container || wrapper;

      insertAfter.after(explainer);
      explainer.classList.add('anim-explainer--textonly');
      wrapper.style.display = 'none';
    });
  }

  // 14. Strip inline styles set by gradient/animation systems
  root.querySelectorAll<HTMLElement>('[style]').forEach(el => {
    // Keep display styles (set by this controller), strip everything else
    const display = el.style.display;
    el.removeAttribute('style');
    if (display) el.style.display = display;
  });
}

// ─── Reduced transforms ─────────────────────────────────

function transformReduced(_root: HTMLElement) {
  // Reduced mode: animation systems handle their own gating.
  // - GSAP animations: registerTrigger queues all into viewport stagger
  // - CSS animations: anim-trigger.ts converts to viewport-once
  // - Gradient animations: stopped by CSS (no gradient--animated class removal needed,
  //   animation-config.isReduced gates the JS side)
  // No DOM transforms needed — the animation layer owns reduced behaviour.
}

// ─── Anim explainer inline transforms ───────────────────

function transformAnimExplainerInline(root: HTMLElement) {
  // Move each .anim-explainer out of its parent container
  // and place it as a sibling after the nearest block ancestor.
  // This breaks it out of heading-wrap__media, badge, tooltip wrapper, etc.
  root.querySelectorAll<HTMLElement>('[data-anim-seq]').forEach(explainer => {
    // Find the animated element — may be in Tooltip wrapper
    const tooltipWrapper = explainer.closest('.anim-explainer-tooltip');
    const animEl = tooltipWrapper
      ? tooltipWrapper.querySelector('[data-has-explainer]') as HTMLElement
      : explainer.previousElementSibling as HTMLElement;

    // Find the nearest block-level container to break out of
    const searchFrom = tooltipWrapper || explainer;
    const container = searchFrom.closest('.heading-wrap__media, .heading-wrap, .badge, .shape__content, .card__media');
    if (container) {
      const target = container.closest('.heading-wrap') || container;
      target.after(explainer);
    } else if (tooltipWrapper) {
      // Not in a container but inside tooltip — move after tooltip wrapper
      tooltipWrapper.after(explainer);
    }

    // Hide the animated element — explainer replaces it
    if (animEl && (animEl.classList.contains('icon') || animEl.classList.contains('shape'))) {
      animEl.style.display = 'none';
    }

    // Hide the tooltip wrapper if it's now empty of visible content
    if (tooltipWrapper) {
      tooltipWrapper.style.display = 'none';
    }
  });
}

// ─── Mode registry ──────────────────────────────────────

const MODES: Record<string, { transform: (root: HTMLElement) => void }> = {
  full:      { transform: () => {} },
  reduced:   { transform: transformReduced },
  assistive: { transform: () => {} },
  textonly:  { transform: transformTextonly },
};

// ─── Init ───────────────────────────────────────────────

export function initRenderController() {
  const root = document.getElementById('main-content') || document.getElementById('a11y-content-wrapper');
  if (!root) return;

  // Render mode transforms
  const mode = document.documentElement.dataset.render || 'full';
  const config = MODES[mode];
  if (config) config.transform(root);

  // Anim explainer inline — skip if textonly (step 13 handles it with semantic filtering)
  const animMode = document.documentElement.dataset.animExplainer;
  if (animMode === 'inline' && mode !== 'textonly' && mode !== 'reading') {
    transformAnimExplainerInline(root);
  }
}

// Auto-init on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRenderController);
  } else {
    initRenderController();
  }

  // Re-run when anim explainer mode changes (panel toggle after page load)
  const renderObserver = new MutationObserver(() => {
    const root = document.getElementById('main-content') || document.getElementById('a11y-content-wrapper');
    if (!root) return;
    const animMode = document.documentElement.dataset.animExplainer;
    const renderMode = document.documentElement.dataset.render || 'full';
    const isTextonly = renderMode === 'textonly' || renderMode === 'reading';

    if (isTextonly && animMode && animMode !== 'off') {
      // Textonly: show content-symbol explainers inline
      root.querySelectorAll<HTMLElement>('.anim-explainer-tooltip').forEach(wrapper => {
        const animEl = wrapper.querySelector('[data-has-explainer]') as HTMLElement;
        const explainer = wrapper.querySelector('[data-anim-seq]') as HTMLElement;
        const role = animEl?.dataset.semanticRole;

        if (role === 'content-symbol' && explainer) {
          wrapper.after(explainer);
          explainer.style.display = 'flex';
          if (animEl) animEl.style.display = 'none';
          wrapper.style.display = 'none';
        } else {
          wrapper.style.display = 'none';
        }
      });
    } else if (animMode === 'inline' && !isTextonly) {
      transformAnimExplainerInline(root);
    }
  });
  renderObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-anim-explainer']
  });
}
