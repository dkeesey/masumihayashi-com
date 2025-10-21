// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `type` and `schema` for each collection
const artworksCollection = defineCollection({
  type: 'content',
  schema: z.object({
      cloudinaryId: z.string(),
      series: z.string(),
      slug: z.string(),
      name: z.string(),
      title: z.string(),
      altTag: z.string(),
      media: z.string(),
      year: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      size: z.string(),
      inventory: z.string(),
      // tags: z.array(z.string()),
    })
});
// Export a single `collections` object to register your collection(s)
export const collections = {
  art: artworksCollection,
};

