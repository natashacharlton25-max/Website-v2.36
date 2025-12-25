# TODO List

---

## SearchOverlay Refactoring

**Priority**: Medium
**Status**: Pending
**Component**: `src/components/Search/SearchOverlay.astro`

### Current Issues

The SearchOverlay component (650 lines) has hardcoded content and needs modernizing:

1. **Hardcoded Search Data** (lines 470-481)
   - Searchable content is hardcoded in the component
   - Should be generated at build time from actual pages/assets
   - No connection to real content

2. **Missing Features**
   - [ ] Keyboard navigation (arrow keys to navigate results)
   - [ ] Search highlighting (highlight matched terms in results)
   - [ ] Search history (recent searches stored in localStorage)
   - [ ] Fuzzy matching (typo tolerance)
   - [ ] Category filters

3. **Structure Improvements**
   - [ ] Extract CSS to `src/styles/components/search-overlay.css`
   - [ ] Extract JS to `src/lib/ui/search-overlay.ts`
   - [ ] Use Pagefind or similar for static site search
   - [ ] Split into sub-components:
     - `SearchInput.astro` - Input with clear button
     - `SearchResults.astro` - Results list rendering
     - `QuickLinks.astro` - Quick links grid

### Recommended Approach

**Option A: Pagefind Integration (Recommended)**
- Use Pagefind for automatic static site search indexing
- Zero-config, works at build time
- Excellent performance, small bundle size
- https://pagefind.app/

**Option B: Fuse.js Client-Side Search**
- Generate JSON of all searchable content at build
- Use Fuse.js for fuzzy matching
- More control but requires manual index maintenance

### Implementation Steps

1. [ ] Choose search solution (Pagefind recommended)
2. [ ] Install and configure search indexing
3. [ ] Extract CSS to separate file
4. [ ] Extract JS logic to `src/lib/ui/search-overlay.ts`
5. [ ] Update component to use dynamic search
6. [ ] Add keyboard navigation
7. [ ] Add search result highlighting
8. [ ] Test across all pages
9. [ ] Mobile UX improvements

### Files to Update/Create

```
src/
  components/
    Search/
      SearchOverlay.astro (refactor)
      SearchInput.astro (new)
      SearchResults.astro (new)
      QuickLinks.astro (new)
  lib/
    ui/
      search-overlay.ts (new - extract JS)
  styles/
    components/
      search-overlay.css (new - extract CSS)
```

---

## Email Downloads System - Svelte App

**Priority**: High
**Status**: Planning - Creating Separate Svelte Project
**Previous Doc**: `docs/todo/email-downloads-system.md` (DELETE after new app setup)

### Decision

Creating a standalone Svelte app for email/downloads management rather than integrating into the Astro site. This provides:
- Better separation of concerns
- Easier maintenance and updates
- Can be deployed independently
- Potential to serve multiple sites

### New Project Structure

```
email-downloads-app/           # Separate repository
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── emaillit.ts    # Emaillit API client
│   │   │   └── database.ts    # MySQL connection
│   │   ├── auth/
│   │   │   ├── jwt.ts         # JWT token handling
│   │   │   └── session.ts     # Session management
│   │   └── utils/
│   │       └── validation.ts  # Form validation
│   ├── routes/
│   │   ├── api/
│   │   │   ├── newsletter/
│   │   │   │   └── +server.ts
│   │   │   ├── downloads/
│   │   │   │   └── +server.ts
│   │   │   └── auth/
│   │   │       ├── login/+server.ts
│   │   │       ├── register/+server.ts
│   │   │       └── verify/+server.ts
│   │   ├── admin/
│   │   │   ├── +layout.svelte
│   │   │   ├── +page.svelte   # Dashboard
│   │   │   ├── emails/
│   │   │   └── subscribers/
│   │   └── download/
│   │       └── [token]/+page.svelte
│   └── components/
│       ├── EmailPreview.svelte
│       ├── SubscriberTable.svelte
│       └── DownloadStats.svelte
├── static/
│   └── email-templates/
│       ├── welcome.html
│       ├── download-links.html
│       └── newsletter-confirm.html
├── prisma/
│   └── schema.prisma          # Database schema
└── package.json
```

### Tech Stack for Svelte App

- **Framework**: SvelteKit
- **Database**: Prisma ORM + Hostinger MySQL
- **Email**: Emaillit API
- **Auth**: Custom JWT or Auth.js
- **Styling**: Tailwind CSS
- **Deployment**: Hostinger Node.js or Vercel

### Core Features

1. **API Endpoints** (for Astro site to call)
   - `POST /api/newsletter/subscribe`
   - `POST /api/downloads/request`
   - `GET /api/download/[token]`
   - Authentication endpoints

2. **Admin Dashboard**
   - View/manage subscribers
   - Email logs and delivery status
   - Download analytics
   - Send email campaigns

3. **Email Templates**
   - Welcome email
   - Download links email
   - Newsletter templates
   - Preview before sending

### Integration with Astro Site

The Astro site will call the Svelte app's API:

```typescript
// In Astro checkout form
const response = await fetch('https://email-app.example.com/api/downloads/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: formData.email,
    firstName: formData.firstName,
    downloads: cartItems,
    subscribeNewsletter: formData.newsletter
  })
});
```

### Next Steps

1. [ ] Create new Svelte project repository
2. [ ] Set up SvelteKit with TypeScript
3. [ ] Configure Prisma with MySQL schema
4. [ ] Implement Emaillit integration
5. [ ] Build API endpoints
6. [ ] Create admin dashboard
7. [ ] Design email templates
8. [ ] Deploy to Hostinger
9. [ ] Update Astro checkout to use new API
10. [ ] Delete old `email-downloads-system.md`

---

## CSS Token System Audit

**Priority**: High
**Status**: In Progress
**Reference**: `docs/Markdown Notes/CSS-Tokens.md`, `docs/Markdown Notes/CSS-Standards.md`

### Executive Summary

The design system has a strong foundational token structure with excellent coverage of typography, spacing, and colors. However, **accessibility styles introduce significant inconsistency** with numerous hardcoded values that bypass the token system.

---

### PART A: Token Definition Issues

#### 1. Duplicate Token Definitions

**gradients.css** - Same token defined twice with different values:
- [ ] `--gradient-vivid-primary` (lines 435 & 740)
- [ ] `--gradient-deep-primary` (lines 507 & 844)
- [ ] `--gradient-vivid-secondary` (lines 443 & 751)
- [ ] `--gradient-deep-secondary` (lines 515 & 855)

**BrandDefault.css** - Identical hex values:
- [ ] `--color-Primary-50` and `--color-Primary-100` both `#f4fbf2`

#### 2. Redundant Tokens (Same Value)

**shadows.css**:
- [ ] `--shadow-xs` and `--shadow-sm` have identical definitions - consolidate

**typography.css** - All use same font stack:
- [ ] Remove `--font-special` (unused, same as --font-heading)
- [ ] Remove `--font-secondary` (unused, same as --font-body)

**spacing.css** - Double aliases:
- [ ] `--border-radius-*` AND `--radius-*` both exist (intentional but review)

#### 3. Unused Tokens

**gradients.css** - ~70 of 85 gradients never referenced:
- [ ] All `--gradient-accent1-*` through `--gradient-accent5-*` variants
- [ ] All `--gradient-*-radial-*` variants
- [ ] All `--gradient-rainbow-*` variants
- [ ] All `--gradient-pastel-*`, `--gradient-vivid-*` accent variants
- [ ] Decision: delete or document purpose

**typography.css**:
- [ ] `--font-special` - never used
- [ ] `--font-secondary` - never used

#### 4. Missing Token Definitions

**BrandDefault.css**:
- [ ] Missing `--color-BackgroundDark-*` tokens (required by shadows.css)
- [ ] **CRITICAL:** Missing `--color-Secondary-900` (referenced by 7 a11y themes, causes fallback issues)
  - Add after line 32: `--color-Secondary-900: #5a3420;`

**status.css** - Missing variants:
- [ ] Only defines `--color-Error`, but `--color-Error-500`, `--color-Error-100` expected
- [ ] Same for Warning, Success, Info

**checkout.css** - References undefined tokens:
- [ ] `--brand-neutral-200` → fix to `--color-Neutral-200`
- [ ] `--brand-neutral-300` → fix to `--color-Neutral-300`
- [ ] `--brand-success` → fix to `--color-Success`

#### 5. Naming Inconsistencies

**Error vs Danger**:
- [ ] `--color-Error` (status.css) vs `--color-Danger` (gradients.css, global.css)
- [ ] Pick one and consolidate

#### 6. Brand Theme Specific Issues

**BrandDefault.css** - Scale inconsistencies:
- [ ] **Primary-50 = Primary-100** both `#f4fbf2` (DUPLICATE - remove Primary-50)
- [ ] **Text scale gaps:** Missing 100, 200 steps (has 50, 300, 400...950 instead)
- [ ] **Background incomplete:** Only goes to 500 (missing 600-900 for dark mode)
- [ ] **Secondary-100 to Secondary-200:** Very subtle difference (only 1% darker)

**Rarely used tokens (consider removing):**
- [ ] `--color-Text-50` (only 15 uses, can use Background-50 instead)
- [ ] `--color-Primary-50` (only 15 uses, identical to Primary-100)
- [ ] `--color-Primary-900` (only 15 uses, rarely needed)

**Naming improvements:**
- [ ] Rename AccentOne → AccentWarm (warm brown tones)
- [ ] Rename AccentTwo → AccentCool (blue tones)
- [ ] Rename AccentThree → AccentRose (mauve/rose tones)
- [ ] Rename AccentFour → AccentDark (slate blue)
- [ ] Rename AccentFive → AccentPurple (violet tones)

**Token Health Score: 4.4/10** (Needs Improvement)
- Duplicate Prevention: ❌ FAIL
- Scale Consistency: ❌ FAIL
- Naming Clarity: ⚠️ POOR
- Usage Coverage: ✅ GOOD

**Most used tokens (validate importance):**
- Text-800: 475 occurrences
- Primary-500: 261 occurrences
- Background-*: 322 occurrences (all variants)
- Neutral-*: 175 occurrences (all variants)

#### 7. Semantic Token Layer Architecture (CRITICAL FINDING)

**Current State: 3 Token Systems (System #3 doesn't exist!)**

| System | Location | Status | Notes |
|--------|----------|--------|-------|
| Literal Scale | BrandDefault.css | ✅ Complete | Primary-50 to -900 (brand foundation) |
| A11Y Semantic | semantic-tokens.css | ✅ Working | --bg, --surface, --text (purpose-based) |
| Brand Semantic | checkout.css expects | ❌ **UNDEFINED** | --brand-text, --brand-primary (not implemented!) |

**Key Finding: A11Y Themes Collapse All Scales to 4 Colors**

All 7 a11y themes prove that **semantic naming > scale granularity**:
- Primary-50 through Primary-900 → single color (#C5E1A5 in dark mode)
- Background-50 through Background-500 → single color (#121212 in dark mode)
- Text-50 through Text-950 → single color (#ccd3da in dark mode)

**This works perfectly** - components should use purpose-based tokens, not scale numbers.

**Masonry Grid Code Explosion (501 lines!):**
- Currently: 7 themes × ~70 lines each = 501 lines of duplicated overrides
- With semantic tokens: ~50 lines total (90% reduction)
- File: `src/styles/a11y/components/masonry-grid.css`

**Missing Token Categories (High Impact):**
- [ ] Form validation states (valid/invalid bg, borders, text)
- [ ] Interactive state tokens (hover, active, disabled, focus)
- [ ] Border system (subtle, medium, strong, interactive)
- [ ] Loading/skeleton states
- [ ] Surface elevation system (base, raised, elevated, overlay)
- [ ] Data visualization colors (chart-color-1 through -6)
- [ ] Code syntax highlighting tokens

**Recommended: Implement Dual-Layer Token System**

**Layer 1 (Literal - Designer Control):**
```css
/* themes/brand/BrandDefault.css - Keep as foundation */
--color-Primary-500: #8fa68a;  /* Precise shade control */
```

**Layer 2 (Semantic - Component API) - CREATE THIS:**
```css
/* tokens/semantic-colors.css - NEW FILE NEEDED */
:root {
  /* SURFACES (elevation hierarchy) */
  --surface-base: var(--color-Background-50);
  --surface-raised: var(--color-Background-100);
  --surface-elevated: var(--color-Background-200);
  --surface-overlay: var(--color-Neutral-50);

  /* TEXT (content hierarchy) */
  --text-primary: var(--color-Text-900);
  --text-secondary: var(--color-Text-700);
  --text-tertiary: var(--color-Text-500);
  --text-disabled: var(--color-Text-400);
  --text-inverse: var(--color-White);

  /* BORDERS */
  --border-subtle: var(--color-Neutral-200);
  --border-medium: var(--color-Neutral-400);
  --border-strong: var(--color-Neutral-600);
  --border-interactive: var(--color-Primary-500);
  --border-focus: var(--color-Info-500);

  /* INTERACTIVE (buttons, links) */
  --interactive-primary: var(--color-Primary-500);
  --interactive-primary-hover: var(--color-Primary-600);
  --interactive-primary-active: var(--color-Primary-700);
  --interactive-disabled-bg: var(--color-Neutral-100);
  --interactive-disabled-text: var(--color-Text-400);

  /* FEEDBACK (validation states) */
  --feedback-success-bg: var(--color-Success);
  --feedback-success-text: #065f46;
  --feedback-success-border: #10b981;
  --feedback-error-bg: var(--color-Error);
  --feedback-error-text: #7f1d1d;
  --feedback-error-border: var(--color-Error);
  --feedback-warning-bg: var(--color-Warning);
  --feedback-warning-text: #92400e;

  /* FORM STATES */
  --form-bg: var(--color-White);
  --form-border: var(--color-Neutral-300);
  --form-border-hover: var(--color-Neutral-400);
  --form-border-focus: var(--color-Primary-500);
  --form-border-error: var(--color-Error);
  --form-border-success: var(--color-Success);
  --form-invalid-bg: color-mix(in oklch, var(--feedback-error-bg) 5%, transparent);
  --form-valid-bg: color-mix(in oklch, var(--feedback-success-bg) 5%, transparent);

  /* COMPONENT STATES */
  --state-hover-bg: color-mix(in oklch, var(--interactive-primary) 5%, transparent);
  --state-focus-ring: var(--color-Info-500);
  --state-focus-ring-width: 3px;
  --state-disabled-opacity: 0.5;
}
```

**Component Usage Pattern:**
```css
/* BEFORE (breaks in a11y themes) */
.card {
  background: var(--color-Background-100);  /* Literal scale */
  border: 1px solid var(--color-Neutral-200);
}
.card:hover {
  border-color: var(--color-Primary-400);  /* Becomes same as Primary-600 in a11y! */
}

/* AFTER (works in all themes) */
.card {
  background: var(--surface-raised);  /* Semantic purpose */
  border: 1px solid var(--border-subtle);
}
.card:hover {
  border-color: var(--border-interactive);  /* Always different from base */
}
```

**Action Items:**
- [ ] Create `src/styles/tokens/semantic-colors.css` with comprehensive semantic tokens
- [ ] Create `src/styles/tokens/semantic-surfaces.css` for elevation system
- [ ] Create `src/styles/tokens/semantic-interactive.css` for button/link states
- [ ] Create `src/styles/tokens/semantic-forms.css` for form validation
- [ ] Add `--brand-*` aliases to fix checkout.css undefined tokens
- [ ] Refactor masonry-grid.css from 501 lines to ~50 lines using semantic tokens
- [ ] Update buttons to use `--interactive-primary-hover` instead of scale difference
- [ ] Document dual-layer system in CSS-Tokens.md

**Impact:**
- Fixes hover effects breaking in a11y themes
- Reduces code duplication by 90% (masonry grid example)
- Makes components self-documenting with semantic names
- Enables theme switching without component rewrites

---

### PART B: Token Usage Issues (Hardcoded Values)

#### 1. CRITICAL: Hardcoded Colors in A11Y Styles

**Files requiring immediate attention:**

##### `src/styles/a11y/base/theme-overrides.css`
- [ ] Replace `#ffffff` with `var(--color-White)`
- [ ] Replace `#000000` with `var(--color-Black)`
- [ ] Replace `#333333` with `var(--color-Neutral-800)` or semantic token

##### `src/styles/a11y/components/masonry-grid.css`
- [ ] Replace 12+ instances of `#333333`
- [ ] Replace `#aaaaaa` with neutral token
- [ ] Replace `white` keyword with `var(--color-White)`
- [ ] Replace `rgba(0, 0, 0, 0.1)` with `color-mix(in oklch, var(--color-Black) 10%, transparent)`
- [ ] Replace `rgba(0, 0, 0, 0.6)` with `color-mix(in oklch, var(--color-Black) 60%, transparent)`

##### `src/styles/a11y/components/search-overlay.css`
- [ ] Replace `#ffffff`, `#333333`, `#555555`, `#f5f5f5` with tokens

##### `src/styles/a11y/components/accessibility-panel.css`
- [ ] Replace `rgba(0, 0, 0, 0.2)` and `rgba(0, 0, 0, 0.6)` with `color-mix()`

##### `src/styles/a11y/components/step-card.css`
- [ ] Replace `#000000`, `#666666`, `#8b6914` with tokens

##### `src/styles/a11y/components/switcher.css`
- [ ] Replace `#ffffff`, `#000000`, `#333333` with tokens

#### 2. CRITICAL: Print Styles Completely Hardcoded

**File**: `src/styles/a11y/base/print.css`

All values are hardcoded instead of using tokens:

- [ ] Replace `background: white` with token
- [ ] Replace `color: black` with token
- [ ] Replace `color: #666` (link URLs) with token
- [ ] Replace `background: #f5f5f5` (code blocks) with token
- [ ] Replace `border: 1px solid #ddd` with token
- [ ] Consider creating print-specific tokens:
  - `--print-text: var(--color-Black)`
  - `--print-background: var(--color-White)`
  - `--print-muted: var(--color-Neutral-500)`

#### 3. HIGH: Rgba() Usage Violations

Per CSS-Tokens.md standard, use `color-mix()` not `rgba()`:

**Files with rgba() violations:**
- [ ] `src/styles/pages/legal.css`: `rgba(0, 0, 0, 0.1)`
- [ ] `src/styles/pages/cart.css`: `rgba(0,0,0,0.08)`
- [ ] `src/styles/pages/asset-detail.css`: `rgba(0, 0, 0, 0.06)`, `rgba(0, 0, 0, 0.04)`
- [ ] `src/styles/components/toast.css`: various rgba values
- [ ] `src/styles/a11y/` - multiple files

**Correct pattern:**
```css
/* WRONG */
background: rgba(0, 0, 0, 0.1);

/* CORRECT */
background: color-mix(in oklch, var(--color-Black) 10%, transparent);
```

#### 4. HIGH: Border-Radius Token Migration

Per CSS-Tokens.md: Use `--radius-*` NOT `--border-radius-*`

- [ ] Audit all files for `--border-radius-` usage
- [ ] Replace with `--radius-sm`, `--radius-md`, `--radius-lg`, etc.
- [ ] `src/styles/pages/legal.css`: hardcoded `border-radius: 3px` → `var(--radius-sm)`

#### 5. MEDIUM: Shadow Inconsistencies

Components define hardcoded shadows instead of using tokens:

- [ ] `src/styles/pages/cart.css`: `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` → `var(--shadow-sm)`
- [ ] `src/styles/pages/legal.css`: `border-bottom: 1px solid rgba(0, 0, 0, 0.1)` → use border token
- [ ] `src/styles/a11y/components/accessibility-panel.css`: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2)` → `var(--shadow-sm)`
- [ ] `src/styles/buttons/confetti-button.css`: hardcoded pixel shadows
- [ ] `src/styles/components/toast.css`: various hardcoded shadows

#### 6. MEDIUM: Z-Index Violations

- [ ] `src/styles/buttons/confetti-button.css`: `z-index: 10` → should use `var(--z-*)` token
- [ ] `src/styles/components/toast.css`: `z-index: 9999` → document or add `--z-toast` token

#### 7. MEDIUM: Hardcoded Pixel Values

**Buttons:**
- [ ] `src/styles/buttons/confetti-button.css`: `-2px` offsets, `8px` indicator size
- [ ] `src/styles/buttons/basic-button.css`: `2.75rem`, `2rem`, `3.5rem` heights

**Components:**
- [ ] `src/styles/components/toast.css`: `100px` top, `20px` inset, `16px` blur, `40px` transforms
- [ ] `src/styles/components/cart-icon.css`: `32px`, `28px`, `16px`, `18px` sizes

**Pages:**
- [ ] `src/styles/pages/cart.css`: `60px`, `80px`, `32px`, `14px`, `40px`, `18px`
- [ ] `src/styles/pages/checkout.css`: `40px`, `20px`, `60px`, `100px`
- [ ] `src/styles/pages/asset-detail.css`: `80px`, `100px`, `500px`, `400px`

#### 8. MEDIUM: Letter-Spacing Inconsistencies

Current tokens: `--letter-spacing-tight`, `--letter-spacing-normal`, `--letter-spacing-wide`, etc.

Hardcoded values found:
- [ ] `src/styles/pages/asset-detail.css`: `letter-spacing: 0.05em` → `var(--letter-spacing-wide)`
- [ ] `src/styles/pages/checkout.css`: `letter-spacing: 0.05em` → `var(--letter-spacing-wide)`
- [ ] `src/styles/components/announcement-ticker.css`: `letter-spacing: 0.02em` → add token or use existing

#### 9. LOW: Animation/Transition Hardcoding

Hardcoded animation durations (should use transition tokens where applicable):
- [ ] `src/styles/components/toast.css`: `1s`, `0.8s`, `1.2s` animations
- [ ] `src/styles/components/cart-icon.css`: `0.4s`, `0.5s` animations
- [ ] `src/styles/buttons/confetti-button.css`: `1.5s` confetti animation
- [ ] `src/styles/design/GlowTokens.css`: `4s`, `2s` glow animations
- [ ] `src/styles/buttons/styled-button.css`: `.4s` transitions

#### 10. LOW: Missing Token Definitions

Consider adding these tokens for completeness:

**Blur Tokens (for glassmorphism):**
```css
--blur-sm: 4px;
--blur-md: 8px;
--blur-lg: 12px;
--blur-xl: 16px;
```

**Icon Size Tokens:**
```css
--icon-xs: 16px;
--icon-sm: 24px;
--icon-md: 32px;
--icon-lg: 48px;
```

**Transform Tokens (for animations):**
```css
--translate-y-sm: 4px;
--translate-y-md: 8px;
--translate-y-lg: 16px;
```

---

### Priority Order for Fixes

1. **Immediate** (breaks theme switching):
   - PART A: Duplicate tokens, missing BackgroundDark tokens, Error/Danger naming
   - PART B: A11Y hardcoded colors, undefined token references, rgba() → color-mix()

2. **High** (violates standards):
   - PART A: Remove unused gradients (~70 tokens)
   - PART B: Print styles tokenization, border-radius migration, shadow token usage

3. **Medium** (consistency):
   - PART A: Consolidate redundant tokens (shadow-xs/sm, fonts)
   - PART B: Z-index standardization, pixel value tokenization, letter-spacing

4. **Low** (nice to have):
   - PART A: Review radius aliases
   - PART B: Animation token creation, new token definitions (blur, icon, transform)

---

### Files Summary (103 CSS files total)

| Directory | Files | Token Coverage | Issues |
|-----------|-------|----------------|--------|
| `tokens/` | 6 | Excellent | Duplicates, unused gradients |
| `themes/brand/` | 1 | Good | Missing BackgroundDark |
| `themes/a11y/` | Multiple | Good | Some undefined refs |
| `components/` | ~15 | Fair | Hardcoded shadows, sizes |
| `pages/` | ~10 | Fair | rgba(), hardcoded values |
| `buttons/` | ~8 | Good | Some pixel values |
| `a11y/` | ~20 | Poor | **Many hardcoded colors** |
| `design/` | 3 | Good | Animation timing |
| `responsive/` | 5 | Good | Breakpoints defined |

---

### Verification Commands

After fixes, verify no hardcoded values remain:

```bash
# Find remaining hex colors (should only be in token definitions)
grep -r "#[0-9a-fA-F]\{3,6\}" src/styles/ --include="*.css"

# Find rgba() usage (should be zero outside of token files)
grep -r "rgba(" src/styles/ --include="*.css"

# Find hardcoded px outside of token files
grep -r "[0-9]\+px" src/styles/ --include="*.css" | grep -v tokens/
```

also colour mix shoudl only be used for some ally things