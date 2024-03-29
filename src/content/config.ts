import { z, defineCollection } from 'astro:content';

const articlesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean().optional().default(false),
    created: z.string(),
    modified: z.string().optional(),
    tags: z.array(z.any()),
    comments: z.boolean().optional().default(true),
  }),
});

const infoCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    modified: z.string().optional(),
  }),
});

export const collections = {
  articles: articlesCollection,
  info: infoCollection,
};
