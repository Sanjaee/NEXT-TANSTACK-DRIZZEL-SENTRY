import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  imageUrl: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
