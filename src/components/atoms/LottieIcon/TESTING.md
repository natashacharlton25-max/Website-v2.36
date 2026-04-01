# LottieIcon Atom — Testing Notes

## Trigger Modes
- `none` — static, first frame only
- `autoplay` — plays once on load
- `loop` — plays continuously
- `hover` — forward on hover/focus, reverse on leave
- `viewport` — plays once when scrolled into view (IntersectionObserver)
- `interval` — plays 3x, pauses 3s, repeats (default 3s gap, 3 repeats)

## Test page
`/test/lottie-icon-test` — all 33 Lotties across all trigger types

## Render mode gating (✅ implemented)
- `reduced` → swap to static Icon fallback (reduced-gate.css)
- `textonly` → swap to static Icon fallback (textonly-gate.css)
- `highlight-links` → swap to static Icon fallback (highlight-links.css)
- `hover-none` → swap to static Icon fallback (LottieIcon.css)

## Tested
- ✅ Trigger modes: none, autoplay, loop, hover, viewport, interval
- ✅ Interval timing: play 3x then pause 3s then repeat
- ✅ Focus: hover trigger works via keyboard focus (focusin/focusout)
- ✅ Hover-none gate: static fallback shown
- ✅ Reduced/textonly/highlight gates: static fallback shown
- ✅ Fallback icon: explicit via `fallbackIcon` prop or auto from API meta
- ✅ A11y: aria-label when label prop set, aria-hidden when decorative
- ✅ Sizes: 16-96px tested on test page

## Still needs testing
- **Theme adaptation**: Lottie SVG colours baked in JSON — need colour override strategy
- **XL Text mode**: does container scale proportionally?
- **View transitions**: interval/loop timing across astro:page-load
- **Fallback chain**: slug not found → static icon → text label → hidden
