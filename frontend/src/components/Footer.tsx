import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Link
              component={RouterLink}
              to="/about"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              About
            </Link>
            <Link
              component={RouterLink}
              to="/careers"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Careers
            </Link>
            <Link
              component={RouterLink}
              to="/press"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Press
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Link
              component={RouterLink}
              to="/help"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Help Center
            </Link>
            <Link
              component={RouterLink}
              to="/returns"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Returns
            </Link>
            <Link
              component={RouterLink}
              to="/shipping"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Shipping Info
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Link
              href="https://facebook.com"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </Link>
            <Link
              href="https://twitter.com"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </Link>
            <Link
              href="https://instagram.com"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </Link>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          color="inherit"
          align="center"
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} E-Commerce. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 