"use server";

import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProductInput } from "./schema";
import cloudinary from "@/lib/cloudinary";

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "tanstak-products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return { success: true, url: (result as any).secure_url };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { error: "Failed to upload image" };
  }
}

export async function createProductAction(data: ProductInput) {
  try {
    await db.insert(products).values({
      name: data.name,
      description: data.description || null,
      price: data.price,
      imageUrl: data.imageUrl || null,
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
      imageUrl: data.imageUrl || null,
    }).where(eq(products.id, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update product" };
  }
}

function getCloudinaryPublicId(url: string) {
  try {
    const regex = /\/v\d+\/(.+)\.[a-zA-Z]+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteProductAction(id: string) {
  try {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (!product) {
      return { error: "Product not found" };
    }

    if (product.imageUrl) {
      const publicId = getCloudinaryPublicId(product.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await db.delete(products).where(eq(products.id, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete product" };
  }
}
