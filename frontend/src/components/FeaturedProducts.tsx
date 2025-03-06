import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, CardActions, Button, Rating, Grid, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: string;
  title: string;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
  image: string;
}

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: '12px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
}));

const ProductImage = styled(CardMedia)({
  paddingTop: '100%',
  backgroundSize: 'contain',
  backgroundColor: '#f8f9fa',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const ProductPrice = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '1.25rem',
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '300px',
});

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/featured-products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load featured products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress color="primary" />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 6,
      backgroundColor: '#f8f9fa',
      position: 'relative',
      width: '100%',
    }}>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 4,
            fontWeight: 800,
            color: '#1a1a1a',
            position: 'relative',
            pl: { xs: 2, md: 4 },
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #1a1a1a 0%, #666 100%)',
              margin: '16px 0',
              borderRadius: '2px',
            },
          }}
        >
          Featured Products
        </Typography>

        <Grid container spacing={3} sx={{ px: { xs: 2, md: 4 } }}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard
                onClick={() => handleProductClick(product.id)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <ProductImage
                  image={product.image}
                  title={product.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h3" 
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.3,
                      height: '2.6em',
                      color: '#1a1a1a',
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    {product.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={product.rating.rate} 
                      precision={0.1} 
                      readOnly 
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating.count})
                    </Typography>
                  </Box>
                  <ProductPrice>
                    ${product.price.toFixed(2)}
                  </ProductPrice>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      bgcolor: 'secondary.main',
                      borderRadius: '4px',
                      textTransform: 'none',
                      fontWeight: 600,
                      padding: '10px',
                      fontSize: '0.95rem',
                      '&:hover': {
                        bgcolor: 'secondary.dark',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }
                    }}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedProducts; 