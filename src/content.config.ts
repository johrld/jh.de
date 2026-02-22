import { defineCollection, reference, z } from "astro:content";
import { file, glob } from "astro/loaders";

const multilingualText = z.object({
  de: z.string(),
  en: z.string(),
});

const authors = defineCollection({
  loader: file("src/data/authors.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    title: multilingualText.optional(),
    bio: multilingualText.optional(),
    image: z.string().optional(),
    social: z
      .object({
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
});


const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string().min(10).max(100),
    description: z.string().min(30).max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    keywords: z.array(z.string()).min(1).max(10),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    author: reference("authors").default("johannes"),

    tags: z.array(z.string()).min(1).max(5),
    lang: z.enum(["de", "en"]).default("de"),
    translationKey: z.string().optional(),
    translations: z.record(z.enum(["de", "en"]), z.string()).optional(),
  }),
});

export const collections = { authors, posts };
