import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  Skeleton,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  Badge,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { 
  Search,
  PlayArrow,
  Favorite,
  FavoriteBorder,
  Share,
  ShoppingCart,
  TrendingUp,
  People,
  MusicNote,
  LocalFireDepartment,
  NewReleases,
  AccessTime,
  Storefront,
  Groups,
  Star,
  ArrowForward,
  NavigateNext,
  Event,
  Album,
  Mic,
  Equalizer,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Redux actions and selectors
import { fetchFeaturedProducts, selectFeaturedProducts, selectProductsLoading } from '../redux/slices/productSlice';
// import { fetchSocialFeed, selectSocialFeed, selectFeaturedPosts } from '../redux/slices/socialSlice';
import { fetchCurrentUser, selectIsAuthenticated } from '../redux/slices/authSlice';
import { fetchCart } from '../redux/slices/cartSlice';
import { fetchFavorites, toggleFavorite } from '../redux/slices/favoritesSlice';
import { fetchSpotifyArtist } from '../redux/slices/musicSlice';

// API services
import api from '../services/api';
import { userService } from '../services/userService';
import { productService } from '../services/productService';
import { socialService } from '../services/socialService';

// Utils
import { getSafeImageUrl, generateAvatar, getGradientBackground } from '../utils/placeholderImages';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [spotifyData, setSpotifyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalProducts: 0,
    activeUsers: 0,
    recentSales: 0,
  });

  // Redux state
  const featuredProducts = useSelector(selectFeaturedProducts);
  const productsLoading = useSelector(selectProductsLoading);
  // const socialFeed = useSelector(selectSocialFeed);
  // const featuredPosts = useSelector(selectFeaturedPosts);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // Fetch featured products from Redux
        dispatch(fetchFeaturedProducts());

        // Fetch social feed
        // dispatch(fetchSocialFeed({ page: 1, limit: 6 }));

        // Fetch additional data from backend
        await Promise.all([
          fetchFeaturedArtists(),
          fetchTrendingProducts(),
          fetchLatestPosts(),
          fetchSpotifyFeatured(),
          fetchPlatformStats(),
        ]);

        // Fetch current user if authenticated
        if (isAuthenticated) {
          dispatch(fetchCurrentUser());
          dispatch(fetchCart());
          dispatch(fetchFavorites());
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
        toast.error('Failed to load homepage data');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [dispatch, isAuthenticated]);

  // Fetch featured artists from backend
  const fetchFeaturedArtists = async () => {
    try {
      const response = await api.get('/users/featured-artists');
      setFeaturedArtists(response.data);
    } catch (error) {
      console.error('Error fetching featured artists:', error);
      // Fallback data
      // setFeaturedArtists([
      //   {
      //     _id: '1',
      //     username: 'nova_rhythm',
      //     profileImage: generateAvatar('Nova Rhythm'),
      //     artistProfile: {
      //       bio: 'Electronic music producer creating futuristic soundscapes',
      //       genre: ['Electronic', 'Synthwave'],
      //     },
      //     followers: 124000,
      //     featured: true,
      //   },
      //   {
      //     _id: '2',
      //     username: 'luna_waves',
      //     profileImage: generateAvatar('Luna Waves'),
      //     artistProfile: {
      //       bio: 'Indie dream pop artist with ethereal vocals',
      //       genre: ['Indie', 'Dream Pop'],
      //     },
      //     followers: 89000,
      //   },
      //   {
      //     _id: '3',
      //     username: 'echo_theory',
      //     profileImage: generateAvatar('Echo Theory'),
      //     artistProfile: {
      //       bio: 'Alternative rock band with powerful vocals',
      //       genre: ['Alternative Rock', 'Indie Rock'],
      //     },
      //     followers: 156000,
      //   },
      // ]);
    }
  };

  // Fetch trending products
  const fetchTrendingProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: { sort: 'popular', limit: 6 }
      });
      setTrendingProducts(response.data);
    } catch (error) {
      console.error('Error fetching trending products:', error);
      setTrendingProducts([]);
    }
  };

  // Fetch latest posts
  const fetchLatestPosts = async () => {
    try {
      const response = await api.get('/social/latest');
      setLatestPosts(response.data);
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      setLatestPosts([]);
    }
  };

  // Fetch Spotify featured artist
  const fetchSpotifyFeatured = async () => {
    try {
      // This would typically fetch from your backend which proxies Spotify API
      // For demo, we'll use a mock or fetch from backend
      const response = await api.get('/music/spotify/featured');
      setSpotifyData(response.data);
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      // Mock data for demo
      setSpotifyData({
        artist: {
          name: 'Nova Rhythm',
          images: [{ url: generateAvatar('Nova Rhythm', 800) }],
          followers: { total: 124000 },
          genres: ['electronic', 'synthwave'],
        },
        topTracks: {
          tracks: Array(3).fill().map((_, i) => ({
            name: `Track ${i + 1}`,
            duration_ms: 180000,
            preview_url: null,
          })),
        },
      });
    }
  };

  // Fetch platform statistics
  const fetchPlatformStats = async () => {
    try {
      const response = await api.get('/stats/platform');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      setStats({
        totalArtists: 150,
        totalProducts: 1200,
        activeUsers: 50000,
        recentSales: 234,
      });
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle artist follow
  const handleFollowArtist = async (artistId) => {
    try {
      await api.post(`/users/follow/${artistId}`);
      toast.success('Artist followed successfully!');
      // Update local state
      setFeaturedArtists(prev =>
        prev.map(artist =>
          artist._id === artistId
            ? { ...artist, followers: artist.followers + 1, isFollowing: true }
            : artist
        )
      );
    } catch (error) {
      toast.error('Failed to follow artist');
    }
  };

  // Handle product like
  const handleProductLike = async (productId) => {
    dispatch(toggleFavorite(productId));
  };

  // Handle add to cart
  const handleAddToCart = async (productId) => {
    try {
      await userService.addToCart(productId, 1);
      toast.success('Added to cart!');
      dispatch(fetchCart()); // Refresh cart
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  // Handle post like
  const handlePostLike = async (postId) => {
    try {
      await socialService.likePost(postId);
      toast.success('Post liked!');
      // Update local state
      setLatestPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
                ...post,
                metadata: {
                  ...post.metadata,
                  likes: post.metadata.likes + 1,
                },
              }
            : post
        )
      );
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Loading skeletons
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: 4 }} />
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section with Search */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '60vh', md: '70vh' },
          borderRadius: 4,
          overflow: 'hidden',
          mb: 6,
          mt: 2,
          background: getGradientBackground(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
              }}
            >
              Discover Your Next
              <Box component="span" className="gradient-text" sx={{ display: 'block' }}>
                Favorite Artist
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Connect directly with artists, shop exclusive merch, and experience
              music like never before on the ultimate creator-commerce platform.
            </Typography>

            {/* Search Bar */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                mb: 4,
              }}
            >
              <TextField
                fullWidth
                placeholder="Search artists, music, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  sx: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                }}
              />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/music')}
                startIcon={<MusicNote />}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7B1FA2, #0099CC)',
                  },
                }}
              >
                Explore Music
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/shop')}
                startIcon={<Storefront />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Shop Merch
              </Button>
            </Stack>
          </motion.div>
        </Box>
      </Box>

      {/* Platform Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          {
            label: 'Active Artists',
            value: stats.totalArtists.toLocaleString(),
            icon: <Mic sx={{ fontSize: 40 }} />,
            color: '#8A2BE2',
          },
          {
            label: 'Products Listed',
            value: stats.totalProducts.toLocaleString(),
            icon: <Album sx={{ fontSize: 40 }} />,
            color: '#00D4FF',
          },
          {
            label: 'Community Members',
            value: stats.activeUsers.toLocaleString(),
            icon: <Groups sx={{ fontSize: 40 }} />,
            color: '#00CC88',
          },
          {
            label: 'Recent Sales',
            value: `${stats.recentSales}+`,
            icon: <LocalFireDepartment sx={{ fontSize: 40 }} />,
            color: '#FF4D4D',
          },
        ].map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${stat.color}, ${stat.color}80)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h3" className="gradient-text" sx={{ mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Featured Artists */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3">
            Featured Artists
          </Typography>
          <Button
            endIcon={<NavigateNext />}
            onClick={() => navigate('/artists')}
            sx={{ color: 'primary.main' }}
          >
            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredArtists.map((artist, index) => (
            <Grid item xs={12} sm={6} md={4} key={artist._id || index}>
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
                    height: '100%',
                    background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease',
                    },
                  }}
                  onClick={() => navigate(`/artist/${artist._id || artist.id}`)}
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
                    height="200"
                    image={getSafeImageUrl(artist.profileImage, 'artist')}
                    alt={artist.username}
                    sx={{
                      objectFit: 'cover',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {artist.username}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {artist.artistProfile?.genre?.slice(0, 3).map((genre, idx) => (
                        <Chip
                          key={idx}
                          label={genre}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {artist.artistProfile?.bio || 'No bio available'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {artist.followers?.toLocaleString() || '0'} followers
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowArtist(artist._id);
                        }}
                      >
                        {artist.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Trending Products */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <LocalFireDepartment sx={{ fontSize: 40, color: '#FF4D4D' }} />
          <Typography variant="h3">Trending Now</Typography>
        </Box>

        <Grid container spacing={3}>
          {trendingProducts.length > 0 ? (
            trendingProducts.slice(0, 6).map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={product._id || index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      position: 'relative',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={getSafeImageUrl(product.images?.[0]?.url, product.category)}
                        alt={product.name}
                        sx={{
                          objectFit: 'cover',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(0,0,0,0.6)',
                          '&:hover': { background: 'rgba(0,0,0,0.8)' },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductLike(product._id);
                        }}
                      >
                        <FavoriteBorder sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        by {product.artist?.username || 'Artist'}
                      </Typography>
                      <Chip
                        label={product.category}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Typography variant="h6" color="primary.main">
                          ${product.price?.toFixed(2) || '0.00'}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product._id);
                          }}
                        >
                          <ShoppingCart />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="info">
                No trending products available at the moment.
              </Alert>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Featured Posts Section */}
      <Box sx={{ mb: 8 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 4,
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
            },
          }}
        >
          <Tab label="Latest Posts" icon={<AccessTime />} iconPosition="start" />
          <Tab label="Featured Content" icon={<Star />} iconPosition="start" />
          <Tab label="Spotify Integration" icon={<Equalizer />} iconPosition="start" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            {latestPosts.slice(0, 3).map((post, index) => (
              <Grid item xs={12} md={4} key={post._id || index}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={post.artist?.profileImage}
                        alt={post.artist?.username}
                      />
                      <Box>
                        <Typography variant="subtitle1">
                          {post.artist?.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={post.platform}
                        size="small"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, minHeight: 60 }}
                    >
                      {post.content}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handlePostLike(post._id)}
                      >
                        <FavoriteBorder />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {post.metadata?.likes || 0}
                        </Typography>
                      </IconButton>
                      <IconButton size="small">
                        <Share />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {featuredProducts.slice(0, 3).map((product, index) => (
              <Grid item xs={12} md={4} key={product._id}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getSafeImageUrl(product.images?.[0]?.url, product.category)}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary.main">
                        ${product.price?.toFixed(2)}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product._id);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 2 && spotifyData && (
          <Card
            sx={{
              background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              p: 3,
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <CardMedia
                  component="img"
                  image={spotifyData.artist?.images?.[0]?.url || generateAvatar(spotifyData.artist?.name)}
                  alt={spotifyData.artist?.name}
                  sx={{
                    borderRadius: 2,
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Featured on Spotify: {spotifyData.artist?.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {spotifyData.artist?.genres?.slice(0, 3).map((genre, idx) => (
                    <Chip key={idx} label={genre} size="small" />
                  ))}
                </Box>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {spotifyData.artist?.followers?.total?.toLocaleString()} monthly listeners
                </Typography>
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Top Tracks:
                </Typography>
                {spotifyData.topTracks?.tracks?.slice(0, 3).map((track, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1,
                      borderRadius: 1,
                      background: 'rgba(255, 255, 255, 0.05)',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ minWidth: 30 }}>
                      {idx + 1}.
                    </Typography>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      {track.name}
                    </Typography>
                    <IconButton size="small">
                      <PlayArrow />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Card>
        )}
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: 'center',
          p: 6,
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(138,43,226,0.1) 0%, rgba(0,212,255,0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          mb: 4,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Ready to Share Your Art?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
          Join thousands of artists connecting with fans worldwide. Sell your music,
          merch, and exclusive content directly to your supporters.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            sx={{
              px: 6,
              py: 1.5,
              background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7B1FA2, #0099CC)',
              },
            }}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/about')}
          >
            Learn More
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default HomePage;