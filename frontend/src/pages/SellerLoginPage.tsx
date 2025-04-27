import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Link,
  Tabs,
  Tab,
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const SellerLoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use the context's login function which will update user state and return the role
      const userRole = await login(email, password);
      
      if (userRole !== 'seller') {
        // Not a seller, show error
        setError('This account does not have seller privileges. Please request seller status from your profile page.');
        localStorage.removeItem('userToken');
        setLoading(false);
        return;
      }
      
      // Is a seller, navigate to dashboard
      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!name || !email || !password || !storeName) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // First register as a regular user if not already registered
      let userRole = null;
      try {
        userRole = await login(email, password);
      } catch {
        // If login fails, try to register
        await axios.post('http://localhost:5000/api/auth/register', {
          name,
          email,
          password
        });
        
        // Login after registration
        userRole = await login(email, password);
      }

      // Now request seller status
      const token = localStorage.getItem('userToken');
      console.log('Attempting to become a seller with token:', token ? 'Token exists' : 'No token');
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/become-seller',
          {
            storeName,
            storeDescription
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('Become seller response:', response.data);
        
        setSuccess('Your seller account has been created! You will be redirected to your dashboard.');
        
        // Give user time to see the success message then redirect
        setTimeout(() => {
          navigate('/seller/dashboard');
        }, 2000);
      } catch (error: any) {
        console.error('Become seller error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setError(error.response?.data?.message || 'Failed to create seller account');
      }
    } catch (err: any) {
      console.error('Error creating seller account:', err);
      setError(err.response?.data?.message || 'Failed to create seller account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Seller Portal
          </Typography>
          
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Become a Seller" />
          </Tabs>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {activeTab === 0 ? (
            // Login Form
            <Box component="form" onSubmit={handleLoginSubmit}>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Access your seller dashboard to manage products and submissions
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In as Seller'}
              </Button>
            </Box>
          ) : (
            // Signup Form
            <Box component="form" onSubmit={handleSignupSubmit}>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Register as a seller to start selling products on our platform
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Account Information</Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Store Information</Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="storeName"
                label="Store Name"
                name="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
              <TextField
                margin="normal"
                fullWidth
                id="storeDescription"
                label="Store Description"
                name="storeDescription"
                multiline
                rows={3}
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Register as Seller'}
              </Button>
            </Box>
          )}
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              {activeTab === 0 ? "Don't have a seller account? " : "Already have a seller account? "}
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
              >
                {activeTab === 0 ? "Register here" : "Login here"}
              </Link>
            </Typography>
          </Box>
          
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="body2">
              <Link component={RouterLink} to="/" variant="body2">
                Return to main site
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SellerLoginPage; 