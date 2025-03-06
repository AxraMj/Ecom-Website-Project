import express from 'express';
import { createOrder, getUserOrders, getOrderById, submitReturn } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all order routes
router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.post('/:id/return', submitReturn);

export default router; 