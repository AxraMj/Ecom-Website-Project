import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, styled, Typography, Button } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const bannerImages = [
  {
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=2070&q=80',
    alt: 'Electronics Sale',
    link: '/category/electronics',
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 40% off on latest gadgets',
    buttonText: 'Shop Now',
  },
  {
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2070&q=80',
    alt: 'Fashion Collection',
    link: '/category/fashion',
    title: 'New Fashion Collection',
    subtitle: 'Discover the latest trends',
    buttonText: 'Explore More',
  },
  {
    url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=2070&q=80',
    alt: 'Home & Furniture',
    link: '/category/furniture',
    title: 'Home & Furniture Sale',
    subtitle: 'Transform your living space',
    buttonText: 'View Collection',
  },
];

const BannerContainer = styled(Box)({
  position: 'relative',
  width: '100vw',
  height: '70vh',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
  display: 'flex',
  marginTop: '-10px',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'calc(-50vw + 50%)',
  marginRight: 'calc(-50vw + 50%)',
});

const BannerImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  position: 'absolute',
  top: 0,
  left: 0,
});

const BannerOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: theme.spacing(4, 8),
  color: 'white',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 4),
    background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 100%)',
  },
}));

const BannerControls = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px',
  zIndex: 3,
});

const BannerDots = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  zIndex: 3,
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
  color: 'white',
  padding: theme.spacing(1.5, 4),
  borderRadius: '30px',
  border: '2px solid white',
  fontSize: '1.1rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
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
            width: '100%',
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
              }}
            >
              {image.title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                opacity: 0.9,
                maxWidth: '600px',
              }}
            >
              {image.subtitle}
            </Typography>
            <BannerButton onClick={() => handleBannerClick(image.link)}>
              {image.buttonText}
            </BannerButton>
          </BannerOverlay>
        </Box>
      ))}

      <BannerControls>
        <IconButton onClick={prevSlide} size="large">
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={nextSlide} size="large">
          <KeyboardArrowRight />
        </IconButton>
      </BannerControls>

      <BannerDots>
        {bannerImages.map((_, index) => (
          <Dot key={index} active={index === currentSlide} onClick={() => goToSlide(index)} />
        ))}
      </BannerDots>
    </BannerContainer>
  );
};

export default Banner;
