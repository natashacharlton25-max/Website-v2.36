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
  }),
});

// Blog/Insights collection
const insightsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    author: z.string(),
    category: z.string(),
    image: z.string(),
    tags: z.array(z.string()).optional(),

    // Reader mode configuration
    enableReader: z.boolean().optional(), // Enable scroll-driven Reader component
    readerSections: z.array(z.object({
      id: z.string(), // Unique section ID for URL hash anchors
      title: z.string(), // Section title
      body: z.string(), // HTML content (50-100 words, fits viewport)
      alignment: z.enum(['left', 'right', 'center']).optional(), // Text alignment
      layout: z.enum(['text-only', 'image-text', 'full-width-image']).optional(), // Layout type
      image: z.string().optional(), // Image path
      imagePosition: z.enum(['left', 'right']).optional(), // Image position for image-text
    })).optional(),

    // Linked assets (workbooks, resources, etc.)
    linkedAssets: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      url: z.string(), // URL to asset page or download
      type: z.string().optional(), // "workbook", "guide", "template", etc.
    })).optional(),
  }),
});

// Projects collection
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    year: z.string(),
    client: z.string(),
    services: z.array(z.string()),
    technologies: z.array(z.string()),
    image: z.string(),
    images: z.array(z.string()).optional(),
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

export const collections = {
  'assets': assetsCollection,
  'insights': insightsCollection,
  'projects': projectsCollection,
  'resources': resourcesCollection,
};
