import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Alert } from '@mui/material';
import SellerSidebar from '../components/seller/SellerSidebar';
import { useAuth } from '../contexts/AuthContext';
import SellerOverview from '../components/seller/SellerOverview';
import MySubmissions from '../components/seller/MySubmissions';
import SubmitProductForm from '../components/seller/SubmitProductForm';
import ProductManagement from '../pages/seller/ProductManagement';

const SellerDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is a seller
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'seller') {
      // Not a seller, redirect to profile page
      navigate('/profile');
    }
  }, [user, isAuthenticated, navigate]);

  // Determine which component to render based on the current path
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/seller/submissions') {
      return <MySubmissions />;
    } else if (path === '/seller/products/new') {
      return <SubmitProductForm />;
    } else if (path === '/seller/products') {
      return <ProductManagement />;
    } else {
      // Default to overview
      return <SellerOverview />;
    }
  };

  if (!isAuthenticated) {
    return null; // Let ProtectedRoute handle the redirect
  }

  if (user && user.role !== 'seller') {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          You do not have seller privileges. Please request seller status from your profile page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Seller Dashboard
      </Typography>
      
      <Box sx={{ display: 'flex' }}>
        <SellerSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {renderContent()}
        </Box>
      </Box>
    </Container>
  );
};

export default SellerDashboardPage; 