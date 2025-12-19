import { defineCollection, z } from 'astro:content';

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
  'insights': insightsCollection,
  'projects': projectsCollection,
  'resources': resourcesCollection,
};
