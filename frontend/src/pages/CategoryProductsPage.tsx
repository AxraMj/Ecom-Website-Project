import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useMediaQuery,
  Chip,
  TypographyProps,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { FilterList as FilterIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface FilterState {
  priceRange: [number, number];
  minRating: number;
  sortBy: string;
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
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.02)',
    zIndex: 1,
  },
}));

const ProductContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  backgroundColor: '#fff',
}));

const ProductTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: '1rem',
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  height: '2.6em',
  marginBottom: '8px',
});

const ProductPrice = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 700,
  fontSize: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '"$"',
    fontSize: '0.8em',
    marginRight: '2px',
    opacity: 0.8,
  },
}));

const RatingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: 'auto',
}));

const FilterDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    padding: theme.spacing(2),
  },
}));

const CategoryProductsPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(!isMobile);
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    minRating: 0,
    sortBy: 'featured',
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const applyFilters = (products: Product[], currentFilters: FilterState) => {
    let filtered = [...products];

    // Apply price filter
    filtered = filtered.filter(
      product => 
        product.price >= currentFilters.priceRange[0] && 
        product.price <= currentFilters.priceRange[1]
    );

    // Apply rating filter
    filtered = filtered.filter(
      product => product.rating.rate >= currentFilters.minRating
    );

    // Apply sorting
    switch (currentFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'popularity':
        filtered.sort((a, b) => b.rating.count - a.rating.count);
        break;
      default:
        // 'featured' - no sorting needed
        break;
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchCategory = category?.toLowerCase().trim() || '';

        // Fallback products for categories not in the API
        const fallbackProducts: { [key: string]: Product[] } = {
          'furniture': [
            {
              id: 'f1',
              title: 'Modern Sofa Set',
              price: 899.99,
              category: 'furniture',
              image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
              rating: { rate: 4.8, count: 120 }
            },
            {
              id: 'f2',
              title: 'Dining Table Set',
              price: 649.99,
              category: 'furniture',
              image: 'https://images.unsplash.com/photo-1617104662896-5090099d799d',
              rating: { rate: 4.6, count: 95 }
            },
            {
              id: 'f3',
              title: 'Queen Size Bed Frame',
              price: 499.99,
              category: 'furniture',
              image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
              rating: { rate: 4.7, count: 150 }
            },
            {
              id: 'f4',
              title: 'Kitchen Cabinet Set',
              price: 1299.99,
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
              category: 'grocery',
              image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c',
              rating: { rate: 4.5, count: 200 }
            },
            {
              id: 'g2',
              title: 'Gourmet Coffee Selection',
              price: 34.99,
              category: 'grocery',
              image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
              rating: { rate: 4.7, count: 150 }
            },
            {
              id: 'g3',
              title: 'Artisan Bread Collection',
              price: 24.99,
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
              category: 'beauty',
              image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a',
              rating: { rate: 4.8, count: 220 }
            },
            {
              id: 'b2',
              title: 'Premium Makeup Collection',
              price: 89.99,
              category: 'beauty',
              image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
              rating: { rate: 4.6, count: 190 }
            },
            {
              id: 'b3',
              title: 'Natural Hair Care Bundle',
              price: 59.99,
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
              category: 'books',
              image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090',
              rating: { rate: 4.9, count: 250 }
            },
            {
              id: 'bk2',
              title: 'Business & Leadership Bundle',
              price: 89.99,
              category: 'books',
              image: 'https://images.unsplash.com/photo-1589998059171-988d887df646',
              rating: { rate: 4.7, count: 180 }
            },
            {
              id: 'bk3',
              title: 'Self-Development Collection',
              price: 69.99,
              category: 'books',
              image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
              rating: { rate: 4.8, count: 210 }
            }
          ]
        };

        // Check if we have fallback products for this category
        if (fallbackProducts[searchCategory]) {
          setProducts(fallbackProducts[searchCategory]);
          const prices = fallbackProducts[searchCategory].map(p => p.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
          setFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
          applyFilters(fallbackProducts[searchCategory], { ...filters, priceRange: [minPrice, maxPrice] });
          return;
        }

        // If no fallback products, try the API
        const response = await axios.get('https://fakestoreapi.com/products');
        const categoryAliases: { [key: string]: string[] } = {
          'electronics': ['electronics', 'gadget', 'device', 'tech', 'digital'],
          'fashion': ['clothing', 'fashion', 'apparel', "men's clothing", "women's clothing"],
          'jewelry': ['jewelry', 'accessories', 'jewellery'],
        };

        const filteredProducts = response.data.filter((product: Product) => {
          const productCategory = product.category.toLowerCase().trim();
          const productTitle = product.title.toLowerCase().trim();

          // Check if the product category directly matches the search category
          if (productCategory === searchCategory) {
            return true;
          }

          // Check if the search category matches any of our defined categories
          for (const [mainCategory, aliases] of Object.entries(categoryAliases)) {
            if (searchCategory === mainCategory || aliases.some(alias => searchCategory.includes(alias))) {
              return aliases.some(alias => 
                productCategory.includes(alias) || 
                productTitle.includes(alias)
              );
            }
          }

          // Fallback to partial matches
          return productCategory.includes(searchCategory) || 
                 searchCategory.includes(productCategory) ||
                 productTitle.includes(searchCategory) ||
                 productCategory.split(' ').some(word => searchCategory.includes(word)) ||
                 searchCategory.split(' ').some(word => productCategory.includes(word));
        });

        if (filteredProducts.length === 0) {
          setError(`No products found in "${category}" category. Try browsing a different category.`);
        } else {
          setProducts(filteredProducts);
          const prices = filteredProducts.map((p: Product) => p.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
          setFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
          applyFilters(filteredProducts, { ...filters, priceRange: [minPrice, maxPrice] });
        }
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleFilterChange = (type: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    applyFilters(products, newFilters);
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    handleFilterChange('priceRange', newValue as [number, number]);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  };

  const FilterContent = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Filters</Typography>
        {isMobile && (
          <IconButton onClick={toggleFilterDrawer}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Sort By */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sort By"
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="popularity">Most Popular</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={priceRange[0]}
          max={priceRange[1]}
          sx={{ color: 'secondary.main' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">${filters.priceRange[0]}</Typography>
          <Typography variant="body2">${filters.priceRange[1]}</Typography>
        </Box>
      </Box>

      {/* Rating Filter */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          Minimum Rating
        </Typography>
        <Rating
          value={filters.minRating}
          onChange={(event, newValue) => {
            handleFilterChange('minRating', newValue || 0);
          }}
          precision={0.5}
          sx={{ color: 'secondary.main' }}
        />
      </Box>
    </Box>
  );

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
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link
          color="inherit"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Home
        </Link>
        <Typography color="text.primary" sx={{ textTransform: 'capitalize' }}>
          {category}
        </Typography>
      </Breadcrumbs>

      {/* Header with Title and Filter Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            textTransform: 'capitalize',
          }}
        >
          {category} Products
        </Typography>
        {isMobile && (
          <Button
            startIcon={<FilterIcon />}
            onClick={toggleFilterDrawer}
            variant="outlined"
            color="secondary"
          >
            Filters
          </Button>
        )}
      </Box>

      {/* Active Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {filters.minRating > 0 && (
          <Chip 
            label={`${filters.minRating}+ Stars`}
            onDelete={() => handleFilterChange('minRating', 0)}
            color="secondary"
          />
        )}
        {(filters.priceRange[0] > priceRange[0] || filters.priceRange[1] < priceRange[1]) && (
          <Chip 
            label={`$${filters.priceRange[0]} - $${filters.priceRange[1]}`}
            onDelete={() => handleFilterChange('priceRange', priceRange)}
            color="secondary"
          />
        )}
        {filters.sortBy !== 'featured' && (
          <Chip 
            label={`Sorted by: ${filters.sortBy.replace('-', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}`}
            onDelete={() => handleFilterChange('sortBy', 'featured')}
            color="secondary"
          />
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Filter Drawer - Desktop */}
        {!isMobile && (
          <Box sx={{ width: 280, flexShrink: 0 }}>
            <FilterContent />
          </Box>
        )}

        {/* Filter Drawer - Mobile */}
        {isMobile && (
          <FilterDrawer
            anchor="right"
            open={isFilterDrawerOpen}
            onClose={toggleFilterDrawer}
          >
            <FilterContent />
          </FilterDrawer>
        )}

        {/* Products Grid */}
        <Grid container spacing={3} flex={1}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard onClick={() => handleProductClick(product.id)}>
                <ProductImage
                  image={product.image}
                  title={product.title}
                />
                <ProductContent>
                  <ProductTitle variant="h6">
                    {product.title}
                  </ProductTitle>
                  <RatingContainer>
                    <Rating
                      value={product.rating.rate}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{ color: theme => theme.palette.secondary.main }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      ({product.rating.count})
                    </Typography>
                  </RatingContainer>
                  <ProductPrice>
                    {product.price.toFixed(2)}
                  </ProductPrice>
                </ProductContent>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CategoryProductsPage; 