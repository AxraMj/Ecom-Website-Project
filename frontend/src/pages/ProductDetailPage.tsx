import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  _id?: string;  // MongoDB ID
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  stock?: number;
  isFeatured?: boolean;
  isCustom?: boolean;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const ProductImage = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  maxHeight: '500px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
});

const SizeButton = styled(Button)(({ theme }) => ({
  minWidth: '60px',
  margin: theme.spacing(0.5),
  '&.selected': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Fallback products data
  const fallbackProducts: { [key: string]: Product[] } = {
    'furniture': [
      {
        id: 'f1',
        title: 'Modern Sofa Set',
        price: 899.99,
        description: 'Elegant and comfortable modern sofa set perfect for your living room. Features high-quality fabric upholstery and solid wood frame.',
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
        rating: { rate: 4.8, count: 120 }
      },
      {
        id: 'f2',
        title: 'Dining Table Set',
        price: 649.99,
        description: 'Contemporary dining table set with 6 chairs. Made from premium materials with a beautiful finish.',
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1617104662896-5090099d799d',
        rating: { rate: 4.6, count: 95 }
      },
      {
        id: 'f3',
        title: 'Queen Size Bed Frame',
        price: 499.99,
        description: 'Sturdy queen size bed frame with modern design. Includes headboard and support system.',
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
        rating: { rate: 4.7, count: 150 }
      },
      {
        id: 'f4',
        title: 'Kitchen Cabinet Set',
        price: 1299.99,
        description: 'Complete kitchen cabinet set with modern design and ample storage space.',
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
        rating: { rate: 4.9, count: 80 }
      }
    ],
    'grocery': [
      {
        id: 'g1',
        title: 'Organic Fresh Produce Bundle',
        price: 49.99,
        description: 'Fresh, organic produce bundle including seasonal vegetables and fruits.',
        category: 'grocery',
        image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c',
        rating: { rate: 4.5, count: 200 }
      },
      {
        id: 'g2',
        title: 'Gourmet Coffee Selection',
        price: 34.99,
        description: 'Premium coffee beans from various regions, carefully selected for coffee enthusiasts.',
        category: 'grocery',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
        rating: { rate: 4.7, count: 150 }
      },
      {
        id: 'g3',
        title: 'Artisan Bread Collection',
        price: 24.99,
        description: 'Freshly baked artisan bread collection featuring various types of bread.',
        category: 'grocery',
        image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec',
        rating: { rate: 4.6, count: 180 }
      }
    ],
    'beauty': [
      {
        id: 'b1',
        title: 'Luxury Skincare Set',
        price: 129.99,
        description: 'Complete luxury skincare set with cleanser, toner, serum, and moisturizer.',
        category: 'beauty',
        image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a',
        rating: { rate: 4.8, count: 220 }
      },
      {
        id: 'b2',
        title: 'Premium Makeup Collection',
        price: 89.99,
        description: 'High-end makeup collection featuring eyeshadows, lipsticks, and face products.',
        category: 'beauty',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
        rating: { rate: 4.6, count: 190 }
      },
      {
        id: 'b3',
        title: 'Natural Hair Care Bundle',
        price: 59.99,
        description: 'Natural and organic hair care products for all hair types.',
        category: 'beauty',
        image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f',
        rating: { rate: 4.7, count: 170 }
      }
    ],
    'books': [
      {
        id: 'bk1',
        title: 'Bestseller Fiction Collection',
        price: 79.99,
        description: 'Collection of top-rated fiction books from renowned authors.',
        category: 'books',
        image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090',
        rating: { rate: 4.9, count: 250 }
      },
      {
        id: 'bk2',
        title: 'Business & Leadership Bundle',
        price: 89.99,
        description: 'Essential business and leadership books for professional development.',
        category: 'books',
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646',
        rating: { rate: 4.7, count: 180 }
      },
      {
        id: 'bk3',
        title: 'Self-Development Collection',
        price: 69.99,
        description: 'Curated collection of self-help and personal development books.',
        category: 'books',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
        rating: { rate: 4.8, count: 210 }
      }
    ]
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error('Product ID is required');
        }

        // Try to fetch from our backend API
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (response.data) {
          const productData = {
            ...response.data,
            id: response.data.id || response.data._id // Use the id from the backend
          };
          setProduct(productData);
          
          // Get recommended products from the same category
          const recommendedResponse = await axios.get(`http://localhost:5000/api/products/category/${response.data.category}`);
          const filteredRecommended = recommendedResponse.data
            .filter((p: Product) => {
              const productId = p.id || p._id;
              const currentId = productData.id || productData._id;
              return productId?.toString() !== currentId?.toString();
            })
            .map((p: Product) => ({
              ...p,
              id: p.id || p._id // Ensure each recommended product has an id field
            }))
            .slice(0, 4);
          setRecommendedProducts(filteredRecommended);
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load product details';
        setError(errorMessage);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setSnackbarMessage('Please log in to add items to cart');
      setSnackbarOpen(true);
      return;
    }

    if (product) {
      console.log('Adding product to cart:', {  // Debug log
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      setSnackbarMessage('Product added to cart');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ p: 3 }}>
        <Container>
          <Alert severity="error">{error || 'Product not found'}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Grid container spacing={6}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ProductImage src={product.image} alt={product.title} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating.rate} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.rating.count} reviews)
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              ${product.price.toFixed(2)}
            </Typography>

            {product.stock !== undefined && (
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2,
                  color: product.stock > 0 ? 'success.main' : 'error.main'
                }}
              >
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </Typography>
            )}

            <Chip 
              label={product.category} 
              color="secondary" 
              sx={{ mb: 2 }}
            />

            {product.isFeatured && (
              <Chip 
                label="Featured Product" 
                color="primary" 
                sx={{ mb: 2, ml: 1 }}
              />
            )}

            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              {(product.stock ?? 0) > 0 && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  onClick={handleAddToCart}
                >
                  {isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
                </Button>
              )}
            </Box>

            {/* Size Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Select Size</Typography>
              <Box>
                {sizes.map((size) => (
                  <SizeButton
                    key={size}
                    variant="outlined"
                    className={selectedSize === size ? 'selected' : ''}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </SizeButton>
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <IconButton
                onClick={toggleWishlist}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                }}
              >
                {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Details" />
                <Tab label="Reviews" />
                <Tab label="Size & Fit" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="body1">{product.description}</Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="body1">
                Average Rating: {product.rating.rate}/5 ({product.rating.count} reviews)
              </Typography>
              {/* Add review list component here */}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1">
                Size Guide and Fit Details
                {/* Add size guide component here */}
              </Typography>
            </TabPanel>
          </Grid>
        </Grid>

        {/* Recommended Products */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
            Recommended Products
          </Typography>
          <Grid container spacing={4}>
            {recommendedProducts.map((recommendedProduct) => (
              <Grid item key={recommendedProduct.id || recommendedProduct._id} xs={12} sm={6} md={3}>
                <Box
                  onClick={() => navigate(`/product/${recommendedProduct.id || recommendedProduct._id}`)}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 2,
                    },
                  }}
                >
                  <img
                    src={recommendedProduct.image}
                    alt={recommendedProduct.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                      marginBottom: '16px',
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {recommendedProduct.title}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    ${recommendedProduct.price.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ProductDetailPage; 