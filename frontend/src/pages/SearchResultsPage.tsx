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
import { useCart } from '../contexts/CartContext';

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
  createdAt?: string;
  updatedAt?: string;
}

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  minRating: number;
  sortBy: string;
  inStock: boolean;
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
  const { addToCart } = useCart();
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    categories: [],
    minRating: 0,
    sortBy: 'relevance',
    inStock: false
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('q') || '';
        
        // Fetch products from our backend API
        const response = await axios.get(`http://localhost:5000/api/products`, {
          params: {
            q: query,
            category: filters.categories.join(','),
            minPrice: filters.priceRange[0],
            maxPrice: filters.priceRange[1],
            minRating: filters.minRating,
            sortBy: filters.sortBy
          }
        });

        const fetchedProducts = response.data;
        setProducts(fetchedProducts);
        
        // Set available categories and max price for filters
        const categories = Array.from(new Set(fetchedProducts.map((p: Product) => p.category))) as string[];
        setAvailableCategories(categories);
        
        const maxProductPrice = Math.max(...fetchedProducts.map((p: Product) => p.price));
        setMaxPrice(maxProductPrice);

        // Apply initial filters
        applyFilters(fetchedProducts, filters);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search, filters]);

  const applyFilters = (productsToFilter: Product[], currentFilters: FilterState) => {
    let filtered = [...productsToFilter];

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= currentFilters.priceRange[0] && 
      product.price <= currentFilters.priceRange[1]
    );

    // Apply category filter
    if (currentFilters.categories.length > 0) {
      filtered = filtered.filter(product =>
        currentFilters.categories.includes(product.category)
      );
    }

    // Apply rating filter
    if (currentFilters.minRating > 0) {
      filtered = filtered.filter(product =>
        product.rating.rate >= currentFilters.minRating
      );
    }

    // Apply stock filter
    if (currentFilters.inStock) {
      filtered = filtered.filter(product => (product.stock ?? 0) > 0);
    }

    // Apply sorting
    switch (currentFilters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      default:
        // Default sorting by relevance (handled by backend)
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart({
      id: product._id || product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Found {filteredProducts.length} products
      </Typography>

      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item key={product._id || product.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  transition: 'all 0.3s ease',
                },
              }}
              onClick={() => handleProductClick(product._id || product.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.title}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3" noWrap>
                  {product.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.rating.rate} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.rating.count})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${product.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={(e) => handleAddToCart(e, product)}
                  sx={{ mt: 2 }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchResultsPage; 