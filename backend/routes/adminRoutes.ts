import express from 'express';
import Admin, { IAdminDocument } from '../models/Admin';
import { protect, generateToken } from '../middleware/authMiddleware';
import { Types } from 'mongoose';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email }).exec();

    if (admin && (await admin.comparePassword(password))) {
      const adminDoc = admin as IAdminDocument;
      res.json({
        _id: adminDoc._id,
        email: adminDoc.email,
        token: generateToken(adminDoc._id.toString())
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check admin status (protected route)
router.get('/check', protect, (req, res) => {
  res.json({ message: 'Admin authenticated' });
});

export default router; 