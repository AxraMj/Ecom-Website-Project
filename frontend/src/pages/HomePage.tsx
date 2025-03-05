import React from 'react';
import { Box, Container } from '@mui/material';
import Banner from '../components/Banner';

const HomePage: React.FC = () => {
  return (
    <Box>
      <Banner />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Other content will be added here */}
      </Container>
    </Box>
  );
};

export default HomePage; 