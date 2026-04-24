import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const worksheets = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/worksheets' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: reference('topics'),
    tags: z.array(z.string()).default([]),
    grade: z.enum(['lower', 'middle', 'upper', 'all']).default('all'),
    lang: z.enum(['zh', 'en']),
    slug: z.string(),
    pdf: z.string().optional(),
    previewHtml: z.string().optional(),
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
