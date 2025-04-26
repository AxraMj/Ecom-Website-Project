import { Request, Response } from 'express';
import Product, { IProductDocument, IProductSchema } from '../models/Product';
import User, { IUserDocument } from '../models/User';
import Cart from '../models/Cart';
import mongoose, { Document } from 'mongoose';
import { AuthRequest } from '../types/custom';
import { IAdminDocument } from '../models/Admin';
import axios from 'axios';

interface Review {
  user: string;
  name: string;
  rating: number;
  comment: string;
}

interface CreateProductRequest extends AuthRequest {
  body: {
    name: string;
    description: string;
    price: number;
    category: string;
    seller: string;
    stock: number;
    images: Array<{ url: string }>;
  };
}

interface CreateReviewRequest extends AuthRequest {
  body: {
    rating: number;
    comment: string;
    productId: string;
  };
}

// Create new product
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error creating product'
    });
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
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

    // Execute query
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error fetching products'
    });
  }
};

// Get single product
export const getSingleProduct = async (req: Request, res: Response) => {
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
              _id: (product._id as any).toString(),
              id: product.id || (product._id as any).toString()
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
};

// Update product (admin only)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error updating product'
    });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error deleting product'
    });
  }
};

// Create new review
export const createProductReview = async (req: CreateReviewRequest, res: Response) => {
  try {
    const { rating, comment, productId } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if the user is an admin
    if (req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admins cannot create reviews'
      });
    }

    // Type guard to ensure we have a user document
    const user = req.user as IUserDocument;
    if (!user.name) {
      return res.status(400).json({
        success: false,
        message: 'User name is required'
      });
    }

    const review: Review = {
      user: user._id.toString(),
      name: user.name,
      rating: Number(rating),
      comment
    };

    const product = await Product.findById(productId) as IProductDocument;

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Initialize reviews array if it doesn't exist
    if (!product.reviews) {
      product.reviews = [];
    }

    const isReviewed = product.reviews.find(
      r => r.user.toString() === user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach(reviewItem => {
        if (reviewItem.user.toString() === user._id.toString()) {
          reviewItem.comment = comment;
          reviewItem.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Calculate the average rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred'
    });
  }
}; 