import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import { hashPassword } from "../utils/auth.js";

const products = [
  {
    externalId: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack",
    price: 10799.10,
    description: "A practical everyday backpack with durable construction and room for essentials.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    thumbnail: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    stock: 18,
    rating: { rate: 3.9, count: 120 }
  },
  {
    externalId: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 2249.10,
    description: "A comfortable slim-fit casual t-shirt designed for everyday wear.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879_.jpg",
    thumbnail: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879_.jpg",
    stock: 30,
    rating: { rate: 4.1, count: 259 }
  },
  {
    externalId: 3,
    title: "Mens Cotton Jacket",
    price: 5129.10,
    description: "A versatile cotton jacket suitable for casual and outdoor styling.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    thumbnail: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    stock: 15,
    rating: { rate: 4.7, count: 500 }
  },
  {
    externalId: 4,
    title: "Mens Casual Slim Fit",
    price: 3149.10,
    description: "A lightweight casual slim-fit shirt with a clean modern silhouette.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    thumbnail: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    stock: 24,
    rating: { rate: 2.1, count: 430 }
  },
  {
    externalId: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 605699.10,
    description: "A handcrafted statement bracelet inspired by the Naga collection.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    thumbnail: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    stock: 7,
    rating: { rate: 4.6, count: 400 }
  },
  {
    externalId: 6,
    title: "Solid Gold Petite Micropave",
    price: 135899.10,
    description: "A refined gold piece with a delicate micropave finish.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/61W7tWbdoPL._AC_UL640_QL65_ML3_.jpg",
    thumbnail: "https://fakestoreapi.com/img/61W7tWbdoPL._AC_UL640_QL65_ML3_.jpg",
    stock: 9,
    rating: { rate: 3.9, count: 70 }
  },
  {
    externalId: 7,
    title: "White Gold Plated Princess",
    price: 4799.10,
    description: "A classic white-gold-plated jewellery piece for elegant occasions.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    thumbnail: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    stock: 20,
    rating: { rate: 3.0, count: 400 }
  },
  {
    externalId: 8,
    title: "WD 2TB Elements Portable External Hard Drive",
    price: 9899.10,
    description: "Portable external storage with a compact design for backups and files.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    thumbnail: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    stock: 12,
    rating: { rate: 3.3, count: 203 }
  },
  {
    externalId: 9,
    title: "SanDisk SSD PLUS 1TB Internal SSD",
    price: 5129.10,
    description: "Fast and dependable internal solid state storage for desktop upgrades.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    thumbnail: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    stock: 16,
    rating: { rate: 2.9, count: 470 }
  },
  {
    externalId: 10,
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket",
    price: 13499.10,
    description: "A warm and practical 3-in-1 jacket designed for cold-weather adventures.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51Y5NIYqYIL._AC_UX679_.jpg",
    thumbnail: "https://fakestoreapi.com/img/51Y5NIYqYIL._AC_UX679_.jpg",
    stock: 11,
    rating: { rate: 2.6, count: 235 }
  }
];

async function seed() {
  await connectDatabase();

  await Product.deleteMany({});
  await Cart.deleteMany({});

  await Product.insertMany(products);

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@shoppyglobe.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hashed = await hashPassword(adminPassword);

  await User.findOneAndUpdate(
    { email: adminEmail },
    { name: "ShoppyGlobe Admin", email: adminEmail, password: hashed, role: "admin" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Seeded ${products.length} products.`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
