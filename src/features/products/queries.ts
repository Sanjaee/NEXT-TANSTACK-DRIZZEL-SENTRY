"use server";

import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getProductsQuery() {
  try {
    const data = await db.select().from(products).orderBy(desc(products.createdAt));
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
