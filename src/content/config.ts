import { defineCollection, z, reference } from 'astro:content';

// Assets collection - one folder per asset with data + images
// Note: In Astro 5, 'slug' is reserved - use folder name via entry.id instead
const assetsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // Required fields
    id: z.string(), // Unique identifier (e.g., '1', '2', '3')
    name: z.string(),
    // slug is reserved in Astro 5 - folder name becomes the slug automatically
    sku: z.string(), // Stock keeping unit (e.g., '7DAY-001', 'BOUND-001')
    description: z.string(),
    type: z.enum(['worksheet', 'workbook', 'guide', 'toolkit', 'cards', 'poster', 'activity']),
    category: z.string(),
    tags: z.array(z.string()),

    // Optional detail fields
    longDescription: z.string().optional(),
    features: z.array(z.string()).optional(),
    fileSize: z.string().optional(),
    pageCount: z.number().optional(),

    // Download URLs
    downloadUrl: z.string().optional(),
    professionalGuideUrl: z.string().optional(),

    // Images in same folder
    cardImage: image(),
    galleryImages: z.array(image()).optional(),

    // Professional info (legacy - being replaced by forProfessionals)
    professional: z.object({
      intention: z.string().optional(),
      guidanceNotes: z.string().optional(),
      evidenceBasedBenefits: z.array(z.string()).optional(),
    }).optional(),

    // Tab content - For Individuals
    forIndividuals: z.object({
      overview: z.string().optional(), // HTML content for overview section
      howToUse: z.array(z.string()).optional(), // Step-by-step instructions
      whenToUse: z.array(z.string()).optional(), // Situations when this helps
      tips: z.array(z.string()).optional(), // Helpful tips
    }).optional(),

    // Tab content - For Professionals
    forProfessionals: z.object({
      clinicalContext: z.string().optional(), // Clinical/therapeutic context
      intendedUse: z.string().optional(), // How professionals can use this
      therapeuticApproach: z.string().optional(), // Underlying therapeutic approach
      evidenceBase: z.array(z.string()).optional(), // Evidence-based benefits
      adaptations: z.array(z.string()).optional(), // Ways to adapt for different needs
      sessionIntegration: z.string().optional(), // How to integrate into sessions
    }).optional(),

    // Specifications - for masonry grid display (label + value cards)
    specifications: z.array(z.object({
      label: z.string(), // e.g., "File Type", "Pages", "File Size"
      value: z.string(), // e.g., "PDF", "28", "36 MB"
      icon: z.string().optional(), // Phosphor icon name (e.g., "ph:file-pdf-duotone")
    })).optional(),

    // Highlights - feature/benefit cards (no label, just a statement)
    highlights: z.array(z.object({
      text: z.string(), // e.g., "Simple daily actions and reflective prompts"
      icon: z.string().optional(), // Phosphor icon name
    })).optional(),

    // SEO overrides (optional - falls back to name/description if not set)
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

// Blog/Insights collection - one folder per insight with data + images (standard blog posts)
const insightsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    author: z.string(), // Author slug (references authors collection folder name)
    category: z.string(),
    cardImage: image(), // Card image in same folder
    tags: z.array(z.string()).optional(),

    // Linked assets (workbooks, resources, etc.)
    linkedAssets: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      url: z.string(), // URL to asset page or download
      type: z.string().optional(), // "workbook", "guide", "template", etc.
    })).optional(),

    // SEO overrides (optional - falls back to title/description if not set)
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

// Presentations collection - scroll-driven Reader experiences
// These are separate from blog posts and use the Reader component
const presentationsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string().optional(),
    author: z.string().optional(), // Author slug (references authors collection)
    category: z.string(),
    cardImage: image(), // Card image in same folder
    tags: z.array(z.string()).optional(),

    // Where this presentation appears in listing grids
    showIn: z.array(z.enum(['insights', 'assets', 'projects'])).optional(),

    // Hero section - first page of the presentation
    // Uses title/description/cardImage by default, can override here
    hero: z.object({
      title: z.string().optional(), // Override title
      description: z.string().optional(), // Override description
      image: image().optional(), // Override image (co-located in same folder, e.g., ./hero.png)
      showCategory: z.boolean().optional(), // Show category badge (default: true)
      showDate: z.boolean().optional(), // Show publish date (default: true)
    }).optional(),

    // Reader sections - the scroll-driven content
    sections: z.array(z.object({
      id: z.string(), // Unique section ID for URL hash anchors
      title: z.string(), // Section title
      body: z.string(), // HTML content (50-100 words, fits viewport)
      alignment: z.enum(['left', 'right', 'center']).optional(), // Text alignment
      layout: z.enum(['text-only', 'image-text', 'full-width-image']).optional(), // Layout type
      image: image().optional(), // Image in same folder (e.g., ./permission.png)
      imagePosition: z.enum(['left', 'right']).optional(), // Image position for image-text layout
    })),

    // End section - last page of the presentation
    endSection: z.object({
      showAuthor: z.boolean().optional(), // Show author bio (default: true if author set)
      showRecommended: z.boolean().optional(), // Show recommended presentations (default: true)
      customHtml: z.string().optional(), // Custom HTML content for end section
    }).optional(),

    // Linked assets shown at end of presentation
    linkedAssets: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      url: z.string(),
      type: z.string().optional(),
    })).optional(),

    // SEO overrides
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

// Projects collection - one folder per project with data + images
const projectsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(), // Short description for cards
    longDescription: z.string(), // Full description
    category: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    whoItsFor: z.string(),

    // Images in same folder
    cardImage: image(),
    titleCardImage: image().optional(), // Hero/banner image

    // Resources - slugs that reference assets in content collection
    resourceSlugs: z.array(z.string()),

    // Insights - slugs that reference insights in content collection
    insightSlugs: z.array(z.string()).optional(),

    // Presentations - slugs that reference presentations in content collection
    presentationSlugs: z.array(z.string()).optional(),

    // Professional information
    professional: z.object({
      intention: z.string(),
      summary: z.string(),
      guidanceNotes: z.string(),
      evidenceBasedBenefits: z.array(z.string()),
      linkedSkills: z.array(z.string()).optional(), // e.g., ["Language development", "Fine motor skills"]
      downloadableResources: z.array(z.string()).optional(),
    }),

    // Specifications - label/value pairs for the grid (like "Focus: Process over Product")
    specifications: z.array(z.object({
      label: z.string(), // e.g., "Focus", "Duration", "Resources"
      value: z.string(), // e.g., "Process over Product", "5-15 min", "4"
      icon: z.string().optional(), // Phosphor icon (e.g., "ph:sparkle-duotone")
    })).optional(),

    // Highlights - standalone text callouts for the grid
    highlights: z.array(z.object({
      text: z.string(), // e.g., "No experience needed - creativity is for everyone"
      icon: z.string().optional(),
    })).optional(),

    // SEO overrides (optional - falls back to title/description if not set)
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

// Resources collection
const resourcesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.string(),
    downloadUrl: z.string(),
    fileSize: z.string(),
    fileFormat: z.string(),
    image: z.string(),
  }),
});

// Authors collection - one folder per author with data + image
const authorsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    role: z.string().optional(), // e.g., "Founder", "Guest Writer"
    bio: z.string(), // Short bio for author cards
    longBio: z.string().optional(), // Extended bio if needed
    photo: image(), // Author photo in same folder

    // Social/contact links (optional)
    website: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    email: z.string().optional(),

    // Professional credentials
    credentials: z.array(z.string()).optional(), // e.g., ["MBACP", "Dip. Counselling"]
    specialties: z.array(z.string()).optional(), // Areas of expertise
  }),
});

// Legal pages collection - markdown files for legal content
const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  'assets': assetsCollection,
  'insights': insightsCollection,
  'presentations': presentationsCollection,
  'projects': projectsCollection,
  'resources': resourcesCollection,
  'authors': authorsCollection,
  'legal': legalCollection,
};
