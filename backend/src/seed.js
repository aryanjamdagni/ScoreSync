import mongoose from "mongoose";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Store from "./models/Store.js";
import Rating from "./models/Rating.js";

async function seed() {
  await connectDB();

  console.log("🧹 Clearing old data...");
  await Promise.all([
    Rating.deleteMany({}),
    Store.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log("👤 Creating users...");
  const admin = await User.create({
    name: "System Administrator Account For ScoreSync",
    email: "admin@test.com",
    address: "Admin Office Address, Bengaluru, Karnataka, India",
    passwordHash: await User.hashPassword("Admin@123"),
    role: "ADMIN",
  });

  const owner = await User.create({
    name: "Store Owner Account Managing Store Ratings System",
    email: "owner@test.com",
    address: "MG Road, Bengaluru, Karnataka, India",
    passwordHash: await User.hashPassword("Owner@123"),
    role: "OWNER",
  });

  const user = await User.create({
    name: "Normal User Account For Submitting Ratings System",
    email: "user@test.com",
    address: "HSR Layout, Bengaluru, Karnataka, India",
    passwordHash: await User.hashPassword("User@1234"),
    role: "USER",
  });

  console.log("🏪 Creating stores...");
  const store1 = await Store.create({
    name: "GreenMart Superstore",
    email: "greenmart@store.com",
    address: "MG Road, Bengaluru",
    ownerUserId: owner._id,
  });

  const store2 = await Store.create({
    name: "FreshCart Market",
    email: "freshcart@store.com",
    address: "Indiranagar, Bengaluru",
    ownerUserId: null,
  });

  console.log("⭐ Creating ratings...");
  await Rating.create({
    storeId: store1._id,
    userId: user._id,
    value: 5,
  });

  console.log("\n✅ Seed completed!");
  console.log("LOGIN ACCOUNTS:");
  console.log("ADMIN  -> admin@test.com / Admin@123");
  console.log("OWNER  -> owner@test.com / Owner@123");
  console.log("USER   -> user@test.com  / User@1234");
  console.log("\nStores created:", store1.name, "and", store2.name);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
