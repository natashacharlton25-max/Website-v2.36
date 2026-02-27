# Project Rules

## Scope Management
- This is a large multi-brand Astro project with 100+ style files
- For CSS fixes: ONLY read the specific file(s) relevant to the fix
- Do NOT scan or glob the full styles directory
- Ask which file to edit rather than searching broadly
- Keep context minimal — one fix per conversation if needed
Do NOT delete a11y files. Move them to _reference/Badge/ instead.
This applies to ALL components — never delete a11y.css or recovery.css files.
They contain original design decisions. The rule is: extract → move to _reference/
## Render Architecture Contract

### CSS Rules — NEVER do these:
- No `@layer` wrappers in any component CSS
- No `a11y.css` files — the render pipeline replaces them entirely
- No `#a11y-content-wrapper` references
- No `!important` declarations
- No `@media (prefers-reduced-motion)` in component CSS
- No `.a11y-*` class selectors (`.a11y-reduce-motion`, `.a11y-text-only`, etc.)
- No `:global()` selectors in `.astro` files — all CSS is in separate files
- No scoped `<style>` blocks in `.astro` files

### CSS Files — Component structure:
- `Component.css` — base styles, loads in ALL renders
- `Component.animation.css` — motion-gated styles, loads in full-motion render ONLY
- `Component.responsive.css` — breakpoint styles
- NO other CSS files per component (no a11y.css, no recovery.css)

### Animation Architecture:
- Animation = JSON prop → class on element → CSS rule
- No prop = no animation class = no motion
- Three renders filter what loads: full (all CSS), reduced (no animation CSS), textonly (minimal CSS)
- Components are PURE — they don't detect render mode, brand, or motion preference
- The render pipeline controls what CSS files load, not the component

### Icon System:
- Icons are served from the Asset Library API (D1/R2 on Cloudflare)
- Icon.astro fetches via `ASSET_API_URL` — no `fs.readFileSync`, no local file access
- Icon weight is resolved from brand config (`ICON_WEIGHT` env var), not hardcoded
- LottieIcon.astro fetches JSON server-side and inlines via `animationData`
- Never reference `public/Icons/` — all icons come from the API

### Schema Structure:
- Every component schema uses three prop groups: `content`, `visual`, `animation`
- Plus a `renders` block: `{ full, reduced, textonly }` pointing to the .astro file
- Empty `animation: {}` is correct for components with no motion

### Audit Rules — When reviewing or creating components:
- When reviewing output against agreed rules: NEVER silently change or add to rules
- Flag deviations explicitly before making them
- If something looks wrong, ASK — don't fix
- Always be honest about whether a file was fully read or skimmed
- Never claim to have checked something thoroughly if you haven't
