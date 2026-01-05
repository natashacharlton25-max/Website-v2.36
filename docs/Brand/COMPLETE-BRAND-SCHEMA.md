# Complete Brand Schema for Content Creation

**Version:** 1.0
**Purpose:** Comprehensive brand configuration for AI-powered content generation
**Use with:** Claude Code, Google Apps Script, Custom Integrations

---

## How to Use This Schema

### With Claude Code (VS Code Extension)

1. Open your website project in VS Code
2. Copy this entire file content
3. Give Claude Code this prompt:

```
I need you to analyze my website project and extract all brand information
according to this schema. Please search through:
- Package.json, astro.config.mjs, tailwind.config.js for design tokens
- src/data/, src/content/, src/config/ for brand content
- src/styles/ for CSS variables and typography
- public/ for brand assets

Return a complete JSON object following the schema below.

[PASTE THIS SCHEMA HERE]
```

### With Manual Data Entry

Use this schema as a reference when filling in brand data through the Empire v3.1 UI.

---

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Brand Profile",
  "description": "Complete brand configuration for content creation",
  "type": "object",
  "required": ["name"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Brand name",
      "example": "Acme Corporation"
    },
    "slug": {
      "type": "string",
      "description": "URL-friendly version (e.g., 'acme-corporation')",
      "example": "acme-corporation"
    },
    "description": {
      "type": "string",
      "description": "Brief brand description",
      "example": "Leading provider of innovative business solutions"
    },
    "website": {
      "type": "string",
      "format": "uri",
      "description": "Primary website URL",
      "example": "https://acme.com"
    },
    "industry": {
      "type": "string",
      "description": "Industry sector",
      "example": "Technology"
    },

    "identity": {
      "type": "object",
      "description": "Core brand identity",
      "properties": {
        "tagline": {
          "type": "string",
          "example": "Innovation at Scale"
        },
        "mission": {
          "type": "string",
          "example": "To empower businesses through technology"
        },
        "vision": {
          "type": "string",
          "example": "A world where technology serves humanity"
        },
        "coreValues": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["Innovation", "Integrity", "Excellence"]
        },
        "personality": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["Professional", "Innovative", "Trustworthy"]
        },
        "brandStory": {
          "type": "string",
          "example": "Founded in 2015, Acme began with a simple mission..."
        }
      }
    },

    "colors": {
      "type": "array",
      "description": "Brand color palette with CSS tokens",
      "items": {
        "type": "object",
        "required": ["name", "hex"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Token name",
            "example": "Primary Blue"
          },
          "hex": {
            "type": "string",
            "pattern": "^#[0-9A-Fa-f]{6}$",
            "example": "#0066FF"
          },
          "colorName": {
            "type": "string",
            "description": "Actual color name (auto-detected)",
            "example": "Royal Blue"
          },
          "role": {
            "type": "string",
            "enum": ["primary", "secondary", "accent", "custom"],
            "example": "primary"
          },
          "cssVariable": {
            "type": "string",
            "description": "CSS custom property name",
            "example": "--color-primary"
          }
        }
      }
    },

    "fonts": {
      "type": "array",
      "description": "Typography system",
      "items": {
        "type": "object",
        "required": ["name", "family"],
        "properties": {
          "name": { "type": "string", "example": "Heading Font" },
          "family": { "type": "string", "example": "Inter, sans-serif" },
          "role": {
            "type": "string",
            "enum": ["heading", "body", "monospace"],
            "example": "heading"
          },
          "weight": { "type": "string", "example": "700" },
          "source": { "type": "string", "example": "google" }
        }
      }
    },

    "designSystem": {
      "type": "object",
      "description": "Complete design system tokens",
      "properties": {
        "colorSystem": {
          "type": "object",
          "properties": {
            "background": { "type": "string", "description": "Page background hex", "example": "#FFFFFF" },
            "surface": { "type": "string", "description": "Card/panel background hex", "example": "#F9FAFB" },
            "textPrimary": { "type": "string", "example": "#111827" },
            "textSecondary": { "type": "string", "example": "#6B7280" },
            "link": { "type": "string", "example": "#0066FF" },
            "linkHover": { "type": "string", "example": "#0052CC" },
            "border": { "type": "string", "example": "#E5E7EB" },
            "accent1": { "type": "string", "description": "Primary CTA color", "example": "#0066FF" },
            "accent2": { "type": "string", "example": "#8B5CF6" },
            "accent3": { "type": "string", "example": "#10B981" }
          }
        },
        "layout": {
          "type": "object",
          "properties": {
            "maxWidth": { "type": "number", "description": "Max content width in pixels", "example": 1200 },
            "gridColumns": { "type": "number", "example": 12 },
            "gridGap": { "type": "number", "description": "Grid gap in pixels", "example": 24 },
            "baseSpacing": { "type": "number", "description": "Base spacing unit", "example": 8 },
            "sectionPaddingY": { "type": "number", "example": 80 },
            "sectionPaddingX": { "type": "number", "example": 20 },
            "borderRadius": { "type": "number", "description": "Base border radius", "example": 8 },
            "breakpoints": { "type": "string", "description": "Comma-separated breakpoints", "example": "480,768,1024,1280" }
          }
        },
        "effects": {
          "type": "object",
          "properties": {
            "shadowStyle": { "type": "string", "enum": ["none", "soft", "md", "lg"], "example": "md" },
            "buttonRadius": { "type": "number", "example": 6 },
            "buttonShadow": { "type": "string", "example": "subtle" },
            "focusOutline": { "type": "string", "example": "2px solid #0066FF" }
          }
        },
        "typography": {
          "type": "object",
          "properties": {
            "headingFamily": { "type": "string", "example": "Inter, sans-serif" },
            "headingWeight": { "type": "number", "example": 700 },
            "bodyFamily": { "type": "string", "example": "Roboto, sans-serif" },
            "bodyWeight": { "type": "number", "example": 400 },
            "codeFamily": { "type": "string", "example": "JetBrains Mono, monospace" },
            "letterSpacing": { "type": "number", "example": 0 },
            "h1Size": { "type": "number", "example": 48 },
            "h1LineHeight": { "type": "string", "example": "1.2" },
            "h1Color": { "type": "string", "example": "#111827" },
            "h2Size": { "type": "number", "example": 36 },
            "h2LineHeight": { "type": "string", "example": "1.3" },
            "h2Color": { "type": "string", "example": "#111827" },
            "h3Size": { "type": "number", "example": 24 },
            "h3LineHeight": { "type": "string", "example": "1.4" },
            "h3Color": { "type": "string", "example": "#111827" },
            "bodySize": { "type": "number", "example": 16 },
            "bodyLineHeight": { "type": "string", "example": "1.6" },
            "bodyColor": { "type": "string", "example": "#374151" }
          }
        }
      }
    },

    "voiceAndTone": {
      "type": "object",
      "description": "Brand voice and tone guidelines",
      "properties": {
        "writingStyle": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["Concise", "Active voice", "Professional yet approachable"]
        },
        "wordsToUse": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["innovative", "transform", "empower"]
        },
        "wordsToAvoid": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["utilize", "leverage", "synergy"]
        },
        "toneVariations": {
          "type": "object",
          "description": "Tone by context",
          "example": {
            "social": "Friendly and engaging",
            "email": "Professional and helpful",
            "blog": "Educational and authoritative"
          }
        },
        "sentenceStyle": {
          "type": "object",
          "properties": {
            "preferredLength": {
              "type": "string",
              "enum": ["short", "medium", "long", "varied"]
            },
            "complexity": {
              "type": "string",
              "enum": ["simple", "moderate", "complex"]
            }
          }
        }
      }
    },

    "audience": {
      "type": "object",
      "description": "Target audience profile",
      "properties": {
        "primary": { "type": "string", "example": "Small to medium-sized businesses" },
        "demographics": { "type": "string", "example": "Business owners, age 30-55, tech-savvy" },
        "painPoints": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["Limited technical resources", "Complex technology landscape"]
        },
        "aspirations": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["Business growth", "Operational efficiency"]
        },
        "language": { "type": "string", "example": "professional" },
        "platforms": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["LinkedIn", "Twitter", "Industry forums"]
        }
      }
    },

    "contentGuidelines": {
      "type": "object",
      "description": "Content creation guidelines",
      "properties": {
        "themes": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["Innovation", "Business growth", "Technology trends"]
        },
        "pillars": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["Thought leadership", "Product updates", "Customer stories"]
        },
        "keywords": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["business solutions", "digital transformation", "technology innovation"]
        },
        "hashtags": {
          "type": "array",
          "items": { "type": "string" },
          "example": ["#AcmeCorp", "#Innovation", "#BusinessGrowth"]
        },
        "ctaStyle": {
          "type": "string",
          "example": "Action-oriented and benefit-focused (e.g., 'Start your free trial')"
        }
      }
    },

    "guidelines": {
      "type": "object",
      "description": "Canva-style brand guidelines with Summary/Do/Don't for each category",
      "properties": {
        "colors": {
          "type": "object",
          "properties": {
            "summary": { "type": "string", "maxLength": 500, "description": "What colors mean and when to use them" },
            "do": { "type": "string", "description": "Guidance for combinations, hierarchy, accessibility" },
            "dont": { "type": "string", "description": "Common mistakes to avoid" }
          }
        },
        "fonts": {
          "type": "object",
          "properties": {
            "summary": { "type": "string", "maxLength": 500 },
            "do": { "type": "string" },
            "dont": { "type": "string" }
          }
        },
        "logos": {
          "type": "object",
          "properties": {
            "summary": { "type": "string", "maxLength": 500 },
            "do": { "type": "string" },
            "dont": { "type": "string" }
          }
        },
        "brandVoice": {
          "type": "object",
          "properties": {
            "summary": { "type": "string", "maxLength": 500 },
            "do": { "type": "string" },
            "dont": { "type": "string" }
          }
        },
        "photos": {
          "type": "object",
          "properties": {
            "summary": { "type": "string", "maxLength": 500 },
            "do": { "type": "string" },
            "dont": { "type": "string" }
          }
        },
        "graphics": {
          "type": "object",
          "properties": {
            "summary": { "type": "string", "maxLength": 500 },
            "do": { "type": "string" },
            "dont": { "type": "string" }
          }
        },
        "icons": {
          "type": "object",
          "properties": {
            "summary": { "type": "string", "maxLength": 500 },
            "do": { "type": "string" },
            "dont": { "type": "string" }
          }
        }
      }
    },

    "brandAssets": {
      "type": "object",
      "description": "Brand asset URLs",
      "properties": {
        "logoTransparent": { "type": "string", "format": "uri" },
        "logoLight": { "type": "string", "format": "uri" },
        "logoDark": { "type": "string", "format": "uri" },
        "logoHeader": { "type": "string", "format": "uri" },
        "favicon": { "type": "string", "format": "uri" },
        "appIcon": { "type": "string", "format": "uri" },
        "ogImage": { "type": "string", "format": "uri", "description": "1200x630 Open Graph image" },
        "brandGuideUrl": { "type": "string", "format": "uri" },
        "assetPackUrl": { "type": "string", "format": "uri" }
      }
    },

    "siteConfig": {
      "type": "object",
      "description": "Website configuration",
      "properties": {
        "baseUrl": { "type": "string", "format": "uri", "example": "https://acme.com" },
        "siteSlug": { "type": "string", "example": "acme" },
        "blogUrl": { "type": "string", "format": "uri" },
        "blogSlug": { "type": "string", "example": "blog" },
        "blogCardTemplate": { "type": "string", "format": "uri" },
        "assetsPageUrl": { "type": "string", "format": "uri" },
        "assetsSlug": { "type": "string" },
        "contactUrl": { "type": "string", "format": "uri" },
        "privacyUrl": { "type": "string", "format": "uri" },
        "termsUrl": { "type": "string", "format": "uri" },
        "sitemapUrl": { "type": "string", "format": "uri" },
        "robotsPolicy": { "type": "string", "example": "index,follow" }
      }
    },

    "wordpressConfig": {
      "type": "object",
      "description": "WordPress-specific configuration",
      "properties": {
        "homePageId": { "type": "string" },
        "blogCategory": { "type": "string" },
        "defaultTags": { "type": "string" },
        "cardComponent": { "type": "string" },
        "apiBase": { "type": "string", "format": "uri" },
        "defaultAuthors": { "type": "string" }
      }
    },

    "componentPatterns": {
      "type": "object",
      "description": "HTML/CSS component patterns",
      "properties": {
        "buttonPrimary": { "type": "string", "description": "HTML snippet or class names" },
        "buttonSecondary": { "type": "string" },
        "buttonGhost": { "type": "string" },
        "cardPattern": { "type": "string" },
        "headerPattern": { "type": "string" },
        "footerPattern": { "type": "string" },
        "formPattern": { "type": "string" },
        "iconSource": { "type": "string", "example": "Flaticon Pro Pack" }
      }
    },

    "accessibility": {
      "type": "object",
      "description": "Accessibility standards",
      "properties": {
        "languageCode": { "type": "string", "example": "en-GB" },
        "contrastRatio": { "type": "string", "example": "4.5:1" },
        "motionReduction": { "type": "boolean" },
        "altTextPolicy": { "type": "string" },
        "keyboardTesting": { "type": "boolean" },
        "dyslexiaFont": { "type": "string" }
      }
    },

    "contactInfo": {
      "type": "object",
      "properties": {
        "emailGeneral": { "type": "string", "format": "email" },
        "emailSupport": { "type": "string", "format": "email" },
        "emailPress": { "type": "string", "format": "email" },
        "emailNoreply": { "type": "string", "format": "email" },
        "phone": { "type": "string" },
        "address": { "type": "string" }
      }
    },

    "socialAnalytics": {
      "type": "object",
      "properties": {
        "twitterUrl": { "type": "string", "format": "uri" },
        "linkedinUrl": { "type": "string", "format": "uri" },
        "instagramUrl": { "type": "string", "format": "uri" },
        "youtubeUrl": { "type": "string", "format": "uri" },
        "pinterestUrl": { "type": "string", "format": "uri" },
        "ga4MeasurementId": { "type": "string", "example": "G-XXXXXXXXXX" },
        "gtmContainerId": { "type": "string", "example": "GTM-XXXXXXX" },
        "metaPixelId": { "type": "string" }
      }
    },

    "seoConfig": {
      "type": "object",
      "properties": {
        "titlePrefix": { "type": "string" },
        "titleSuffix": { "type": "string" },
        "descriptionStyle": { "type": "string" },
        "canonicalBase": { "type": "string", "format": "uri" },
        "schemaType": { "type": "string", "example": "Organization" },
        "keywordPillars": { "type": "string", "description": "Comma-separated core keywords" }
      }
    },

    "contentPolicies": {
      "type": "object",
      "properties": {
        "toneGuideUrl": { "type": "string", "format": "uri" },
        "editorialGuideUrl": { "type": "string", "format": "uri" },
        "legalName": { "type": "string" },
        "companyNumber": { "type": "string" },
        "vatNumber": { "type": "string" },
        "riskFlags": { "type": "string", "description": "Comma-separated restricted topics" }
      }
    },

    "driveStructure": {
      "type": "object",
      "properties": {
        "brandFolderUrl": { "type": "string", "format": "uri" },
        "subfolderStructure": { "type": "string", "example": "Templates,Docs,UI,Assets,Media" },
        "gasProjectId": { "type": "string" },
        "masterSpreadsheetId": { "type": "string" }
      }
    },

    "ttsSettings": {
      "type": "object",
      "description": "Text-to-speech settings for voice content",
      "properties": {
        "voiceStyle": { "type": "string", "example": "Warm British female" },
        "toneKeywords": { "type": "string", "example": "nurturing, clear, empathetic" },
        "scriptStyle": { "type": "string", "example": "Conversational, therapist-like" }
      }
    },

    "brandIntention": {
      "type": "object",
      "description": "Brand mission and purpose summary",
      "properties": {
        "summary": { "type": "string", "maxLength": 500 },
        "keywords": { "type": "string" },
        "outline": { "type": "string", "description": "Bullet key-value format (Mission:, Audience:, etc.)" }
      }
    },

    "promptConfig": {
      "type": "object",
      "description": "AI prompt configuration",
      "properties": {
        "autoGenerate": { "type": "boolean" },
        "snippetShort": { "type": "string", "description": "Compact brand string for prompts" },
        "snippetLong": { "type": "string", "description": "Extended brand string for prompts" },
        "gasNotes": { "type": "string", "description": "Apps Script implementation notes" },
        "brandUid": { "type": "string", "description": "Unique brand identifier" }
      }
    }
  }
}
```

---

## Claude Code Prompt Template

Use this prompt with Claude Code to extract brand data from your website project:

```
I need you to analyze my website project and extract comprehensive brand information.
Please search through these locations:

1. **Configuration Files:**
   - package.json
   - astro.config.mjs / next.config.js / vite.config.js
   - tailwind.config.js / tailwind.config.ts
   - tsconfig.json

2. **Data & Content:**
   - src/data/
   - src/content/
   - src/config/
   - public/

3. **Styles:**
   - src/styles/ (look for CSS custom properties, design tokens)
   - Look for variables like --color-*, --font-*, --spacing-*, etc.

4. **Assets:**
   - public/images/
   - public/icons/
   - public/fonts/

Please extract and return a complete JSON object with:

- **colors**: All CSS color tokens with variable names, hex codes
- **fonts**: Font families, weights, roles (heading/body/code)
- **designSystem**: Typography scale (H1/H2/H3 sizes), spacing system, layout tokens
- **identity**: Mission, vision, values (from About page, homepage)
- **voiceAndTone**: Writing style, tone keywords (infer from content)
- **siteConfig**: Base URL, blog URL, contact URL, sitemap, robots
- **brandAssets**: Logo URLs, favicon, OG image
- **socialAnalytics**: Social media URLs, analytics IDs
- **seoConfig**: Title patterns, schema type, keyword pillars
- **accessibility**: Language code, contrast requirements

Return ONLY the JSON object, properly formatted and validated.
```

---

## Integration Notes

### For Google Apps Script

1. This schema can be imported into Google Sheets as a structured template
2. Use the `brandUid` field to link records across systems
3. The `gasNotes` field contains implementation-specific instructions

### For WordPress

1. All `wordpressConfig` fields map directly to WordPress settings
2. `cardComponent` references the theme's card/post template
3. Use `apiBase` for headless WordPress setups

### For Canva Brand Kits

1. The `guidelines` object maps directly to Canva's brand guidelines structure
2. Export to PDF using Canva's brand kit template autofill API
3. `colors` and `fonts` arrays can be imported into Canva directly

---

## Changelog

**v1.0** - Initial comprehensive schema with all design system and content creation fields
