"use server";

import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { LoginInput, RegisterInput } from "./schema";

export async function loginAction(values: LoginInput) {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function registerAction(values: RegisterInput) {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, values.email));
    
    if (existingUser.length > 0) {
      return { error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(values.password, 10);

    await db.insert(users).values({
      name: values.name,
      email: values.email,
      password: hashedPassword,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
