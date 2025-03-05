import React from 'react';
import { Box } from '@mui/material';
import Banner from '../components/Banner';
import HotProducts from '../components/HotProducts';
import FeaturedProducts from '../components/FeaturedProducts';

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'relative',
        display: 'block',
        overflowX: 'hidden',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        '& > *': {
          margin: 0,
          padding: 0,
        }
      }}
    >
      <Banner />
      <HotProducts />
      <FeaturedProducts />
    </Box>
  );
};

export default HomePage;
