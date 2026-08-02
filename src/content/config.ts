import { defineCollection, z } from 'astro:content';

const menu = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    style: z.string(),
    size: z.string(),
    abv: z.number(),
    price: z.number(),
    available: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // The CMS writes the date unquoted, which YAML parses as a Date, while
    // hand-written entries quote it. Accept either and normalize to
    // YYYY-MM-DD, which is what happenings.astro compares and formats.
    date: z
      .union([z.string(), z.date()])
      .transform(value => (typeof value === 'string' ? value : value.toISOString().slice(0, 10))),
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
