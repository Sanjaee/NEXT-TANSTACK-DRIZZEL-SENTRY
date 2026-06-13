"use server";

import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProductInput } from "./schema";

export async function createProductAction(data: ProductInput) {
  try {
    await db.insert(products).values({
      name: data.name,
      description: data.description || null,
      price: data.price,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create product" };
  }
}

export async function updateProductAction(id: string, data: ProductInput) {
  try {
    await db.update(products).set({
      name: data.name,
      description: data.description || null,
      price: data.price,
    }).where(eq(products.id, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update product" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await db.delete(products).where(eq(products.id, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete product" };
  }
}
