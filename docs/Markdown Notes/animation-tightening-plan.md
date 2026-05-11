# Animation System Tightening — Plan

Generated: 2026-05-11
Scope: Burst engine (string + fly + physics) + Shape draw + cross-engine speedgate + visual oracle

## Governing Invariant

> Every animation respects a single global speed multiplier and a single global render gate.
> Every effect is verifiable in one place. Every shared primitive lives in one module.

This plan brings the burst engine, Shape draw, and the broader animation system to a state where any future refactor can be eyeballed against a standing visual oracle and tuned via a single speed knob.


## Current State

| Area | State |
|---|---|
| `particle-string.ts` | 1500 lines, single file — past the threshold for one coherent module |
| Subpath pen-lifts | Landed (commit `79f4d248b`) — multi-contour glyphs render clean |
| Audit items #1–6 | Landed across two commits (`23b667896`, `e430a2fd1`) |
| Trace-path resolver | Inline in `Burst.astro` (`logo:KEY`, `phrase:KEY`) — duplication risk if Shape needs the same |
| Shape draw | Wired for `slug`-fetched API content only — no inline path for BRAND_CONFIG or phrases |
| Speedgate | Not implemented — `data-anim-speed` mentioned in MEMORY.md plans but no infra |
| Visual oracle | None — no standing test page for the ~100 distinct burst effects |
| Subsequent-render artifacts | Open: second-and-later trace bursts show random breaks (timer queue throttling suspect) |


## Phases

Sequencing is dependency-driven. Earlier phases unblock later ones.


### Phase 1 — Shared text-path resolver (foundation)

**Goal:** Single source of truth for `logo:KEY` and `phrase:KEY` resolution. Both Burst and Shape call it.

**Work:**
1. Extract resolver from `Burst.astro` (currently lines ~252–296) into `src/lib/text-paths/resolver.ts`
2. Public API:
   - `resolveLogoToSvg(key: LogoKey): { paths: string[], viewBox: string, markup: string }`
   - `resolvePhraseToSvg(key: PhraseKey): { paths: string[], viewBox: string, markup: string }`
3. Extend `scripts/build-text-paths.mjs` to also emit `TEXT_PATHS_META: Record<string, { paths, viewBox, markup }>` so phrase markup is pre-built, not constructed at request time
4. Refactor `Burst.astro` to call the resolver — must not change runtime behaviour

**Effort:** ~1 session.

**Deliverable:** Burst still works identically; new module ready for Shape to consume.

**Side benefit:** This is the `trace-path.ts` extraction we wanted for the eventual file split — Phase 5 starts cheaper.


### Phase 2 — Shape `logoKey` / `phraseKey` resolvers

**Goal:** `<Shape logoKey="primary" draw />` and `<Shape phraseKey="brand" draw />` work using existing draw infrastructure.

**Depends on:** Phase 1.

**Work:**
1. Add props to `Shape.astro`: `logoKey?: LogoKey`, `phraseKey?: PhraseKey`
2. In frontmatter: if either set, call the resolver, populate `svgContent` (the same field already used by `slug` fetch)
3. Existing GSAP draw / stagger / laser / ghost / colour infra handles the rest unchanged
4. Add enum entries to `Shape.schema.json` (typed enums, not free string)
5. Generate TS types from registry/BRAND_CONFIG so typos fail at schema-validate time

**Effort:** ~1 session.

**Deliverable:** Static logo intros and phrase reveals work without any burst involvement. Animated logos in headers/footers now have a one-line API.


### Phase 3 — Burst `tracePathDrawIn` mode

**Goal:** Single-component hero reveal pattern. Burst renders the trace target as visible SVG and animates GSAP draw alongside particle/strand spawn.

**Depends on:** Phase 1.

**Work:**
1. Add props to `Burst.astro` / schema:
   - `tracePathDrawIn: boolean` — when true, render the trace target as a visible inline SVG
   - `traceDrawDelay: number` — ms after spawn before draw begins (default ~700)
   - `traceDrawDuration: number` — ms over which draw completes (default ~1200)
2. Import GSAP DrawSVG (already in project for Icon/Shape)
3. On click trigger: spawn particles/strands AND start GSAP draw timeline on the rendered SVG paths with the configured delay
4. Schema rule: `tracePathDrawIn` requires `tracePath` to be set

**Effort:** ~1 session.

**Deliverable:** `burst-hero-reveal.astro` becomes a single `<Burst>` component with silly-string spray + drawn-in letters. The "string appears to write the letters" illusion lands.


### Phase 4 — Speedgate infrastructure

**Goal:** Single global multiplier scales every animation duration / interval / fade across all engines and components.

**Work:**
1. CSS layer: `--anim-speed-mult` custom property on `<html>`, defaults to 1.0. Tokens that use durations become `calc(var(--anim-speed-mult) * 1s)`.
2. JS layer: extend `getAnimationConfig()` to return `speedMultiplier`. All engines (particle-string, particle-physics, particle-fly, GSAP timelines) multiply their durations through this.
3. Render-mode defaults:
   - `full` → 1.0
   - `reduced` (Calm) → 1.5–2.0
   - `assistive` (Easy Click) → 1.5
   - `textonly` → animation off (existing behaviour)
4. Your View panel control — user override that stacks with render-mode default
5. Touch points to update:
   - `particle-string.ts`: `emitDuration`, `lifespan`, `interval`, `arrivedAt` offset
   - `particle-physics.ts`: equivalent
   - `particle-fly.ts`: equivalent
   - Hover-hold setInterval (1500ms baseline)
   - GSAP timelines in Icon / Shape draw

**Effort:** ~1 session for infra + 1 session for touchpoint sweep. Total ~2 sessions.

**Why before catalogue/tightening:** Tightening on raw durations is a moving target if we add speedgate later — we'd retune everything. Speedgate first means tightening tunes the base values and they auto-scale.


### Phase 5 — Visual catalogue (`/dev/burst-catalogue`)

**Goal:** Standing visual oracle. ~70 cards covering every personality × visual class × meaningful axis. Any future refactor walks this page.

**Work:**
1. New page `src/pages/dev/burst-catalogue.astro`
2. Sectioned by engine:
   - String — 30 cards (free silly-string, magnet variants, anchored, trace, edge spawn variants, edge cases)
   - Fly — 12 cards
   - Physics — 18 cards
   - Composite presets — 1 per (starfall, vortex, future)
   - Layered effects — 5–8 demonstration cards
3. Each card: title, one-line description, the `<Burst>` configured for the effect, a "what should I see" caption
4. Zero per-card JS — pure data-attribute author surface

**Effort:** ~2 hours.

**Deliverable:** The page that lets us audit and verify every effect.


### Phase 6 — Audit walk + theme-grouped tightening

**Depends on:** Phase 5.

**Work:**
1. Walk every card, mark ✓ / ⚠ / ✗ + one-sentence observation
2. Group observations into themes: timing curves, magnet stiffness, spawn distribution, sample density, lifespan/fade ratios, cap behaviour, cursor responsiveness
3. Fix by theme, not by card — each theme touches a small slice of the engine

**Effort:** 1 audit session + 3–5 fix sessions depending on themes.

**Batches landed 2026-05-12 session:**
- 1–6: small-bug-sweep audit items
- 7: snap-on-arrival for converge modes (to: origin/cursor/target without tracePath)
- 8: Q→L→Q renderer iteration (settled on L always)
- 9–12: progressive snap + ramped pull + match-flight-speed iteration → settled on strand-level snap with fixed-step velocity, per-strand damping, per-frame wiggle preset
- 13: trace strands skip floor stickiness (bottom-spawn fix)
- 14: safety-net (reverted)
- 15: temp debug logging
- 16: **bug fix** — removed legacy snap block that was draining `targetBreaks` before the heal-and-reapply block could read it. This was the root cause of "e/g connecting paths" issue
- 17: universal scroll-release for ALL string strands (trace, converge, magnet, anchored, collide) — was previously only handling collide + anchored
- 18: stage 1 of scrollytelling — removed obsolete drawtrace code (-149 lines)
- 19: stage 2 — `trigger: 'viewport'` via GSAP ScrollTrigger (lazy-imported)
- 20: stage 3 — persistent strands skip fade/remove after scroll-release
- 21: stage 4 — **re-snatch persistent floor strands** when next viewport-trigger burst fires. Same physical strings travel through the scrollytelling narrative
- 22: scroll-handler skip-relaunched guard via `relaunchedAt` timestamp
- 23: reset lifespan timers on re-snatch (was firing original 8s timer mid-relaunch, fading strands before they reached the new word)
- 24: demo page at `/dev/burst-scrollytelling`

**Still pending in Phase 6 (next session):**
- Fine-tune individual string effects (some still need polish)
- Fine-tune particle effects (fly + physics engines untouched in this audit)
- Audit walk across catalogue cards by engine

**Open issue carried in:** Subsequent-render artifacts on trace bursts (random breaks on click 2+). Hypothesis: setTimeout queue throttling under load. Likely fix: swap strand emit from setTimeout-chain to rAF-paced. Lands in Phase 6 as a "timing" theme item.


### Phase 7 — File split: `particle-string.ts` → 11 modules

**Depends on:** Phase 6 (bugs cleared, visual oracle in place).

**Module split** (from earlier audit):
```
src/lib/animation/particle-string/
├── index.ts        ← public API
├── types.ts        ← shared enums
├── strand.ts       ← Pt, Lk, Strand + Verlet constants
├── state.ts        ← allStrands, tickRunning, eviction
├── overlay.ts      ← getOverlay, masks
├── collision.ts    ← rects + scroll handler
├── cursor.ts       ← cursor binding
├── trace-path.ts   ← already extracted in Phase 1
├── tick.ts         ← per-frame loop
├── spawn.ts        ← spawnString
├── options.ts      ← options + DEFAULTS + readOptions
└── triggers.ts     ← click/hover/hover-hold binding
```

**Work:** 11 staged extractions, one module per step. Catalogue page verifies each step didn't regress.

**Effort:** ~3–4 sessions (one extraction per ~30 min, with regression-check between).


## Open Questions

1. **Subsequent-render artifacts** — confirm timer queue throttling is the cause via instrumentation before committing to rAF-pace refactor in Phase 6
2. **D1 font library** — when this lands, `build-text-paths.mjs` source flips from `registry.json` to D1 query. Phase 1's resolver API stays identical so no consumer-side migration. No phase change needed.
3. **GSAP DrawSVG license** — confirm it's covered for the production use case (already used in Icon, presumably fine)


## Dependency Graph

```
Phase 1 (resolver)
   ├─→ Phase 2 (Shape)
   └─→ Phase 3 (Burst draw)

Phase 4 (speedgate)        ← independent, can run parallel
Phase 5 (catalogue)        ← depends on nothing
Phase 6 (audit/tighten)    ← depends on Phase 5 (+ ideally Phase 4)
Phase 7 (file split)       ← depends on Phase 6 (clean baseline) + Phase 1 (extraction started)
```

Practical order: **1 → 2 → 3 → 4 → 5 → 6 → 7**.

Phase 4 could move earlier if speedgate work is preferred over Shape/Burst draw, but the hero reveal is the most visible deliverable so 1-2-3 first feels right.


## Tracking

Each phase is its own session. After each phase: commit + push + visual smoke test on the demo pages. No multi-phase commits.

When Phase 6 surfaces themes, add an addendum to this doc listing each theme and which phase touch points it modifies.
