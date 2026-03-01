# Render Refactor — Audit Log

## Components

### atoms/icons/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| Icon | yes | done | Extraction complete. a11y.css deleted (before _reference rule). Re-audited: added `aria-hidden="true"`, `semanticRole` prop + `data-semantic-role` attribute, `renders.textonly: null`. Parked: `.icon-label` + wrapper span (41-consumer blast radius — do with Tooltip atom). |
| LottieIcon | yes | done | Moved to own folder. Scoped `<style>` → LottieIcon.css (no @layer, no :global). Schema + barrel created. `renders.textonly: null` (decorative, not rendered). Imports updated in Button, GlassNav, ReaderNav, ShareSection → barrel. |

### atoms/ui/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| Badge | yes | done | Extraction complete. Dark theme → theme-luminance-dark.css. a11y files → _reference. Schema + barrel updated. |
| Text | yes | done | No CSS extraction needed. @layer unwrapped. a11y files → _reference. Schema + barrel updated. Hardcoded rem → tokens. |
| Button | | pending | |
| Card | | pending | |
| Heading | yes | done | No CSS extraction needed. @layer unwrapped. Hardcoded rem → tokens. a11y files → _reference. Icon import → barrel. Schema restructured. Note: `[key: string]: any` index signature in Props for `...rest` spread — loosens type safety but intentional for native HTML attr passthrough. |
| Link | | pending | |
| List | | pending | |
| Toast | | pending | |
| Menu/DPadMenu | | pending | |
| Menu/RadialMenu | | pending | |
| Menu/ShareMenu | | pending | |

### atoms/a11y/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| Announcer | | pending | |
| PresetButton | | pending | |
| Stepper | | pending | |

### atoms/canvas/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| RevealCanvas | | pending | |

### atoms/effects/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| DrawIcon | | pending | |
| PagePatternLayer | | pending | |
| ParallaxDecor | | pending | |
| PatternOverlay | | pending | |
| PhysicsOverlay | | pending | |
| ScrollColorBackground | | pending | |

### atoms/form/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| FormField | | pending | |

### atoms/gallery/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| GalleryItem | | pending | Uses .style.css naming (needs rename) |

### atoms/grid/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| Grid | | pending | |

### atoms/images/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| Image | yes | done | Full extraction process followed. @layer unwrapped from Image.css + Image.responsive.css. Ambient transition + hover transform + tilt gated behind `.image--animate` (CSS-level invariant). a11y.css + a11y.recovery.css → _reference/Image/. All 5 a11y rules confirmed "already covered" by render pipeline. Schema created (content/visual/animation split — hover + tilt in animation). `semanticRole` prop added. `resolvedAlt` flipped to descriptive-first. AAC semantic role CSS + cognitive level tier CSS added. Test page verified full alt text pipeline. |

---

### molecules/a11y/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| FontCard | | pending | Standalone .astro |
| ToggleCard | | pending | Standalone .astro |

### molecules/cards/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| (loose files) | | pending | ~22 card .astro files + 7 a11y.css files. No component folders. |

### molecules/checkout/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| DownloadSummary | | pending | Standalone .astro |

### molecules/contact/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| ContactInfo | | pending | Uses .style.css naming |
| ContactPopup | | pending | Standalone .astro |

### molecules/effects/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| ConnectorTimeline | | pending | Uses .style.css naming |
| LiquidReveal | | pending | Uses .style.css naming |

### molecules/global/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| AnnouncementTicker | | pending | Loose files, no folder |
| CookieBanner | | pending | Loose files, no folder |
| CustomScrollbar | | pending | |

### molecules/insights/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| InsightContent | | pending | Standalone .astro |
| InsightHeader | | pending | Standalone .astro |

### molecules/media/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| ImageOverlay | | pending | Has schema + index.ts |

### molecules/nav/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| SideTabs | | pending | Loose files + side-tabs.a11y.css |
| Breadcrumbs | | pending | Standalone .astro |

### molecules/product/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| ProductInfo | | pending | Standalone .astro |

### molecules/sections/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| QuoteSection | | pending | Standalone .astro |
| TextSection | | pending | Standalone .astro |
| CalloutSection | | pending | Standalone .astro |

### molecules/shop/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| CartIcon | | pending | Loose files |

### molecules/switcher/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| (loose files) | | pending | Multiple .astro + switcher.a11y.css |

### molecules/timeline/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| TimelineStepper | | pending | Standalone .astro |

---

### organisms/a11y/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| AccessibilityPanel | | pending | Panel itself — special case |

### organisms/contact/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| ContactForm | | pending | Uses .style.css naming |

### organisms/Footer/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| Footer | | pending | Uses .style.css naming |

### organisms/grids/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| (loose files) | | pending | Multiple .astro + masonry-grid.a11y.css |

### organisms/IconScrollStage/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| IconScrollStage | | pending | Uses .style.css naming |

### organisms/nav/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| GlassNav | | pending | Multi-file split (base, expandable, hamburger, mobile) |
| LegalNav | | pending | Standalone .astro |
| ReaderNav | | pending | Standalone .astro |

### organisms/product/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| IsotopeImageGallery | | pending | Loose files |
| ProductGallery | | pending | Loose files |

### organisms/ScrollMorph/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| ScrollMorphZone | | pending | Uses .style.css naming |

### organisms/search/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| SearchResults | | pending | |

### organisms/sections/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| HeroSection | | pending | Uses .style.css naming + duplicate hero-section.a11y.css |
| CTASection | | pending | Loose files |
| (many loose .astro) | | pending | ~15 standalone section files |

### organisms/shop/
| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| MiniCart | | pending | Standalone .astro |

---

## Non-component folders

| Folder | Audited | Status | Notes |
|--------|---------|--------|-------|
| src/Content/ | | pending | Content collections |
| src/PageImages/ | | pending | Image assets |
| src/data/ | | pending | Data files |
| src/layouts/ | | pending | Layout templates |
| src/lib/ | | pending | Utilities + animation + cart + config |
| src/pages/ | | pending | Route pages |
| src/scripts/ | | pending | Client scripts |
| src/styles/ | | pending | Global styles, tokens, themes, zones |
| components/Insights/ | | pending | Top-level |
| components/Presentation/ | | pending | Top-level |
| components/Sections/ | | pending | Top-level |
| components/Typography/ | | pending | Top-level |

---

## Post-audit notes

<!-- Add follow-up items here as we audit each component -->

### Structural issues spotted pre-audit
- Multiple components use `.style.css` naming instead of `.css`
- molecules/cards/ has ~22 loose .astro files with no component folders
- Several organisms have loose files instead of proper component folders
- GlassNav has unusual multi-file CSS split
- HeroSection has duplicate a11y file (HeroSection.a11y.css + hero-section.a11y.css)

### Extraction targets created so far
- `src/styles/zones/theme-luminance-dark.css` — Badge dark theme rules
