import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, CardActions, Button, Rating, CircularProgress, Alert, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

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

const ShoesProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Since the API doesn't have a specific shoes category, we'll filter from all products
        const response = await axios.get('https://fakestoreapi.com/products');
        const shoesProducts = response.data.filter((product: Product) => 
          product.title.toLowerCase().includes('sneaker') || 
          product.title.toLowerCase().includes('shoe') ||
          product.category.toLowerCase().includes('shoes')
        );
        setProducts(shoesProducts.length > 0 ? shoesProducts : [
          {
            id: 'shoe1',
            title: 'Classic Running Sneakers',
            price: 89.99,
            rating: { rate: 4.5, count: 120 },
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            category: 'shoes'
          },
          {
            id: 'shoe2',
            title: 'Sport Training Shoes',
            price: 79.99,
            rating: { rate: 4.3, count: 95 },
            image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
            category: 'shoes'
          },
          {
            id: 'shoe3',
            title: 'Casual Walking Shoes',
            price: 69.99,
            rating: { rate: 4.7, count: 150 },
            image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
            category: 'shoes'
          },
          {
            id: 'shoe4',
            title: 'Lifestyle Sneakers',
            price: 99.99,
            rating: { rate: 4.6, count: 200 },
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
            category: 'shoes'
          },
          {
            id: 'shoe5',
            title: 'Premium Basketball Shoes',
            price: 129.99,
            rating: { rate: 4.8, count: 180 },
            image: 'https://images.unsplash.com/photo-1578116922645-3976907a7671',
            category: 'shoes'
          },
          {
            id: 'shoe6',
            title: 'Lightweight Running Shoes',
            price: 94.99,
            rating: { rate: 4.4, count: 165 },
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
            category: 'shoes'
          },
          {
            id: 'shoe7',
            title: 'Urban Street Sneakers',
            price: 84.99,
            rating: { rate: 4.5, count: 210 },
            image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
            category: 'shoes'
          },
          {
            id: 'shoe8',
            title: 'Hiking Trail Shoes',
            price: 119.99,
            rating: { rate: 4.7, count: 145 },
            image: 'https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4',
            category: 'shoes'
          },
          {
            id: 'shoe9',
            title: 'Fashion Canvas Sneakers',
            price: 59.99,
            rating: { rate: 4.3, count: 230 },
            image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77',
            category: 'shoes'
          },
          {
            id: 'shoe10',
            title: 'Professional Tennis Shoes',
            price: 109.99,
            rating: { rate: 4.6, count: 175 },
            image: 'https://images.unsplash.com/photo-1562183241-840b8af0721e',
            category: 'shoes'
          }
        ]);
      } catch (err) {
        setError('Failed to load shoes products. Please try again later.');
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
          Shoes Collection
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
              <ProductCard key={product.id}>
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
                      '&:hover': {
                        bgcolor: 'secondary.dark',
                      }
                    }}
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

export default ShoesProducts; 