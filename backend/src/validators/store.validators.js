import { z } from "zod";

export const listStoresPublicSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    sortBy: z.string().optional(),
    sortDir: z.enum(["asc", "desc"]).optional()
  })
});

export const rateStoreSchema = z.object({
  params: z.object({
    storeId: z.string().min(1)
  }),
  body: z.object({
    value: z.number().int().min(1).max(5)
  })
});
