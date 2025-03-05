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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(response.data);

        // Fetch recommended products from the same category
        const recommendedResponse = await axios.get('https://fakestoreapi.com/products');
        const filtered = recommendedResponse.data
          .filter((p: Product) => 
            p.id !== response.data.id && 
            p.category.toLowerCase() === response.data.category.toLowerCase()
          )
          .slice(0, 4);
        
        // If not enough products in the same category, add products from similar categories
        if (filtered.length < 4) {
          const currentCategory = response.data.category.toLowerCase();
          const similarCategories = new Set<string>();
          
          // Define similar category mappings
          if (currentCategory.includes('electronics')) {
            similarCategories.add('electronics');
            similarCategories.add('gadgets');
          } else if (currentCategory.includes('clothing') || currentCategory.includes('shoes')) {
            similarCategories.add('clothing');
            similarCategories.add('shoes');
            similarCategories.add('accessories');
          } else if (currentCategory.includes('kitchen') || currentCategory.includes('furniture')) {
            similarCategories.add('kitchen');
            similarCategories.add('furniture');
            similarCategories.add('home');
          }

          const additionalProducts = recommendedResponse.data
            .filter((p: Product) => 
              p.id !== response.data.id && 
              !filtered.find((f: Product) => f.id === p.id) &&
              Array.from(similarCategories).some(cat => 
                p.category.toLowerCase().includes(cat) || 
                p.title.toLowerCase().includes(cat)
              )
            )
            .slice(0, 4 - filtered.length);

          setRecommendedProducts([...filtered, ...additionalProducts]);
        } else {
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