import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values to handle frontend products
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'fashion', 'furniture', 'grocery', 'gaming', 'beauty', 'books'],
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isCustom: {
    type: Boolean,
    default: true,
  },
  source: {
    type: String,
    enum: ['database', 'frontend'],
    default: 'database'
  }
}, {
  timestamps: true,
});

// Add text indexes for search functionality
productSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
});

const Product = mongoose.model('Product', productSchema);

export default Product; 