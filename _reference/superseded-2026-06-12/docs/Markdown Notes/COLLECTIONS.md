# How to Create New Collections

## Quick Start (For You)

1. **Copy an existing collection folder** (like `creative-expression`) from `src/content/projects/` and rename it
   - Use lowercase letters and hyphens only
   - Example: `emotion-cards`, `mindful-moments`, `coping-strategies`

2. **Edit `index.md`** inside your new folder
   - Fill in the title, description, and other fields
   - Add resource slugs (the folder names from `src/content/assets/`)

3. **Add a `card.png`** image (800x600px recommended)
   - This is the thumbnail shown on collection cards

4. **Your collection is live!**
   - Masonry view: `/projects/your-folder-name`
   - Editorial view: `/projects/your-folder-name-editorial`

---

## For Claude: Creating a New Collection

When asked to create a new collection, follow these steps:

### Step 1: Create the folder structure
```
src/content/projects/[slug]/
  ├── index.md      (collection data)
  └── card.png      (thumbnail image)
```

### Step 2: Create index.md with this template

```yaml
---
title: "Collection Title"
description: "Short 1-2 sentence description for cards and search."
longDescription: |
  Longer description (2-3 paragraphs) explaining the collection.

  This appears on the collection detail page.

category: "Category Name"
date: "2024"

tags:
  - "Tag One"
  - "Tag Two"
  - "Tag Three"

whoItsFor: "Description of who would benefit from this collection."

cardImage: "./card.png"

resourceSlugs:
  - "asset-slug-one"
  - "asset-slug-two"
  - "asset-slug-three"

# OPTIONAL - remove if not needed:
insightSlugs: []
presentationSlugs: []

professional:
  intention: "Goal of the collection"
  summary: "Professional summary"
  guidanceNotes: |
    **How to Use:**
    Guidance for professionals.
  linkedSkills:
    - "Skill One"
    - "Skill Two"
  evidenceBasedBenefits:
    - "Benefit one"
    - "Benefit two"

specifications:
  - label: "Pages"
    value: "24"
    icon: "objects/file-fill"

highlights:
  - text: "Key feature callout"
    icon: "wellness/heart-fill"
---
```

### Step 3: Verify resource slugs exist
Each slug in `resourceSlugs` must match a folder in `src/content/assets/`

### Step 4: Add card.png image
Copy an existing card.png or create one (800x600px recommended)

---

## Field Reference

### Required Fields
| Field | Description |
|-------|-------------|
| `title` | Display name of collection |
| `description` | Short summary (1-2 sentences) |
| `longDescription` | Full description (2-3 paragraphs) |
| `category` | Main category |
| `date` | Year created |
| `tags` | Array of 3-5 tags |
| `whoItsFor` | Target audience |
| `cardImage` | Always `"./card.png"` |
| `resourceSlugs` | Array of asset slugs |

### Optional Fields
| Field | Description |
|-------|-------------|
| `insightSlugs` | Related blog article slugs |
| `presentationSlugs` | Related presentation slugs |
| `professional` | Professional guidance section |
| `specifications` | Quick fact cards |
| `highlights` | Feature callouts |

### resourceSlugs
Must match folder names in `src/content/assets/`:
```yaml
resourceSlugs:
  - "feelings-wheel"      # matches assets/feelings-wheel/
  - "emotion-cards"       # matches assets/emotion-cards/
```

### Common linkedSkills
- Emotional Regulation
- Social Skills
- Communication
- Self-Awareness
- Coping Strategies
- Problem-Solving
- Mindfulness
- Fine Motor Skills
- Language Development

### Icon Paths
Use Phosphor icons from `/public/Icons/phosphor/`:
- `objects/file-fill`
- `wellness/heart-fill`
- `interface/users-fill`
- `creative/lightbulb-fill`
- `nature/leaf-fill`
- `a11y/basket-fill`

---

## Example: Minimal Collection

```yaml
---
title: "Calm Down Cards"
description: "Visual coping strategy cards for emotional regulation."
longDescription: |
  A set of illustrated cards showing different calming techniques.
  Perfect for classrooms, therapy rooms, or home use.
category: "Emotional Regulation"
date: "2024"
tags:
  - "Emotions"
  - "Coping"
  - "Cards"
whoItsFor: "Children ages 5-12, parents, teachers, and therapists."
cardImage: "./card.png"
resourceSlugs:
  - "calm-down-cards"
  - "breathing-exercises"
professional:
  intention: "Support emotional regulation"
  summary: "Visual coping tools"
  guidanceNotes: "Use as needed"
  linkedSkills:
    - "Emotional Regulation"
  evidenceBasedBenefits:
    - "Helps with calming"
---
```

---

## Full Example

See `src/content/projects/creative-expression/index.md` for a complete example with all fields.

---

## Page URLs

Once created, collections are available at:
- **Masonry layout**: `/projects/[folder-name]`
- **Editorial layout**: `/projects/[folder-name]-editorial`
