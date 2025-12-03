import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
} from '@mui/material';
import { 
  PlayArrow, 
  Favorite, 
  Share, 
  ShoppingCart,
  TrendingUp,
  People,
  MusicNote
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const featuredArtists = [
    {
      id: 1,
      name: 'Nova Rhythm',
      genre: ['Electronic', 'Synthwave'],
      followers: '124K',
      image: 'https://source.unsplash.com/random/400x400/?singer',
      featured: true,
    },
    {
      id: 2,
      name: 'Luna Waves',
      genre: ['Indie', 'Dream Pop'],
      followers: '89K',
      image: 'https://source.unsplash.com/random/400x401/?musician',
    },
    {
      id: 3,
      name: 'Echo Theory',
      genre: ['Alternative', 'Rock'],
      followers: '156K',
      image: 'https://source.unsplash.com/random/400x402/?band',
    },
  ];

  const trendingProducts = [
    {
      id: 1,
      name: 'Limited Edition Vinyl',
      artist: 'Nova Rhythm',
      price: '$39.99',
      image: 'https://source.unsplash.com/random/300x300/?vinyl',
      category: 'music',
    },
    {
      id: 2,
      name: 'Tour Hoodie 2024',
      artist: 'Luna Waves',
      price: '$64.99',
      image: 'https://source.unsplash.com/random/300x301/?hoodie',
      category: 'merch',
    },
    {
      id: 3,
      name: 'Digital Album Bundle',
      artist: 'Echo Theory',
      price: '$24.99',
      image: 'https://source.unsplash.com/random/300x302/?album',
      category: 'digital',
    },
  ];

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '70vh' },
          borderRadius: 4,
          overflow: 'hidden',
          mb: 6,
          mt: 2,
        }}
      >
        <Box
          component="img"
          src="https://source.unsplash.com/random/1600x900/?concert,music"
          alt="Hero"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            p: 4,
            background: 'linear-gradient(90deg, rgba(10,10,15,0.8) 0%, transparent 100%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" sx={{ mb: 2 }}>
              Discover. Connect.
              <Box component="span" className="gradient-text"> Create.</Box>
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
              The ultimate platform for artists and fans to connect through music,
              merchandise, and exclusive content.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/music')}
                startIcon={<MusicNote />}
              >
                Explore Music
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/shop')}
                startIcon={<ShoppingCart />}
              >
                Shop Merch
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Featured Artists */}
      <Typography variant="h3" sx={{ mb: 4 }}>
        Featured Artists
      </Typography>
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {featuredArtists.map((artist, index) => (
          <Grid item xs={12} md={4} key={artist.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s ease',
                  },
                }}
                onClick={() => navigate(`/artist/${artist.id}`)}
              >
                {artist.featured && (
                  <Chip
                    label="Featured"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1,
                    }}
                  />
                )}
                <CardMedia
                  component="img"
                  height="300"
                  image={artist.image}
                  alt={artist.name}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {artist.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {artist.genre.map((g) => (
                      <Chip key={g} label={g} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <People fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {artist.followers} followers
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Trending Products */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h3">Trending Now</Typography>
      </Box>
      <Grid container spacing={3}>
        {trendingProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  position: 'relative',
                  '&:hover .product-actions': {
                    opacity: 1,
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.image}
                    alt={product.name}
                  />
                  <Box
                    className="product-actions"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{ background: 'rgba(0,0,0,0.7)' }}
                    >
                      <Favorite />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ background: 'rgba(0,0,0,0.7)' }}
                    >
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {product.artist}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary.main">
                      {product.price}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCart />}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: 'center',
          my: 8,
          p: 6,
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(138,43,226,0.1) 0%, rgba(0,212,255,0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Ready to Share Your Art?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Join thousands of artists connecting with fans worldwide.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
            px: 6,
            py: 1.5,
          }}
          onClick={() => navigate('/register')}
        >
          Get Started Free
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;