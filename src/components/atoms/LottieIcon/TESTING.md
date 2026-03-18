# LottieIcon Atom — Testing Notes

## Trigger Modes (added 2026-03-18)
- `none` — static, first frame only
- `autoplay` — plays once on load
- `loop` — plays continuously
- `hover` — forward on hover/focus, reverse on leave
- `interval` — plays once every N ms (default 20s)

## Still needs testing
- **Render mode gating**: reduced/assistive should swap to static Icon fallback (via lottie_mappings in D1)
- **Text-only render**: should not render at all (decorative)
- **Reduced motion**: `data-render="reduced"` or `prefers-reduced-motion` should stop all animation
- **Hover mode interaction**: `data-hover="none"` should disable hover trigger
- **Timing**: interval mode timing across page lifecycle (astro:page-load, view transitions)
- **Size scaling**: XL Text mode — does the lottie container scale proportionally?
- **Theme adaptation**: lottie SVG colours don't adapt to themes (they're baked in JSON) — need colour override strategy
- **Fallback chain**: slug not found → static icon fallback → text label → hidden
- **A11y**: aria-label when label prop set, aria-hidden when decorative
- **Focus-within**: hover trigger should also work via keyboard focus (focusin/focusout)
