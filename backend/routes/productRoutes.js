const express = require('express');
const router = express.Router();

const {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);

// Protected routes
router.post('/product/new', isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.put('/product/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.delete('/product/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.put('/review', isAuthenticatedUser, createProductReview);

module.exports = router; 