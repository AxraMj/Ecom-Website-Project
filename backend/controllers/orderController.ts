import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';

interface AuthRequest extends Request {
  user?: any;
}

// Create new order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shipping, payment, totalAmount } = req.body;

    // Create the order
    const order = await Order.create({
      userId: req.user._id,
      items,
      shipping,
      payment,
      totalAmount
    });

    // Clear the user's cart after successful order
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalPrice: 0 }
    );

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
};

// Get user's orders
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Get single order
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if the order belongs to the user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
}; 