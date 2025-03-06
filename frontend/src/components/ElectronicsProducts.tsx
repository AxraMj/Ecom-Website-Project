import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, CardActions, Button, Rating, CircularProgress, Alert, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
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
  category: string;
}

const ProductCard = styled(Card)(({ theme }) => ({
  width: '250px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  flexShrink: 0,
  margin: theme.spacing(0, 1),
  borderRadius: '8px',
  backgroundColor: '#fff',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  position: 'relative',
  padding: theme.spacing(1, 0),
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  zIndex: 2,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
}));

const ProductImage = styled(CardMedia)({
  paddingTop: '75%',
  backgroundSize: 'contain',
  backgroundColor: '#f5f5f5',
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

const ElectronicsProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/products/category/electronics');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load electronics products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress color="secondary" />
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
      py: 4,
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      pl: { xs: 2, md: 4 },
    }}>
      <Container maxWidth={false} disableGutters>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 700,
            textAlign: 'left',
            color: '#2C3E50',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '60px',
              height: '4px',
              backgroundColor: 'secondary.main',
              margin: '12px 0',
              borderRadius: '2px',
            },
          }}
        >
          Electronics
        </Typography>

        <Box sx={{ position: 'relative' }}>
          {showLeftArrow && (
            <ScrollButton
              onClick={() => scroll('left')}
              sx={{ left: 0 }}
              size="large"
            >
              <ChevronLeft />
            </ScrollButton>
          )}
          
          <ScrollContainer
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                sx={{
                  cursor: 'pointer',
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
                      lineHeight: 1.2,
                      height: '2.4em',
                      color: '#2C3E50',
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
                      sx={{ color: theme => theme.palette.secondary.main }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating.count})
                    </Typography>
                  </Box>
                  <ProductPrice>
                    ${product.price.toFixed(2)}
                  </ProductPrice>
                </CardContent>
                <CardActions>
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
            ))}
          </ScrollContainer>

          {showRightArrow && (
            <ScrollButton
              onClick={() => scroll('right')}
              sx={{ right: 0 }}
              size="large"
            >
              <ChevronRight />
            </ScrollButton>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ElectronicsProducts; 