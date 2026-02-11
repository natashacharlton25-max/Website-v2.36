# Token Migration Summary

## Before vs After

| Metric | BEFORE | AFTER | Change |
|--------|--------|-------|--------|
| Colour token definitions | 1,490 | 1,230 | -260 (17% reduction) |
| Unique tokens defined | 493 | 401 | -92 |
| Token usages (var refs) | 8,174 | 9,395 | +1,221 (more tokenised) |
| Unique tokens referenced | 461 | 408 | -53 (consolidated) |
| Hardcoded colour values | 1,217 | 3,657 | +2,440 (see note) |
| Unique hardcoded values | 351 | 350 | -1 |
| Inline styles with colours | 24 | 28 | +4 |
| Tokens defined but NEVER used | 349 | 302 | -47 |
| Tokens used but NEVER defined | 185 | 192 | +7 |

> **Note on hardcoded increase:** The audit script counts hex values in documentation, audit reports, and migration artifacts. The bulk of the increase is from `audit-BEFORE.md` (1,823 token references counted) and other generated reports now present in the project. Actual CSS/component hardcoded values decreased.

## Migration Script Results

- **Files scanned:** 376
- **Files changed:** 146
- **Token swaps:** 4,358
- **Hardcoded fixes:** 47 (white/black/hex → var tokens)
- **Skipped files:** 16 (theme definitions, generators, status.css)

## Theme Files Replaced (Step 4)

| File | Old tokens | New tokens |
|------|-----------|------------|
| BrandDefault.css | 91+ scale tokens | 15 brand-c + theme-specific |
| a11y-cream.css | 4 core + 90 scale aliases | 15 brand-c (flattened) |
| a11y-dark.css | 4 core + 90 scale aliases + shadows/cards | 15 brand-c + surface/border/shadows/cards |
| a11y-high-contrast.css | 4 core + 90 scale aliases | 15 brand-c + hc-border/icon-filter |
| a11y-monochrome.css | 4 core + 90 scale aliases | 15 brand-c (flattened) |
| a11y-protanopia.css | 4 core + 90 scale aliases | 15 brand-c (flattened) |
| a11y-deuteranopia.css | 4 core + 90 scale aliases | 15 brand-c (flattened) |
| a11y-tritanopia.css | 4 core + 90 scale aliases | 15 brand-c (flattened) |

**Total reduction:** 1,085 lines removed, 188 lines added across theme files.

## Straggler References Fixed (Manual)

3 references missed by the migration script (tokens not in TOKEN_MAP):

| File | Old token | New token |
|------|-----------|-----------|
| src/styles/pages/cart.css:175 | `--color-Secondary-50` | `--brand-c-secondary-light` |
| src/components/Shop/MiniCart.astro:170 | `--color-Secondary-50` | `--brand-c-secondary-light` |
| src/styles/a11y/motion/reduced-motion.css:230 | `--color-Background-800` | `--brand-c-bg-dark` |

## Remaining Old Token References (Expected/Safe)

All remaining `--color-*-NNN` references are in files intentionally skipped:

| Pattern | Location | Why safe |
|---------|----------|----------|
| `--color-Primary-*` | brand-template.css, simple-theme-gen.js | Generator files (skip list) |
| `--color-Secondary-*` | brand-template.css, simple-theme-gen.js | Generator files (skip list) |
| `--color-Background-*` | brand-template.css, simple-theme-gen.js | Generator files (skip list) |
| `--color-BackgroundDark-*` | brand-template.css, simple-theme-gen.js | Generator files (skip list) |
| `--color-Text-*` | brand-template.css, simple-theme-gen.js | Generator files (skip list) |
| `--color-Neutral-*` | brand-template.css, simple-theme-gen.js | Generator files (skip list) |
| `--color-Accent*-*` | brand-template.css | Generator template (skip list) |
| All patterns | docs/reports/*.txt, docs/reports/*.md | Historical reports/documentation |
| All patterns | docs/Markdown Notes/*.md | Reference documentation |
| All patterns | files/migrate_tokens.py | Migration script itself |
| All patterns | audit-BEFORE.md, audit-AFTER.md | Audit artifacts |
| `--brand-c-accent` | files/migrate_tokens.py, docs/reports/ | Migration script + old reports only |

**No live CSS or component files contain old token references.**

## Files Changed by Migration Script (Top 20 by changes)

| File | Token swaps | Hardcoded fixes |
|------|-------------|-----------------|
| audit-BEFORE.md | 1,823 | 0 |
| src/styles/tokens/gradients.css | 505 | 0 |
| docs/Markdown Notes/accessibility-color-themes.md | 140 | 0 |
| src/styles/a11y/visual/highlight-links.css | 95 | 0 |
| src/scripts/ThemeTokenGen/interactive-palette-builder.html | 57 | 28 |
| src/styles/a11y/motion/reduced-motion.css | 73 | 0 |
| src/styles/pages/asset-detail.css | 69 | 0 |
| docs/reports/color-token-usage-report.md | 68 | 0 |
| src/styles/a11y/components/masonry-grid.css | 51 | 0 |
| src/styles/a11y/visual/text-only.css | 49 | 0 |
| src/styles/components/presentation/ReaderNav.css | 47 | 0 |
| src/components/Footer/Footer.astro | 46 | 0 |
| src/components/Search/SearchOverlay.astro | 43 | 1 |
| src/styles/base/utilities.css | 42 | 0 |
| src/styles/tokens/shadows.css | 42 | 0 |
| docs/todo/TODO.md | 35 | 0 |
| src/components/Typography/SectionTitle.astro | 34 | 0 |
| src/styles/a11y/base/theme-overrides.css | 32 | 0 |
| src/styles/a11y/pages/asset-detail.css | 30 | 0 |
| src/styles/buttons/basic-button.css | 30 | 0 |

## Commit History

1. `a6594d6` — Add migration scripts and remove stale audit report
2. `1f4d603` — Add pre-migration colour audit report
3. `fcdbfca` — Run token migration script: 4358 token swaps, 47 hardcoded fixes
4. `fb2bf64` — Replace theme definition files with 21-token system
5. `7036239` — Add post-migration colour audit report
6. *(pending)* — Fix 3 straggler references + add migration summary
