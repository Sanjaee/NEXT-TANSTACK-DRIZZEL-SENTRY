import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "./schema";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("Seeding database...");

  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
    });
    console.log("✅ Seed complete! You can login with:");
    console.log("Email: admin@example.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

main();
