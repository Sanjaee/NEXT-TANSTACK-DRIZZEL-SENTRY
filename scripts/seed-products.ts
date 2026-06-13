import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { db } = await import("../src/lib/db");
  const { products } = await import("../src/db/schema");

  console.log("Memulai seeding 10000 data produk dummy...");
  
  const dummyProducts = [];
  const categories = ["Elektronik", "Pakaian", "Peralatan Rumah", "Mainan", "Buku"];
  
  for (let i = 0; i < 10000; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const basePrice = Math.floor(Math.random() * 50000) + 1000;
    
    dummyProducts.push({
      name: `Produk Dummy ${i + 1} - ${randomCategory}`,
      description: `Ini adalah deskripsi panjang untuk Produk Dummy nomor ${i + 1}. Produk ini sangat berkualitas dan direkomendasikan untuk Anda.`,
      price: basePrice,
    });
  }
  
  // Insert in chunks of 100 to avoid overloading the Neon serverless DB payload limits
  for (let i = 0; i < dummyProducts.length; i += 100) {
    const chunk = dummyProducts.slice(i, i + 100);
    await db.insert(products).values(chunk);
    console.log(`Berhasil memasukkan chunk ${Math.floor(i / 100) + 1}/10...`);
  }
  
  console.log("Seeding 1000 produk berhasil!");
  process.exit(0);
}

main().catch(err => {
  console.error("Terjadi error saat seeding:", err);
  process.exit(1);
});
