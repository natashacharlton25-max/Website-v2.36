# Atoms Folder Reorganisation — Claude Code Prompt

## Context

The `src/components/atoms/` folder currently contains the 10 canonical atoms plus components that don't belong there (effects, layout utilities, a11y panel internals, audit files). This task reorganises the folder so atoms/ only contains atoms, everything else moves to the correct location.

**Read these before starting:**
- `architecture-decisions.md` — section 1 defines the 10 canonical atoms
- `CLAUDE.md` — project rules

Read all referenced files fully. Do not skim. If unsure about anything, STOP and ask.

---

## CRITICAL: Import path sweep

Every move MUST be followed by a full codebase grep for the old import path. Update every reference. This includes:
- `.astro` files (imports and component usage)
- `.ts` / `.js` files (imports, re-exports, barrel files)
- `.css` files (any `@import` referencing moved files)
- `index.ts` barrel files (both the moved component's barrel and any parent barrels that re-export it)
- Any JSON or config files that reference component paths

**Process for each move:**
1. Move the folder
2. `grep -r "old/path/ComponentName" src/` to find all references
3. Update every reference to the new path
4. Verify build passes after each move (not just at the end)

Do NOT batch all moves and then fix imports. Move one component, fix its imports, confirm build, then move the next. If a build breaks, fix it before moving on.

---

## Target structure

### `src/components/atoms/` — canonical atoms only (flat, no ui/ subfolder)

Move these OUT of `ui/` into `atoms/` root:

| Atom | Current | Target |
|------|---------|--------|
| Text | `atoms/ui/Text/` | `atoms/Text/` |
| Heading | `atoms/ui/Heading/` | `atoms/Heading/` |
| Button | `atoms/ui/Button/` | `atoms/Button/` |
| Badge | `atoms/ui/Badge/` | `atoms/Badge/` |
| Link | `atoms/ui/Link/` | `atoms/Link/` |
| Card | `atoms/ui/Card/` | `atoms/Card/` |
| List | `atoms/ui/List/` | `atoms/List/` |
| Tooltip | does not exist yet | `atoms/Tooltip/` — create empty folder as placeholder |

Move these OUT of `icons/` into `atoms/` root:

| Atom | Current | Target |
|------|---------|--------|
| Icon | `atoms/icons/Icon/` | `atoms/Icon/` |
| LottieIcon | `atoms/icons/LottieIcon/` | `atoms/LottieIcon/` |

Move these OUT of `images/` into `atoms/` root:

| Atom | Current | Target |
|------|---------|--------|
| Image | `atoms/images/Image/` | `atoms/Image/` |

Move this OUT of `form/` into `atoms/` root:

| Atom | Current | Target |
|------|---------|--------|
| FormField | `atoms/form/FormField/` | `atoms/FormField/` |

After all atoms are flat in `atoms/`, delete the now-empty subfolders: `ui/`, `icons/`, `images/`, `form/`.

Also delete `form/index.ts` barrel — it's no longer needed when FormField is at `atoms/FormField/`.

---

### `src/components/molecules/` — components that compose atoms

| Component | Current | Target | Notes |
|-----------|---------|--------|-------|
| Toast | `atoms/ui/Toast/` | `molecules/Toast/` | Composes LottieIcon, Icon, Text atoms |
| GalleryItem | `atoms/gallery/` | `molecules/gallery/` | CSS-only / incomplete |

---

### `src/components/effects/` — decorative/animation effects

| Component | Current | Target |
|-----------|---------|--------|
| RevealCanvas | `atoms/canvas/RevealCanvas/` | `effects/RevealCanvas/` |
| DrawSVGIcon / ScrollDrawIcon | `atoms/effects/DrawIcon/` | `effects/DrawIcon/` |
| PagePatternLayer | `atoms/effects/PagePatternLayer/` | `effects/PagePatternLayer/` |
| ParallaxDecor | `atoms/effects/ParallaxDecor/` | `effects/ParallaxDecor/` |
| PatternOverlay | `atoms/effects/PatternOverlay/` | `effects/PatternOverlay/` |
| PhysicsOverlay | `atoms/effects/PhysicsOverlay/` | `effects/PhysicsOverlay/` |
| ScrollColorBackground | `atoms/effects/ScrollColorBackground/` | `effects/ScrollColorBackground/` |

Check if `src/components/effects/` already exists. If not, create it.

---

### `src/components/organisms/` — layout components

| Component | Current | Target |
|-----------|---------|--------|
| Grid | `atoms/grid/` | `organisms/Grid/` |

Check if `src/components/organisms/` already exists. If not, create it.

---

### `src/components/YourView/` — all a11y panel components together

The Your View panel currently has its components scattered across three levels. Consolidate them all into one folder.

**First:** Check these locations exist and identify all panel components:
- `atoms/a11y/` — expect: Announcer, PresetButton, Stepper
- `molecules/a11y/` — expect: FontCard, ToggleCard, AltTextCard
- `organisms/a11y/` — expect: AccessibilityPanel, VisualSection, TypographySection, TypographyAdjustmentsSection, A11yNavigationSection, ThemeSidebar

If you find additional panel components not listed here, include them in the move. If you find components that don't look panel-related, STOP and ask.

**Move ALL of them into `src/components/YourView/`:**

| Component | Current | Target |
|-----------|---------|--------|
| Announcer | `atoms/a11y/Announcer/` | `YourView/Announcer/` |
| PresetButton | `atoms/a11y/PresetButton/` | `YourView/PresetButton/` |
| Stepper | `atoms/a11y/Stepper/` | `YourView/Stepper/` |
| FontCard | `molecules/a11y/FontCard/` | `YourView/FontCard/` |
| ToggleCard | `molecules/a11y/ToggleCard/` | `YourView/ToggleCard/` |
| AltTextCard | `molecules/a11y/AltTextCard/` | `YourView/AltTextCard/` |
| AccessibilityPanel | `organisms/a11y/AccessibilityPanel/` | `YourView/AccessibilityPanel/` |
| VisualSection | `organisms/a11y/VisualSection/` | `YourView/VisualSection/` |
| TypographySection | `organisms/a11y/TypographySection/` | `YourView/TypographySection/` |
| TypographyAdjustmentsSection | `organisms/a11y/TypographyAdjustmentsSection/` | `YourView/TypographyAdjustmentsSection/` |
| A11yNavigationSection | `organisms/a11y/A11yNavigationSection/` | `YourView/A11yNavigationSection/` |
| ThemeSidebar | `organisms/a11y/ThemeSidebar/` | `YourView/ThemeSidebar/` |

These are panel-specific components — not general-purpose atoms, molecules, or organisms. They serve one function: the Your View panel and page. They live together.

After moving, delete the now-empty `a11y/` subfolders from `atoms/`, `molecules/`, and `organisms/`.

**Import path sweep must cover all three old locations:**
- `grep -r "atoms/a11y/" src/`
- `grep -r "molecules/a11y/" src/`
- `grep -r "organisms/a11y/" src/`

Also check for any `a11y-panel.ts`, `a11y-page.ts`, or layout files that import panel components — these are the most likely references.

---

### Audit files — move to reference

| Item | Current | Target |
|------|---------|--------|
| Atom Audit Files/ | `atoms/Atom Audit Files/` | `_reference/atom-audit-files/` |

This is documentation, not a component. Move to `_reference/` at project root (or wherever other reference docs live). Rename to kebab-case while moving.

---

## Execution order

1. **Effects first** — they have the fewest inbound imports, lowest risk
2. **Grid to organisms** — single component, quick
3. **YourView consolidation** — move all a11y panel components from atoms/a11y/, molecules/a11y/, organisms/a11y/ into components/YourView/. Three source locations, lots of imports to sweep.
4. **Toast and GalleryItem to molecules** — Toast recently refactored, check imports carefully. GalleryItem is CSS-only/incomplete, lower risk.
5. **Flatten atoms subfolders** — move all atoms from `ui/`, `icons/`, `images/`, `form/` to `atoms/` root. Create empty `atoms/Tooltip/` placeholder. This is the biggest change with the most import paths to update. Do one at a time.
6. **Audit files** — move to `_reference/`
7. **Clean up** — delete empty subfolders, delete orphaned barrel files

---

## Validation checklist

| # | Check | Expected |
|---|-------|----------|
| 1 | `atoms/` contains only: Text, Heading, Button, Badge, Link, Icon, LottieIcon, Image, Card, List, FormField, Tooltip | No other folders |
| 2 | No `ui/`, `icons/`, `images/`, `form/`, `canvas/`, `grid/`, `gallery/` subfolders in `atoms/` | All deleted (empty) |
| 3 | No `effects/` subfolder in `atoms/` | Moved to `components/effects/` |
| 4 | No `a11y/` subfolder in `atoms/`, `molecules/`, or `organisms/` | All moved to `components/YourView/` |
| 5 | All 12 panel components in `components/YourView/` | Announcer, PresetButton, Stepper, FontCard, ToggleCard, AltTextCard, AccessibilityPanel, VisualSection, TypographySection, TypographyAdjustmentsSection, A11yNavigationSection, ThemeSidebar |
| 6 | Toast in `molecules/Toast/` | Not in atoms |
| 7 | GalleryItem in `molecules/gallery/` | Not in atoms |
| 8 | All effects in `components/effects/` | Seven components |
| 9 | Grid in `components/organisms/` | Not in atoms |
| 10 | Audit files in `_reference/` | Not in atoms |
| 11 | Tooltip placeholder exists at `atoms/Tooltip/` | Empty folder created |
| 12 | `grep -r "atoms/ui/" src/` returns zero matches | All old paths updated |
| 13 | `grep -r "atoms/icons/" src/` returns zero matches | All old paths updated |
| 14 | `grep -r "atoms/images/" src/` returns zero matches | All old paths updated |
| 15 | `grep -r "atoms/form/" src/` returns zero matches | All old paths updated |
| 16 | `grep -r "atoms/canvas/" src/` returns zero matches | All old paths updated |
| 17 | `grep -r "atoms/grid/" src/` returns zero matches | All old paths updated |
| 18 | `grep -r "atoms/gallery/" src/` returns zero matches | All old paths updated |
| 19 | `grep -r "atoms/effects/" src/` returns zero matches | All old paths updated |
| 20 | `grep -r "atoms/a11y/" src/` returns zero matches | All old paths updated |
| 21 | `grep -r "molecules/a11y/" src/` returns zero matches | All old paths updated |
| 22 | `grep -r "organisms/a11y/" src/` returns zero matches | All old paths updated |
| 23 | Build passes clean after every individual move | No errors at any stage |
| 24 | Build passes clean at end | Final confirmation |

---

## Rules

- Move one component at a time, fix imports, verify build, then move next
- Do NOT delete any component files — only move them
- Do NOT modify component internals (CSS, Astro, schema) — only move and update import paths
- If a move breaks the build and you can't fix it, revert that move and ask
- If you find a component not listed here inside `atoms/`, STOP and ask before moving it
