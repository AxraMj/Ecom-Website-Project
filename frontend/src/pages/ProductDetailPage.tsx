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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import axios from 'axios';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
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

        // Check if the product ID matches any fallback product
        let foundProduct: Product | null = null;
        let allFallbackProducts: Product[] = [];

        // Search through all fallback products
        Object.values(fallbackProducts).forEach(categoryProducts => {
          categoryProducts.forEach(product => {
            allFallbackProducts.push(product);
            if (product.id === id) {
              foundProduct = product;
            }
          });
        });

        if (foundProduct) {
          setProduct(foundProduct);
          // Get recommended products from the same category
          const sameCategory = allFallbackProducts.filter(p => 
            p.id !== foundProduct!.id && 
            p.category === foundProduct!.category
          );
          // If not enough products in same category, add some from other categories
          const otherProducts = allFallbackProducts.filter(p => 
            p.id !== foundProduct!.id && 
            p.category !== foundProduct!.category
          );
          const recommended = [...sameCategory, ...otherProducts].slice(0, 4);
          setRecommendedProducts(recommended);
        } else {
          // If not a fallback product, try the API
          const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
          setProduct(response.data);

          // Fetch recommended products from the API
          const recommendedResponse = await axios.get('https://fakestoreapi.com/products');
          const filtered = recommendedResponse.data
            .filter((p: Product) => 
              p.id !== response.data.id && 
              p.category.toLowerCase() === response.data.category.toLowerCase()
            )
            .slice(0, 4);
          
          setRecommendedProducts(filtered);
        }
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <ProductImage src={product.image} alt={product.title} />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={product.category} 
              sx={{ 
                mb: 2,
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                fontWeight: 600
              }} 
            />
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
              {product.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating.rate} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                ({product.rating.count} reviews)
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 600, mb: 3 }}>
              ${product.price.toFixed(2)}
            </Typography>
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
            <Button
              variant="contained"
              size="large"
              sx={{
                flex: 1,
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' },
                py: 1.5,
              }}
            >
              Add to Cart
            </Button>
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
            <Grid item key={recommendedProduct.id} xs={12} sm={6} md={3}>
              <Box
                onClick={() => navigate(`/product/${recommendedProduct.id}`)}
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
    </Container>
  );
};

export default ProductDetailPage; 