import mongoose from 'mongoose';
import axios from 'axios';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const customProducts = [
  {
    id: 'f1',
    title: 'Premium Wireless Headphones',
    price: 199.99,
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    rating: { rate: 4.8, count: 250 },
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'g1',
    title: 'Smart Home Security Camera',
    price: 129.99,
    description: 'HD security camera with motion detection and night vision',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827',
    rating: { rate: 4.8, count: 156 },
    isCustom: true,
  },
  {
    id: 'g2',
    title: 'Wireless Noise-Canceling Earbuds',
    price: 199.99,
    description: 'Premium wireless earbuds with active noise cancellation',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
    rating: { rate: 4.7, count: 189 },
    isCustom: true,
  },
  {
    id: 'w1',
    title: 'Premium Smartwatch with Health Tracking',
    price: 299.99,
    description: 'Advanced smartwatch with comprehensive health monitoring features',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d',
    rating: { rate: 4.9, count: 245 },
    isCustom: true,
    isFeatured: true,
  },
  {
    id: 'w2',
    title: 'Luxury Automatic Watch - Gold Edition',
    price: 599.99,
    description: 'Elegant gold-plated automatic watch with premium craftsmanship',
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa',
    rating: { rate: 4.8, count: 178 },
    isCustom: true,
  },
  {
    id: 'w3',
    title: 'Sports Smartwatch with GPS',
    price: 199.99,
    description: 'Sports-focused smartwatch with built-in GPS and fitness tracking',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf',
    rating: { rate: 4.7, count: 212 },
    isCustom: true,
  },
  {
    id: 'g8',
    title: 'Mini Drone with HD Camera',
    price: 299.99,
    description: 'Compact drone with HD camera and stable flight control',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31',
    rating: { rate: 4.8, count: 198 },
    isCustom: true,
  },
  {
    id: 'g6',
    title: 'Bluetooth Speaker with RGB Lights',
    price: 79.99,
    description: 'Portable Bluetooth speaker with dynamic RGB lighting effects',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    rating: { rate: 4.6, count: 167 },
    isCustom: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert custom products
    await Product.insertMany(customProducts);
    console.log('Inserted custom products');

    // Fetch and insert products from external API
    const response = await axios.get('https://fakestoreapi.com/products');
    const apiProducts = response.data.map((product: any) => ({
      ...product,
      isCustom: false,
      isFeatured: Math.random() > 0.8, // Randomly mark some products as featured
    }));

    await Product.insertMany(apiProducts);
    console.log('Inserted API products');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 