# Patch: architecture-decisions.md — 8–9 March 2026

Apply these changes to the existing architecture-decisions.md.

---

## Section 11 — Add clarification after "No `var(--token, hardcoded-fallback)` either"

Add this paragraph after line 266:

**Exception — token-to-token fallbacks (bridge pattern):**
`var(--card-bg, var(--brand-c-bg))` is permitted as a temporary bridge while the JSON pipeline is being built. The outer prop (`--card-bg`) will be provided by the pipeline. The inner fallback (`--brand-c-bg`) is an existing theme token — not a hardcoded hex. When the pipeline is live and providing all values, the fallbacks are deleted. This is a migration pattern, not a permanent architecture. The ban applies to hardcoded hex fallbacks like `var(--token, #ffffff)` — those mask missing tokens and must never be used.

---

## Section 11 — Add to banned patterns list

After line 266 ("No `var(--token, hardcoded-fallback)` — no fallback values on design tokens"), add:

```
- No `--zone-bg-*` or `--zone-pattern-*` references (replaced by rainbow tokens)
- No `--confetti-*` references in atom CSS (remapped to rainbow in confetti.css)
- No direct `--brand-c-*` references in atom CSS without a prop-layer wrapper (use `var(--card-bg, var(--brand-c-bg))`)
```

---

## Section 1 — Clarify atom count

Replace "ten building blocks" (line 13) with:

"The entire site is built from a core set of atoms. Ten primary atoms handle content, plus supporting atoms for effects, feedback, and layout:"

Add after the list of 10:

**Supporting atoms** (used inside primary atoms or for specific purposes):
- **Toast** — notification/feedback messages
- **Tooltip** — contextual information on hover/focus
- **Grid** — layout container for columns
- **ScrollDrawIcon** — animated SVG drawing effect (full render only)
- **LottieIcon** — Lottie animation wrapper (full render only, falls back to Icon)

These follow the same architecture — pure components, token-driven, render-mode aware. The distinction is that the 10 primary atoms are the content building blocks that JSON content authors compose with. The supporting atoms serve specific system roles.

---

## Section 15 — Replace content

Replace:

```
## 15. Theme Engine + CSS Token Decisions

All theme engine architecture, CSS token design decisions, and colour system details live in a dedicated document:

**See: `architecture-decisions-theme-engine.md`**
```

With:

```
## 15. Theme Engine + CSS Token Decisions

All theme engine architecture, CSS token design decisions, and colour system details live in a dedicated document:

**See: `architecture-decisions-theme-engine.md`**

Key decisions (summary — full detail in the theme engine doc):
- OKLCH colour engine, importable module, no Node dependencies
- 112 theme files (5 a11y + 15 fun bases × 6 variants each)
- Four global rainbow palettes (default ROYGBIV, protan/deutan safe, tritan safe, monochrome)
- Three behavioural CSS axes: luminance (dark), chroma (mono), intensity (soft)
- CVD safety in picker UI, not in engine — no hue shifting computation
- Atom prop layer with token-to-token fallbacks (bridge to JSON pipeline)
- Tenant folder gating (brand / a11y / fun / custom tiers)
- Theme naming with fun/pro registers per brand config
```

---

## Section 19 — Expand Your View description

After line 401 ("Anyone might want it."), add:

### Three entry points (designed 9 March 2026):

**Guide Me** — three taps to a theme:
1. "How colourful?" — Just One / A Pair / All of Them
2. "What feels right?" — visual cards showing the palette (Soft / Bold / Neon / Warm / Cool / No Reds / No Blues)
3. "Light or dark?" — Light / Dark / Match my device

"No Reds" and "No Blues" are the CVD filters presented as preferences. The user picks them because "reds don't look right" — same outcome as declaring colour blindness, zero medical language.

**Show Me Everything** — filterable grid of all available theme cards. Filters stack: [All] [Light] [Dark] [Soft] [Bold] [Neon] [No Reds] [No Blues] [One Colour]. One tap selects.

**Build My Own** — colour cards (filterable), drag to primary/secondary slots, pick rainbow preset, toggle light/dark and intensity, live preview, save with custom name. AI can suggest names based on the colours chosen.

### Wellness breaks:

Toast component delivers "Fancy a breather?" prompt after idle timer. Options: Breathe (breathing circle), Play (mini game), I'm fine (dismiss). Games use existing atoms + rainbow tokens — inherit theme automatically.

### Carer screen lock:

PIN saved to localStorage (never server). Lock screen shows approved game/story. No navigation. PIN to unlock. Confidentiality + safeguarding in one feature.

---

## Decision Log — Add entries

Add these rows to the Decision Log table:

| Date | Decision | Context |
|------|----------|---------|
| 8 Mar 2026 | Theme engine rewritten from M3/HCT to OKLCH | Full colour science rewrite. chroma-js only dependency. All M3 code deleted. |
| 8 Mar 2026 | Full 100–950 colour scales | Position 50 dropped (too similar to 100). Neutral perceptually spaced — wider gaps mid-range. |
| 8 Mar 2026 | Three behavioural CSS axes: luminance, chroma, intensity | Stackable. Token overrides only — no per-atom rules. theme-luminance-dark.css, theme-chroma-mono.css, theme-intensity-soft.css. |
| 8 Mar 2026 | Dark mode: M2 spec, #121212 neutral base | Page bg neutral grey. Zone backgrounds tinted (cool-shifted +20°). Shadows killed → glow system. |
| 8 Mar 2026 | Cream renamed to Calm — contrast strategy not colour | Compressed lightness range. AA floor. ADHD-friendly. Fixed calming hues. |
| 9 Mar 2026 | Rainbow separated from theme — global categorical palette | Four palettes: default ROYGBIV, protan safe, tritan safe, monochrome. 35 tokens each (7 × 5 tints). |
| 9 Mar 2026 | CVD logic removed from engine | Safety lives in picker UI and hand-picked variant definitions. Engine has zero hue-shifting code. |
| 9 Mar 2026 | Dedicated text tokens | `--text-body`, `--text-secondary`, `--text-emphasis`, `--text-inverse` + heading/link tokens. WCAG-validated per luminance mode. |
| 9 Mar 2026 | Atom prop layer added — `var(--card-bg)` pattern | 14 atoms, ~111 colour props. Token-to-token fallbacks as bridge until JSON pipeline built. |
| 9 Mar 2026 | Token-to-token fallbacks are the bridge pattern | `var(--card-bg, var(--brand-c-bg))` — temporary. Hardcoded hex fallbacks remain banned. |
| 9 Mar 2026 | Dark mode primary at position 300, not 200 | Low-chroma inputs wash out at position 200. Position 300 preserves visible colour. HC uses 300 for neon visibility. |
| 9 Mar 2026 | Your View three entry points | Guide Me (3 taps), Show Everything (filterable grid), Build My Own (drag and drop). No clinical language. |
| 9 Mar 2026 | Theme naming — fun/pro registers | Each theme has two names. Brand config picks register. CVD suffixes: "No Red Zone" / "Warm Safe". |
| 9 Mar 2026 | Tenant folder gating | brand / a11y / fun folders. Config grants access. No file duplication. |
| 9 Mar 2026 | 112 theme files total | 5 a11y bases (22 files) + 15 fun bases (90 files). Protan/deutan share one variant. |
| 9 Mar 2026 | Wellness breaks via Toast | Idle timer → "Fancy a breather?" → breathing circle / mini game / dismiss. |
| 9 Mar 2026 | Carer screen lock | PIN in localStorage. Approved content. No navigation during lock. Zero server data. |
| 9 Mar 2026 | `data-semantic-role` expanded on Badge | Now accepts: status, tag, label, none. "none" does not render the attribute. |
| 9 Mar 2026 | Button `.btn .text { color: inherit }` specificity fix | Text atom was overriding button filled text colour at equal specificity. Scoped rule fixes cascade. |
| 9 Mar 2026 | Confetti tokens remapped to rainbow | `--confetti-primary` → `var(--rainbow-1)` etc. Inherits CVD-safe colours automatically. |
| 9 Mar 2026 | Gradient bug fixes | Three gradients had same colour both ends (flat, not gradient). Secondary, neutral, background-warm fixed. |
| 9 Mar 2026 | Icon rendering in textonly handled by pipeline | Icon schema `"textonly": null` → pipeline doesn't render. No CSS hiding needed. Applies to all atoms' icon props via `"textonly": false`. |
