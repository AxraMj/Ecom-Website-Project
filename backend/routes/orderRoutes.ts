import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  submitReturn,
  cancelOrder 
} from '../controllers/orderController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Order routes
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.post('/:id/return', submitReturn);
router.post('/:id/cancel', cancelOrder);

export default router; 