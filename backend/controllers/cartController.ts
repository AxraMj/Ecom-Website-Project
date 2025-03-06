import { Request, Response } from 'express';
import Cart from '../models/Cart';

interface AuthRequest extends Request {
  user?: any;
}

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    res.json(cart || { items: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

export const updateCart = async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body;
    const totalPrice = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0);

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { 
        userId: req.user._id,
        items,
        totalPrice
      },
      { new: true, upsert: true }
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalPrice: 0 }
    );
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
}; 