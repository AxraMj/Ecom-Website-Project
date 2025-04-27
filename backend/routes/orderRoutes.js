const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/return', protect, requestReturn);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/admin/:id/status', protect, authorize('admin'), updateOrderStatus);
router.get('/admin/stats', protect, authorize('admin'), getOrderStats);

module.exports = router; 