import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const worksheetStyleOverride = z.object({
  id: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  previewHtml: z.string().optional(),
  pdf: z.string().optional(),
});

const worksheets = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/worksheets' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: reference('topics'),
    tags: z.array(z.string()).default([]),
    grade: z.enum(['lower', 'middle', 'upper', 'all']).default('all'),
    lang: z.enum(['zh', 'en']),
    worksheetSlug: z.string(),
    styles: z.array(worksheetStyleOverride).default([]),
    coverEmoji: z.string().default('📘'),
    coverColor: z.string().default('#f3e8d5'),
    translationOf: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        })
      )
      .default([]),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/topics' }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['zh', 'en']),
    title: z.string(),
    description: z.string(),
    emoji: z.string().default('🌏'),
    order: z.number().default(100),
    translationOf: z.string().optional(),
  }),
});

export const collections = { worksheets, topics };
