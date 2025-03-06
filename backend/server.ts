import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import Product from './models/Product';
import Admin from './models/Admin';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import { protect } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount admin routes first
app.use('/api/admin', adminRoutes);

// Mount routes
app.use('/api/auth', userRoutes);

// Protected routes example
app.use('/api/protected', protect, (req, res) => {
  res.json({ message: 'Protected route' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// Helper function to map frontend categories to our categories
function mapFrontendCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'electronics': 'electronics',
    'men\'s clothing': 'fashion',
    'women\'s clothing': 'fashion',
    'jewelery': 'fashion',
    'books': 'books',
  };
  return categoryMap[category.toLowerCase()] || 'other';
}

// Helper function to merge frontend and database products
async function getAllProducts(query: any = {}) {
  try {
    // Get products from database
    const dbProducts = await Product.find({ ...query, source: 'database' });

    // Get products from frontend API
    const frontendResponse = await axios.get('https://fakestoreapi.com/products');
    const frontendProducts = frontendResponse.data.map((product: any) => ({
      ...product,
      source: 'frontend',
      isFeatured: false,
      stock: 100,
      category: mapFrontendCategory(product.category), // Map the category
    }));

    // If there's a category filter, apply it to both sets
    if (query.category) {
      const filteredFrontendProducts = frontendProducts.filter(
        (product: any) => product.category === query.category
      );
      return [...filteredFrontendProducts, ...dbProducts];
    }

    // If no category filter, return all products
    return [...frontendProducts, ...dbProducts];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Routes

// Get all products with optional category and search query filters
app.get('/api/products', async (req, res) => {
  try {
    const { category, q } = req.query;
    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (q) {
      query.$text = { $search: q as string };
    }

    const products = await getAllProducts(query);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get featured products
app.get('/api/featured-products', async (req, res) => {
  try {
    const dbProducts = await Product.find({ isFeatured: true, source: 'database' });
    res.json(dbProducts);
  } catch (err) {
    console.error('Error fetching featured products:', err);
    res.status(500).json({ message: 'Error fetching featured products' });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await getAllProducts({ category });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});

// Get a single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let dbProduct = null;

    // Try to find in database
    try {
      // First try by MongoDB ObjectId if valid
      if (mongoose.Types.ObjectId.isValid(id)) {
        dbProduct = await Product.findById(id);
      }
      
      // If not found or not a valid ObjectId, try finding by regular id field
      if (!dbProduct) {
        dbProduct = await Product.findOne({ id: id });
      }

      if (dbProduct) {
        const productData = dbProduct.toObject();
        return res.json({
          ...productData,
          id: productData._id.toString(), // Convert ObjectId to string
          _id: productData._id.toString() // Include both for consistency
        });
      }
    } catch (dbError) {
      console.log('Database query error:', dbError);
    }

    // If not found in database, try frontend API
    try {
      const frontendResponse = await axios.get(`https://fakestoreapi.com/products/${id}`);
      if (frontendResponse.data) {
        const frontendProduct = {
          ...frontendResponse.data,
          source: 'frontend',
          isFeatured: false,
          stock: 100,
          category: mapFrontendCategory(frontendResponse.data.category)
        };
        return res.json(frontendProduct);
      }
    } catch (apiError: any) {
      if (apiError.response?.status === 404) {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw apiError;
    }

    // If we get here, product wasn't found in either source
    return res.status(404).json({ message: 'Product not found' });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create a new product (admin only)
app.post('/api/products', async (req, res) => {
  try {
    // Validate category
    const validCategories = ['electronics', 'fashion', 'furniture', 'grocery', 'gaming', 'beauty', 'books'];
    if (!validCategories.includes(req.body.category)) {
      return res.status(400).json({ 
        message: 'Invalid category. Valid categories are: ' + validCategories.join(', ') 
      });
    }

    // Add default values for new products
    const productData = {
      ...req.body,
      source: 'database',
      isCustom: true,
      rating: { rate: 0, count: 0 },
      stock: req.body.stock || 0,
      isFeatured: req.body.isFeatured || false
    };

    const product = new Product(productData);
    await product.save();

    console.log('New product created:', product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update a product (admin only, database products only)
app.put('/api/products/:id', async (req, res) => {
  try {
    console.log('Update request for product ID:', req.params.id);
    console.log('Update data:', req.body);

    // Check if the product exists and is a database product
    const existingProduct = await Product.findOne({
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ]
    });

    if (!existingProduct) {
      console.log('Product not found');
      return res.status(404).json({ message: 'Product not found' });
    }

    if (existingProduct.source !== 'database') {
      console.log('Cannot update frontend product');
      return res.status(403).json({ message: 'Cannot update frontend product' });
    }

    // Add missing fields
    const updateData = {
      ...req.body,
      rating: existingProduct.rating, // Preserve existing rating
      isCustom: true,
      source: 'database'
    };

    const product = await Product.findOneAndUpdate(
      { _id: existingProduct._id },
      updateData,
      { new: true, runValidators: true }
    );

    console.log('Updated product:', product);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete a product (admin only, database products only)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id,
      source: 'database'
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or cannot be deleted' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Create initial admin account if it doesn't exist
const createInitialAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      await Admin.create({
        email: 'admin@example.com',
        password: 'admin123' // This will be hashed automatically
      });
      console.log('Initial admin account created');
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createInitialAdmin();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 