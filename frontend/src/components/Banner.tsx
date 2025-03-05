import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, styled, Typography, Button } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const bannerImages = [
  {
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Electronics Sale',
    link: '/category/electronics',
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 40% off on latest gadgets',
    buttonText: 'Shop Now'
  },
  {
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Fashion Collection',
    link: '/category/fashion',
    title: 'New Fashion Collection',
    subtitle: 'Discover the latest trends',
    buttonText: 'Explore More'
  },
  {
    url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Home & Furniture',
    link: '/category/furniture',
    title: 'Home & Furniture Sale',
    subtitle: 'Transform your living space',
    buttonText: 'View Collection'
  },
];

const BannerContainer = styled(Box)({
  position: 'relative',
  width: '100vw',
  height: '80vh',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  marginTop: '-32px',
  display: 'block',
  lineHeight: 0,
  fontSize: 0,
  verticalAlign: 'top',
  '& > *': {
    fontSize: '1rem'
  }
});

const BannerImage = styled('img')({
  width: '100vw',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  verticalAlign: 'top',
  margin: 0,
  padding: 0
});

const BannerOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4, 8),
  color: 'white',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 4),
    background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 100%)',
  },
}));

const BannerControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '& .MuiIconButton-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
}));

const BannerDots = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  zIndex: 2,
}));

const Dot = styled('button')<{ active?: boolean }>(({ theme, active }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: active ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: active ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.8)',
  },
}));

const BannerButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: 'transparent',
  color: 'white',
  padding: theme.spacing(1.5, 4),
  borderRadius: '30px',
  border: '2px solid white',
  fontSize: '1.1rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.secondary.main,
    transform: 'scaleX(0)',
    transformOrigin: 'right',
    transition: 'transform 0.3s ease',
    zIndex: -1,
  },
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'transparent',
    transform: 'translateY(-3px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    '&::before': {
      transform: 'scaleX(1)',
      transformOrigin: 'left',
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 3),
    fontSize: '1rem',
  },
}));

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleBannerClick = (link: string) => {
    navigate(link);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused) {
      timer = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <BannerContainer
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {bannerImages.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: '100vw',
            height: '100%',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            cursor: 'pointer',
          }}
        >
          <BannerImage src={image.url} alt={image.alt} />
          <BannerOverlay>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '-0.5px',
              }}
            >
              {image.title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 400,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                opacity: 0.9,
                maxWidth: '600px',
              }}
            >
              {image.subtitle}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <BannerButton
                variant="outlined"
                onClick={() => handleBannerClick(image.link)}
              >
                {image.buttonText}
              </BannerButton>
            </Box>
          </BannerOverlay>
        </Box>
      ))}
      
      <BannerControls className="banner-controls">
        <IconButton onClick={prevSlide} size="large">
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={nextSlide} size="large">
          <KeyboardArrowRight />
        </IconButton>
      </BannerControls>

      <BannerDots>
        {bannerImages.map((_, index) => (
          <Dot
            key={index}
            active={index === currentSlide}
            onClick={() => goToSlide(index)}
          />
        ))}
      </BannerDots>
    </BannerContainer>
  );
};

export default Banner; 