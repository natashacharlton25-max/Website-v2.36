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
**Reference**: `docs/Markdown Notes/CSS-Tokens.md`

---

### 1. Duplicate Token Definitions

**gradients.css** - Same token defined twice with different values:
- [ ] `--gradient-vivid-primary` (lines 435 & 740)
- [ ] `--gradient-deep-primary` (lines 507 & 844)
- [ ] `--gradient-vivid-secondary` (lines 443 & 751)
- [ ] `--gradient-deep-secondary` (lines 515 & 855)

**BrandDefault.css** - Identical hex values:
- [ ] `--color-Primary-50` and `--color-Primary-100` both `#f4fbf2`

---

### 2. Redundant Tokens (Same Value)

**shadows.css**:
- [ ] `--shadow-xs` and `--shadow-sm` have identical definitions - consolidate

**typography.css** - All use same font stack:
- [ ] Remove `--font-special` (unused, same as --font-heading)
- [ ] Remove `--font-secondary` (unused, same as --font-body)

**spacing.css** - Double aliases:
- [ ] `--border-radius-*` AND `--radius-*` both exist (intentional but review)

---

### 3. Unused Tokens

**gradients.css** - ~70 of 85 gradients never referenced:
- [ ] All `--gradient-accent1-*` through `--gradient-accent5-*` variants
- [ ] All `--gradient-*-radial-*` variants
- [ ] All `--gradient-rainbow-*` variants
- [ ] All `--gradient-pastel-*`, `--gradient-vivid-*` accent variants
- [ ] Decision: delete or document purpose

**typography.css**:
- [ ] `--font-special` - never used
- [ ] `--font-secondary` - never used

---

### 4. Missing Token Definitions

**BrandDefault.css**:
- [ ] Missing `--color-BackgroundDark-*` tokens (required by shadows.css)

**status.css** - Missing variants:
- [ ] Only defines `--color-Error`, but `--color-Error-500`, `--color-Error-100` expected
- [ ] Same for Warning, Success, Info

**checkout.css** - References undefined tokens:
- [ ] `--brand-neutral-200` → fix to `--color-Neutral-200`
- [ ] `--brand-neutral-300` → fix to `--color-Neutral-300`
- [ ] `--brand-success` → fix to `--color-Success`

---

### 5. Naming Inconsistencies

**Error vs Danger**:
- [ ] `--color-Error` (status.css) vs `--color-Danger` (gradients.css, global.css)
- [ ] Pick one and consolidate

---

### 6. Hardcoded Values (Quick Wins)

**a11y files** - Replace hex colors with tokens:
- [ ] `masonry-grid.css`: 12+ instances of `#333333`
- [ ] `search-overlay.css`: `#ffffff`, `#333333`, `#555555`, `#f5f5f5`
- [ ] `switcher.css`: `#ffffff`, `#000000`, `#333333`
- [ ] `step-card.css`: `#000000`, `#666666`

**rgba() → color-mix()**:
- [ ] `legal.css`, `cart.css`, `asset-detail.css`, `toast.css`

