import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  InputBase,
  Box,
  Menu,
  MenuItem,
  styled,
  Stack,
  Select,
  Paper,
  ClickAwayListener,
  Popper,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Smartphone as ElectronicsIcon,
  CheckroomOutlined as FashionIcon,
  Weekend as FurnitureIcon,
  LocalGroceryStore as GroceryIcon,
  SportsEsports as GamingIcon,
  Favorite as BeautyIcon,
  LibraryBooks as BooksIcon,
  CardGiftcard as DealsIcon,
  Delete as DeleteIcon,
  Remove,
  Add,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import AuthDialog from './auth/AuthDialog';
import { useCart } from '../contexts/CartContext';

const Search = styled('form')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  display: 'flex',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  '&:hover': {
    backgroundColor: '#f8f8f8',
  },
  border: '1px solid #ddd',
  '&:focus-within': {
    border: '1px solid',
    borderColor: theme.palette.secondary.main,
  },
}));

const CategorySelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#f3f3f3',
  borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
  borderRight: '1px solid #ddd',
  '& .MuiSelect-select': {
    padding: '8px 32px 8px 12px',
    fontSize: '0.875rem',
    color: '#555',
    minWidth: '120px',
  },
  '&:hover': {
    backgroundColor: '#e9e9e9',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  backgroundColor: theme.palette.secondary.main,
  borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 5, 1, 2),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textAlign: 'left',
  padding: theme.spacing(0.5, 1),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiTypography-root': {
    textAlign: 'left',
    width: '100%',
  },
  minWidth: 'auto',
  textTransform: 'none',
})) as typeof Button;

const CategoryButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textTransform: 'none',
  padding: theme.spacing(0.5, 2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
})) as typeof Button;

const StyledLink = styled(RouterLink)({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
});

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginRight: theme.spacing(2),
  '& span': {
    color: theme.palette.secondary.main,
  },
}));

interface SearchSuggestion {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
}

const SuggestionsPopper = styled(Popper)(({ theme }) => ({
  zIndex: theme.zIndex.appBar + 1,
  width: '100%',
  maxWidth: 800,
  marginTop: '4px',
}));

const SuggestionsPaper = styled(Paper)(({ theme }) => ({
  maxHeight: '400px',
  overflowY: 'auto',
  boxShadow: theme.shadows[3],
}));

const SuggestionItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SuggestionImage = styled('img')({
  width: '40px',
  height: '40px',
  objectFit: 'contain',
  marginRight: '12px',
});

const CartMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: '400px',
    maxHeight: '80vh',
  },
}));

const CartItemWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const CartItemImage = styled('img')({
  width: '60px',
  height: '60px',
  objectFit: 'contain',
  marginRight: '16px',
});

const CartItemDetails = styled(Box)({
  flex: 1,
});

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      if (searchCategory === 'all') {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/category/${searchCategory}?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      const products = response.data;
      const filtered = products
        .filter((product: SearchSuggestion) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6);

      if (filtered.length === 0 && query.length > 2) {
        filtered.push({
          id: 'f1',
          title: `${query} - Premium Headphones`,
          category: 'electronics',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          price: 199.99,
        });
      }

      setSuggestions(filtered);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    setSearchTimeout(timeout);
  };

  const handleSuggestionClick = (productId: string) => {
    setShowSuggestions(false);
    navigate(`/product/${productId}`);
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  const categories = [
    { name: 'Electronics', icon: <ElectronicsIcon />, path: '/category/electronics' },
    { name: 'Fashion', icon: <FashionIcon />, path: '/category/fashion' },
    { name: 'Home & Furniture', icon: <FurnitureIcon />, path: '/category/furniture' },
    { name: 'Grocery', icon: <GroceryIcon />, path: '/category/grocery' },
    { name: 'Gaming', icon: <GamingIcon />, path: '/category/gaming' },
    { name: 'Beauty', icon: <BeautyIcon />, path: '/category/beauty' },
    { name: 'Books', icon: <BooksIcon />, path: '/category/books' },
    { name: "Today's Deals", icon: <DealsIcon />, path: '/deals' },
  ];

  const searchCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'furniture', label: 'Home & Furniture' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'books', label: 'Books' },
  ];

  const handleCartClick = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      navigate('/cart');
    }
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isAuthenticated ? (
        <>
          <MenuItem onClick={() => {
            navigate('/profile');
            handleMenuClose();
          }}>Profile</MenuItem>
          <MenuItem onClick={() => {
            navigate('/orders');
            handleMenuClose();
          }}>My Orders</MenuItem>
          <MenuItem onClick={() => {
            navigate('/wishlist');
            handleMenuClose();
          }}>Wishlist</MenuItem>
          <MenuItem onClick={() => {
            logout();
            handleMenuClose();
          }}>Logout</MenuItem>
        </>
      ) : (
        <MenuItem onClick={() => {
          setAuthDialogOpen(true);
          handleMenuClose();
        }}>Login/Register</MenuItem>
      )}
    </Menu>
  );

  const renderCartMenu = (
    <CartMenu
      anchorEl={cartAnchorEl}
      open={Boolean(cartAnchorEl)}
      onClose={handleCartClose}
    >
      {items.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography>Your cart is empty</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            {items.map((item) => (
              <CartItemWrapper key={item.id}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CartItemImage src={item.image} alt={item.title} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" noWrap>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => removeFromCart(item.id)}
                        sx={{ ml: 'auto' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </CartItemWrapper>
            ))}
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Total: ${totalPrice.toFixed(2)}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => {
                handleCartClose();
                navigate('/checkout');
              }}
            >
              Checkout
            </Button>
          </Box>
        </>
      )}
    </CartMenu>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ minHeight: '60px !important' }}>
          {/* Logo */}
          <StyledLink to="/">
            <LogoText variant="h6" noWrap>
              shope<span>Hub</span>.com
            </LogoText>
          </StyledLink>

          {/* Deliver To */}
          <NavButton startIcon={<LocationIcon />}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Deliver to
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Select Location
              </Typography>
            </Box>
          </NavButton>

          {/* Search Bar */}
          <Search
            ref={searchRef}
            onSubmit={handleSearchSubmit}
            sx={{ flexGrow: 1, maxWidth: 800, display: 'flex', position: 'relative' }}
          >
            <CategorySelect
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value as string)}
              variant="outlined"
              size="small"
            >
              {searchCategories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </CategorySelect>
            <StyledInputBase
              placeholder="Search products…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => setShowSuggestions(true)}
              sx={{ flex: 1 }}
            />
            <SearchIconWrapper onClick={handleSearchSubmit}>
              <SearchIcon />
            </SearchIconWrapper>

            {/* Search Suggestions */}
            <ClickAwayListener onClickAway={handleClickAway}>
              <SuggestionsPopper
                open={showSuggestions && suggestions.length > 0}
                anchorEl={searchRef.current}
                placement="bottom-start"
              >
                <SuggestionsPaper>
                  {suggestions.map((suggestion) => (
                    <SuggestionItem
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion.id)}
                    >
                      <SuggestionImage src={suggestion.image} alt={suggestion.title} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" noWrap>
                          {suggestion.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          in {suggestion.category}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        color="secondary" 
                        sx={{ fontWeight: 600, ml: 2 }}
                      >
                        ${suggestion.price?.toFixed(2)}
                      </Typography>
                    </SuggestionItem>
                  ))}
                </SuggestionsPaper>
              </SuggestionsPopper>
            </ClickAwayListener>
          </Search>

          {/* Right Navigation */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <NavButton onClick={handleProfileMenuOpen}>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {isAuthenticated ? `Hello, ${user?.name}` : 'Hello, Sign in'}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Account & Lists
                </Typography>
              </Box>
            </NavButton>

            <NavButton>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Returns
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  & Orders
                </Typography>
              </Box>
            </NavButton>

            <NavButton
              component={RouterLink}
              to="/cart"
              startIcon={
                <Badge badgeContent={items.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              }
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Cart
              </Typography>
            </NavButton>
          </Stack>
        </Toolbar>

        {/* Category Navigation */}
        <Toolbar
          sx={{
            bgcolor: 'primary.light',
            minHeight: '39px !important',
            px: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Stack 
            direction="row" 
            spacing={1}
            sx={{
              '& > *': {
                flex: 'none',
              }
            }}
          >
            {categories.map((category) => (
              <CategoryButton
                key={category.name}
                component={RouterLink}
                to={category.path}
                startIcon={category.icon}
              >
                {category.name}
              </CategoryButton>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      {renderMenu}
      <AuthDialog 
        open={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />

      {renderCartMenu}
    </>
  );
};

export default Header; 