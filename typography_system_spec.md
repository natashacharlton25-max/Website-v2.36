# Typography System Rebuild

## New Scale — 9 tokens, 7 elements

```
Level   Element       Token           Base (mobile-first)   Desktop (≥1024px)   Max (≥1440px)
─────   ──────────    ──────────────  ───────────────────   ─────────────────   ─────────────
  1     h1            --text-h1       2.25rem (36px)        3.5rem (56px)       4rem (64px)
  —     blockquote    --text-quote    2rem (32px)           3rem (48px)         3.5rem (56px)
  2     h2            --text-h2       1.75rem (28px)        2.25rem (36px)      2.5rem (40px)
  3     h3            --text-h3       1.5rem (24px)         1.75rem (28px)      —
  4     h4            --text-h4       1.25rem (20px)        —                   —
  5     h5            --text-h5       1.125rem (18px)       —                   —
  —     p             --text-body     1rem (16px)           —                   —
  6     h6 / small    --text-small    0.875rem (14px)       —                   —
  —     (legal/meta)  --text-fine     0.75rem (12px)        —                   —
```

Only top 4 scale responsively. Bottom 5 are fixed — readable at any viewport.

### Full responsive breakpoints

```
Token           XS(≤400)   Phone(≤640)  Tablet(≤768)  Base        Desktop(≥1024)  Max(≥1440)
──────────────  ─────────  ──────────── ────────────  ──────────  ──────────────  ──────────
--text-h1       2rem       2.25rem      2.75rem       2.25rem★    3.5rem          4rem
--text-quote    1.75rem    2rem         2.25rem       2rem★       3rem            3.5rem
--text-h2       1.5rem     1.75rem      2rem          1.75rem★    2.25rem         2.5rem
--text-h3       1.375rem   1.5rem       —             1.5rem★     1.75rem         —
--text-h4       —          —            —             1.25rem     —               —
--text-h5       —          —            —             1.125rem    —               —
--text-body     —          —            —             1rem        —               —
--text-small    —          —            —             0.875rem    —               —
--text-fine     —          —            —             0.75rem     —               —

★ = base value defined in typography.css (mobile-first)
```


## Old → New Token Migration Map

```
Old token        Old value    →  New token        New value     Component uses   Confidence
───────────────  ───────────  ─  ───────────────  ────────────  ──────────────   ──────────
--text-7xl       6rem         →  --text-h1        2.25rem base  2                ✅ direct
--text-6xl       3.75rem      →  --text-h1        2.25rem base  6                ✅ direct
--text-5xl       3rem         →  --text-h2        1.75rem base  14               ✅ direct
--text-4xl       2.25rem      →  --text-h3        1.5rem base   28               ✅ was old h3
--text-3xl       1.875rem     →  --text-h3        1.5rem base   42               ✅ close match
--text-2xl       1.5rem       →  --text-h4        1.25rem base  48               🟡 review 10
--text-xl        1.25rem      →  --text-h4        1.25rem base  67               ✅ exact
--text-lg        1.125rem     →  --text-h5        1.125rem base 89               ✅ exact
--text-base      1rem         →  --text-body      1rem          114              ✅ exact
--text-md        0.9375rem    →  --text-body      1rem          3                ✅ near
--text-sm        0.875rem     →  --text-small     0.875rem      192              ✅ exact
--text-xs        0.75rem      →  --text-fine      0.75rem       181              ✅ exact
--text-2xs       0.625rem     →  --text-fine      0.75rem       5                ✅ near

Total: 791 replacements, ~10 need manual review (--text-2xl ambiguous between h3/h4)
```

### --text-2xl review notes
48 uses. Most are subheadings and card titles at responsive breakpoints — they're genuinely
between h3 and h4. Recommendation: map to --text-h4 (1.25rem). The few that feel too small
can be promoted to --text-h3 in a follow-up pass. This keeps the migration scriptable.


## What this eliminates

- 13 arbitrary size tokens → 9 semantic tokens
- Dead responsive media queries in typography.css
- Duplicate responsive system (typography.css min-width vs responsive/*.css max-width)
- 439 raw font-size declarations that bypass the heading cascade
- Duplicate image utility classes in global.css (already in images.css)
- font-family: var(--font-heading) set 180 times (inherits from element now)
- 44 components setting heading-scale sizes that should inherit from h1-h6


## Template benefit

Python brand injection only touches:
- Brand colour tokens (already done)
- Font family tokens (--font-heading, --font-body) — 2 values
- The 9 size tokens IF a brand needs different sizing (optional override)
- Spacing, shadow, gradient tokens (already tokenised)

Components never need changing. HTML uses h1-h6/p, CSS inherits. Done.
