# TODO List

## ThemeTokenGen & CSS Token Audit
Audit the complete CSS token system and ThemeTokenGen tooling together.

### Token Files to Review
- [ ] Identify all CSS token files in `src/styles/`
- [ ] Map token naming conventions (color, spacing, typography)
- [ ] Find duplicate/overlapping token definitions
- [ ] Document which tokens are actually used vs unused

### ThemeTokenGen Files
- [ ] `src/scripts/ThemeTokenGen/color-theory-explorer.css`
- [ ] `src/scripts/ThemeTokenGen/brand-template.css`
- [ ] `src/scripts/ThemeTokenGen/color-input.css`
- [ ] Review what tokens ThemeTokenGen produces
- [ ] Compare generated tokens vs manually defined tokens
- [ ] Decide: keep, move to tools/, or consolidate

### Final Actions
- [ ] Consolidate token definitions (single source of truth)
- [ ] Remove unused tokens
- [ ] Document final token structure
- [ ] Update ThemeTokenGen if keeping

