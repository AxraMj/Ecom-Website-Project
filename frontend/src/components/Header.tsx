import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  '&:hover': {
    backgroundColor: '#f8f8f8',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.secondary.main,
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
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
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

const StyledLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginRight: theme.spacing(2),
  '& span': {
    color: theme.palette.secondary.main,
  },
}));

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
          <Search sx={{ flexGrow: 1, maxWidth: 800 }}>
            <StyledInputBase
              placeholder="Search products…"
              inputProps={{ 'aria-label': 'search' }}
            />
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
          </Search>

          {/* Right Navigation */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <NavButton onClick={handleProfileMenuOpen}>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Hello, Sign in
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
                <Badge badgeContent={0} color="secondary">
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

      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} component={RouterLink} to="/login">
          Login
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={RouterLink} to="/register">
          Register
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
          Profile
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header; 