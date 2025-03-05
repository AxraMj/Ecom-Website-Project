import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid',
  borderColor: 'rgba(0, 0, 0, 0.08)',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: '#fff',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
  },
  cursor: 'pointer',
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  paddingTop: '100%',
  backgroundSize: 'contain',
  backgroundColor: '#f8f9fa',
  transition: 'transform 0.3s ease-in-out',
  position: 'relative',
}));

const DiscountBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: theme.palette.error.main,
  color: 'white',
  fontWeight: 'bold',
  zIndex: 1,
}));

const ProductContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(1),
}));

const TodaysDealsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products from API and add discount information
        const response = await axios.get('https://fakestoreapi.com/products');
        const dealsProducts = response.data.map((product: any) => ({
          ...product,
          originalPrice: product.price,
          // Generate random discount between 10% and 50%
          discountPercentage: Math.floor(Math.random() * 41) + 10,
          price: +(product.price * (1 - (Math.floor(Math.random() * 41) + 10) / 100)).toFixed(2),
        }));

        // Add some custom deals products
        const customDeals = [
          {
            id: 'deal1',
            title: 'Premium Wireless Headphones',
            originalPrice: 299.99,
            discountPercentage: 40,
            price: 179.99,
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            rating: { rate: 4.8, count: 320 }
          },
          {
            id: 'deal2',
            title: 'Smart Home Security Bundle',
            originalPrice: 499.99,
            discountPercentage: 35,
            price: 324.99,
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827',
            rating: { rate: 4.7, count: 180 }
          },
          {
            id: 'deal3',
            title: 'Luxury Watch Collection',
            originalPrice: 899.99,
            discountPercentage: 45,
            price: 494.99,
            category: 'accessories',
            image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
            rating: { rate: 4.9, count: 250 }
          }
        ];

        setProducts([...customDeals, ...dealsProducts]);
      } catch (err) {
        setError('Failed to load deals. Please try again later.');
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Container>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(45deg, #2E7D32 30%, #1B5E20 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Today's Deals
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Incredible savings on amazing products
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard onClick={() => handleProductClick(product.id)}>
              <Box sx={{ position: 'relative' }}>
                <ProductImage
                  image={product.image}
                  title={product.title}
                />
                <DiscountBadge 
                  label={`-${product.discountPercentage}%`}
                />
              </Box>
              <ProductContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    height: '2.4em',
                  }}
                >
                  {product.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.rating.rate} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                    ({product.rating.count})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <OriginalPrice variant="body1">
                    ${product.originalPrice.toFixed(2)}
                  </OriginalPrice>
                  <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>
                <Chip
                  label="Limited Time Offer"
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                    fontWeight: 600,
                    width: 'fit-content',
                  }}
                />
              </ProductContent>
            </ProductCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TodaysDealsPage; 