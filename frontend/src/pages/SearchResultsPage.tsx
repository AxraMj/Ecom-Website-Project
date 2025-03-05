import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ProductImage = styled(CardMedia)({
  paddingTop: '100%',
  backgroundSize: 'contain',
  backgroundColor: '#f5f5f5',
});

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  const category = location.pathname.split('/category/')[1]?.split('?')[0];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all products
        const response = await axios.get('https://fakestoreapi.com/products');
        let filteredProducts = response.data;

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter((product: Product) =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
          );
        }

        // Filter by category if specified
        if (category) {
          filteredProducts = filteredProducts.filter((product: Product) =>
            product.category.toLowerCase().includes(category.toLowerCase())
          );
        }

        // If no products found in API, add fallback products
        if (filteredProducts.length === 0) {
          filteredProducts = [
            {
              id: 'f1',
              title: 'Premium Wireless Headphones',
              price: 199.99,
              description: 'High-quality wireless headphones with noise cancellation',
              category: 'electronics',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
              rating: { rate: 4.8, count: 250 }
            },
            // Add more fallback products as needed
          ];
        }

        setProducts(filteredProducts);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, category]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Container>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Results
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {products.length} results for "{searchQuery}"
          {category && <Chip 
            label={category.charAt(0).toUpperCase() + category.slice(1)} 
            sx={{ ml: 2 }}
            color="secondary"
          />}
        </Typography>
      </Box>

      {products.length === 0 ? (
        <Alert severity="info">
          No products found matching your search criteria.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard onClick={() => handleProductClick(product.id)}>
                <ProductImage
                  image={product.image}
                  title={product.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      height: '3em',
                      lineHeight: '1.5em',
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
                  <Typography variant="h6" color="secondary" sx={{ fontWeight: 600 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResultsPage; 