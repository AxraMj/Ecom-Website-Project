import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, CardActions, Button, Rating, Grid, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

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
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const ProductImage = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9
  position: 'relative',
});

const PriceTypography = styled(Typography)({
  fontWeight: 'bold',
  color: '#2e7d32',
});

const Gadgets: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('https://fakestoreapi.com/products');
        const gadgetProducts = response.data.filter((product: Product) =>
          product.category.toLowerCase().includes('electronics') ||
          product.title.toLowerCase().includes('gadget') ||
          product.title.toLowerCase().includes('smart') ||
          product.title.toLowerCase().includes('device') ||
          product.title.toLowerCase().includes('watch')
        );
        setProducts(gadgetProducts.length > 0 ? gadgetProducts : [
          {
            id: 'g1',
            title: 'Smart Home Security Camera',
            price: 129.99,
            rating: { rate: 4.8, count: 156 },
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827',
            category: 'electronics'
          },
          {
            id: 'g2',
            title: 'Wireless Noise-Canceling Earbuds',
            price: 199.99,
            rating: { rate: 4.7, count: 189 },
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
            category: 'electronics'
          },
          {
            id: 'w1',
            title: 'Premium Smartwatch with Health Tracking',
            price: 299.99,
            rating: { rate: 4.9, count: 245 },
            image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d',
            category: 'electronics'
          },
          {
            id: 'w2',
            title: 'Luxury Automatic Watch - Gold Edition',
            price: 599.99,
            rating: { rate: 4.8, count: 178 },
            image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa',
            category: 'watches'
          },
          {
            id: 'w3',
            title: 'Sports Smartwatch with GPS',
            price: 199.99,
            rating: { rate: 4.7, count: 212 },
            image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf',
            category: 'electronics'
          },
          {
            id: 'w4',
            title: 'Classic Leather Strap Watch',
            price: 149.99,
            rating: { rate: 4.6, count: 167 },
            image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0',
            category: 'watches'
          },
          {
            id: 'w5',
            title: 'Kids Smart Watch with Tracking',
            price: 79.99,
            rating: { rate: 4.5, count: 143 },
            image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250',
            category: 'electronics'
          },
          {
            id: 'g8',
            title: 'Mini Drone with HD Camera',
            price: 299.99,
            rating: { rate: 4.8, count: 198 },
            image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31',
            category: 'electronics'
          },
          {
            id: 'w6',
            title: 'Minimalist Steel Watch - Silver',
            price: 179.99,
            rating: { rate: 4.6, count: 156 },
            image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3',
            category: 'watches'
          },
          {
            id: 'w7',
            title: 'Fitness Tracking Smart Watch',
            price: 159.99,
            rating: { rate: 4.7, count: 189 },
            image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a',
            category: 'electronics'
          },
          {
            id: 'w8',
            title: 'Luxury Chronograph Watch',
            price: 449.99,
            rating: { rate: 4.9, count: 134 },
            image: 'https://images.unsplash.com/photo-1623998022290-a74f8cc36563',
            category: 'watches'
          },
          {
            id: 'g6',
            title: 'Bluetooth Speaker with RGB Lights',
            price: 79.99,
            rating: { rate: 4.6, count: 167 },
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
            category: 'electronics'
          }
        ]);
      } catch (err) {
        setError('Failed to load gadget products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Alert severity="error">{error}</Alert>
        </Container>
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
          Cool Gadgets
        </Typography>

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard>
                <ProductImage
                  image={product.image}
                  title={product.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating.rate} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating.count})
                    </Typography>
                  </Box>
                  <PriceTypography variant="h6">
                    ${product.price.toFixed(2)}
                  </PriceTypography>
                </CardContent>
                <CardActions sx={{ mt: 'auto' }}>
                  <Button 
                    size="large" 
                    sx={{ 
                      width: '100%',
                      bgcolor: '#2e7d32',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#1b5e20',
                      },
                    }}
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

export default Gadgets; 