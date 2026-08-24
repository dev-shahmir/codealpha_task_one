require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const products = [
  {
    name: 'Oversized Cotton Hoodie',
    slug: 'oversized-cotton-hoodie',
    description:
      'A heavyweight, garment-dyed hoodie cut for an oversized, streetwear-inspired fit. Made from 100% brushed cotton fleece for everyday comfort.',
    shortDescription: 'Heavyweight oversized fleece hoodie.',
    category: 'unisex',
    subCategory: 'hoodies',
    price: 68,
    compareAtPrice: 85,
    images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', alt: 'Oversized Cotton Hoodie' }],
    variants: [
      { size: 'S', color: 'Black', colorHex: '#111111', stock: 12 },
      { size: 'M', color: 'Black', colorHex: '#111111', stock: 20 },
      { size: 'L', color: 'Black', colorHex: '#111111', stock: 15 },
      { size: 'M', color: 'Sand', colorHex: '#d8c3a5', stock: 10 },
    ],
    tags: ['hoodie', 'streetwear', 'oversized'],
    material: '100% brushed cotton fleece',
    featured: true,
    isNewArrival: true,
  },
  {
    name: 'Tailored Wool-Blend Overcoat',
    slug: 'tailored-wool-blend-overcoat',
    description:
      'A refined, minimalist overcoat tailored from a premium wool blend. Structured shoulders and a clean silhouette make this a cold-weather staple.',
    shortDescription: 'Minimalist tailored wool-blend overcoat.',
    category: 'men',
    subCategory: 'outerwear',
    price: 189,
    compareAtPrice: 240,
    images: [{ url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', alt: 'Wool Overcoat' }],
    variants: [
      { size: 'M', color: 'Charcoal', colorHex: '#36454f', stock: 8 },
      { size: 'L', color: 'Charcoal', colorHex: '#36454f', stock: 6 },
      { size: 'XL', color: 'Camel', colorHex: '#c19a6b', stock: 5 },
    ],
    tags: ['coat', 'outerwear', 'formal'],
    material: '70% wool, 30% polyester blend',
    featured: true,
  },
  {
    name: 'Ribbed Knit Midi Dress',
    slug: 'ribbed-knit-midi-dress',
    description:
      'A body-skimming ribbed midi dress with a soft stretch knit. Effortlessly transitions from day to evening.',
    shortDescription: 'Soft-stretch ribbed knit midi dress.',
    category: 'women',
    subCategory: 'dresses',
    price: 74,
    images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', alt: 'Ribbed Knit Dress' }],
    variants: [
      { size: 'S', color: 'Olive', colorHex: '#708238', stock: 14 },
      { size: 'M', color: 'Olive', colorHex: '#708238', stock: 18 },
      { size: 'M', color: 'Black', colorHex: '#111111', stock: 16 },
    ],
    tags: ['dress', 'knitwear', 'minimal'],
    material: '95% viscose, 5% elastane',
    featured: true,
    isNewArrival: true,
  },
  {
    name: 'Relaxed Fit Denim Jeans',
    slug: 'relaxed-fit-denim-jeans',
    description:
      'Rigid selvedge denim jeans with a relaxed leg and mid-rise waist. Built to soften and fade beautifully over time.',
    shortDescription: 'Relaxed-fit rigid selvedge denim.',
    category: 'men',
    subCategory: 'denim',
    price: 92,
    images: [{ url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', alt: 'Denim Jeans' }],
    variants: [
      { size: '30', color: 'Indigo', colorHex: '#3f5b8a', stock: 10 },
      { size: '32', color: 'Indigo', colorHex: '#3f5b8a', stock: 22 },
      { size: '34', color: 'Indigo', colorHex: '#3f5b8a', stock: 14 },
    ],
    tags: ['denim', 'jeans'],
    material: '100% rigid cotton selvedge denim',
  },
  {
    name: 'Minimal Leather Tote',
    slug: 'minimal-leather-tote',
    description:
      'A structured full-grain leather tote with an interior laptop sleeve. Understated hardware, made to age gracefully.',
    shortDescription: 'Structured full-grain leather tote.',
    category: 'accessories',
    subCategory: 'bags',
    price: 145,
    images: [{ url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800', alt: 'Leather Tote' }],
    variants: [
      { size: 'One Size', color: 'Tan', colorHex: '#d2b48c', stock: 9 },
      { size: 'One Size', color: 'Black', colorHex: '#111111', stock: 11 },
    ],
    tags: ['bag', 'leather', 'accessories'],
    material: 'Full-grain leather',
    featured: true,
  },
  {
    name: 'Court Leather Sneakers',
    slug: 'court-leather-sneakers',
    description:
      'Clean, low-profile leather sneakers with a cupsole construction. A minimal silhouette that pairs with everything.',
    shortDescription: 'Low-profile leather court sneakers.',
    category: 'footwear',
    subCategory: 'sneakers',
    price: 118,
    images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', alt: 'Leather Sneakers' }],
    variants: [
      { size: '40', color: 'White', colorHex: '#f5f5f5', stock: 13 },
      { size: '41', color: 'White', colorHex: '#f5f5f5', stock: 17 },
      { size: '42', color: 'White', colorHex: '#f5f5f5', stock: 20 },
      { size: '43', color: 'White', colorHex: '#f5f5f5', stock: 9 },
    ],
    tags: ['sneakers', 'footwear', 'minimal'],
    material: 'Leather upper, rubber cupsole',
    isNewArrival: true,
  },
];

const seed = async () => {
  await connectDB();

  console.log('Clearing existing products...');
  await Product.deleteMany();

  console.log('Seeding products...');
  await Product.insertMany(products);

  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    console.log('Creating admin user...');
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      isEmailVerified: true,
    });
  } else {
    console.log('Admin user already exists, skipping.');
  }

  console.log('✅ Seed complete.');
  console.log(`Admin login -> email: ${process.env.ADMIN_EMAIL} | password: ${process.env.ADMIN_PASSWORD}`);
  mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
