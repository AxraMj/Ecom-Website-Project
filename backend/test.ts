import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';

dotenv.config();

const testProduct = {
  title: "Test Product",
  description: "A test product description",
  price: 99.99,
  category: "electronics",
  image: "https://via.placeholder.com/200",
  stock: 10,
  isFeatured: true
};

async function addTestProduct() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Drop the existing collection
    await mongoose.connection.collection('products').drop().catch(() => console.log('Collection does not exist yet'));
    console.log('Dropped existing collection');

    const product = new Product(testProduct);
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addTestProduct(); 