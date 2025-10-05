const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life",
    category: "electronics",
    stock: 25
  },
  {
    name: "Smart Fitness Watch",
    price: 249.99,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "Track your health and fitness with advanced sensors and GPS",
    category: "electronics",
    stock: 40
  },
  {
    name: "Premium Leather Jacket",
    price: 399.99,
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    description: "Handcrafted genuine leather jacket with timeless design",
    category: "clothing",
    stock: 15
  },
  {
    name: "Minimalist Sneakers",
    price: 129.99,
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    description: "Clean design meets comfort in these versatile everyday sneakers",
    category: "clothing",
    stock: 60
  },
  {
    name: "Ergonomic Office Chair",
    price: 449.99,
    image_url: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&q=80",
    description: "Premium mesh chair with lumbar support and adjustable armrests",
    category: "home",
    stock: 20
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products inserted successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();