import express from 'express';
import {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} from '../controllers/productController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import Product from '../models/Product';
import axios from 'axios';

const router = express.Router();

// Helper function to map frontend categories to our categories
function mapFrontendCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'electronics': 'electronics',
    'men\'s clothing': 'fashion',
    'women\'s clothing': 'fashion',
    'jewelery': 'fashion',
    'books': 'books',
    'gaming': 'gaming',
    'beauty': 'beauty',
    'furniture': 'furniture',
    'grocery': 'grocery'
  };
  return categoryMap[category.toLowerCase()] || category.toLowerCase();
}

// Public routes
router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);

// Protected routes
router.post('/product/new', protect, authorizeRoles('admin'), createProduct);
router.put('/product/:id', protect, authorizeRoles('admin'), updateProduct);
router.delete('/product/:id', protect, authorizeRoles('admin'), deleteProduct);
router.put('/review', protect, createProductReview);

// Get all products (including from FakeStore API)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const query: any = {};

    // Apply category filter
    if (category) {
      query.category = category;
    }

    // Apply search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get products from database
    const dbProducts = await Product.find(query);

    // Get products from FakeStore API
    const frontendResponse = await axios.get('https://fakestoreapi.com/products');
    const frontendProducts = frontendResponse.data.map((product: any) => ({
      ...product,
      source: 'frontend',
      isFeatured: false,
      stock: 100,
      category: mapFrontendCategory(product.category),
    }));

    // Filter frontend products by category if specified
    const filteredFrontendProducts = category 
      ? frontendProducts.filter((product: any) => 
          product.category.toLowerCase() === (category as string).toLowerCase()
        )
      : frontendProducts;

    // Combine products
    const allProducts = [...filteredFrontendProducts, ...dbProducts];

    // Apply sorting
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'rating-desc':
          sortOption = { 'rating.rate': -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedProducts = allProducts.slice(skip, skip + Number(limit));

    res.status(200).json({
      success: true,
      products: paginatedProducts,
      total: allProducts.length,
      pages: Math.ceil(allProducts.length / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching products'
    });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, minRating, sortBy } = req.query;
    
    // Get products from database
    const dbProducts = await Product.find({ source: 'database' });

    // Get products from FakeStore API
    const frontendResponse = await axios.get('https://fakestoreapi.com/products');
    let frontendProducts = frontendResponse.data.map((product: any) => ({
      ...product,
      source: 'frontend',
      isFeatured: false,
      stock: 100,
      category: mapFrontendCategory(product.category),
    }));

    // Combine products
    let allProducts = [...frontendProducts, ...dbProducts];

    // Apply search query
    if (q) {
      const query = (q as string).toLowerCase();
      allProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (category) {
      allProducts = allProducts.filter(product =>
        product.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    // Apply price range filter
    if (minPrice) {
      allProducts = allProducts.filter(product => product.price >= Number(minPrice));
    }
    if (maxPrice) {
      allProducts = allProducts.filter(product => product.price <= Number(maxPrice));
    }

    // Apply rating filter
    if (minRating) {
      allProducts = allProducts.filter(product => product.rating.rate >= Number(minRating));
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          allProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          allProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          allProducts.sort((a, b) => b.rating.rate - a.rating.rate);
          break;
        default:
          // Default sorting by relevance (if search query exists)
          if (q) {
            const query = (q as string).toLowerCase();
            allProducts.sort((a, b) => {
              const aTitle = a.title.toLowerCase();
              const bTitle = b.title.toLowerCase();
              const aExactMatch = aTitle === query;
              const bExactMatch = bTitle === query;
              if (aExactMatch && !bExactMatch) return -1;
              if (!aExactMatch && bExactMatch) return 1;
              return 0;
            });
          }
      }
    }

    res.json(allProducts);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching products' });
  }
});

// Get single product by ID
router.get('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // First try to fetch from FakeStore API since it's more likely to be a FakeStore ID
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
      const fakeStoreProduct = response.data;

      return res.json({
        success: true,
        product: {
          ...fakeStoreProduct,
          _id: fakeStoreProduct.id.toString(),
          id: fakeStoreProduct.id.toString()
        }
      });
    } catch (fakeStoreError) {
      // If FakeStore API fails, try MongoDB
      try {
        const product = await Product.findOne({
          $or: [
            { _id: productId },
            { id: productId }
          ]
        });

        if (product) {
          return res.json({
            success: true,
            product: {
              ...product.toObject(),
              _id: product._id.toString(),
              id: product.id || product._id.toString()
            }
          });
        }
      } catch (mongoError) {
        console.error('Error fetching from MongoDB:', mongoError);
      }
    }

    // If we get here, the product wasn't found in either place
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// Protected admin routes
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router; 