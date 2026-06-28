import { defineCollection, z } from 'astro:content';

const menu = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    style: z.string(),
    size: z.string(),
    abv: z.number(),
    price: z.number(),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    time: z.string(),
    description: z.string(),
  }),
});

const plants = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    price: z.number(),
    description: z.string(),
  }),
});

const stops = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    address: z.string(),
    hours: z.string(),
    phone: z.string(),
    email: z.string(),
    description: z.string(),
  }),
});

export const collections = { menu, events, plants, stops };
