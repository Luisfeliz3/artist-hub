import React, { useState, useEffect, } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Divider,
  Paper,
  Avatar,
  AvatarGroup,
  Badge,
  CircularProgress,
  Tabs,
  Tab,
  Stack,
  Autocomplete,
  Switch,
  FormControlLabel,
  Tooltip,
  Fab,
  Zoom,
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  LocationOn,
  MusicNote,
  People,
  Favorite,
  FavoriteBorder,
  Share,
  PlayArrow,
  Add,
  MoreVert,
  Instagram,
  YouTube,
  Twitter,
 
  Soundcloud,
  Spotify,
  TrendingUp,
  Visibility,
  ShoppingBag,
  Event,
  Album,
  Mic,
  Equalizer,
  BarChart,
  Refresh,
  Verified,
  Star,
  StarBorder,
  PlaylistAdd,
  Download,
  Link,
  Bookmark,
  BookmarkBorder,
  EmojiEvents,
  Language,
  Public,
  Cake,
  CalendarToday,
  AccessTime,
  LocalFireDepartment,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector as reduxUseSelector   } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Redux
import {
  fetchAllArtists,
  fetchArtistSocialStats,
  followArtist,
  unfollowArtist,
  setFilters,
  clearFilters,
  setSortBy,
  setPage,
  addToRecentlyViewed,
  selectAllArtists,
  selectArtistsLoading,
  selectArtistsFilters,
  selectArtistsPagination,
  selectIsFollowing,
} from '../redux/slices/artistsSlice';

// API Services
import { socialService } from '../services/socialService';

// Utils
import { getSafeImageUrl, generateAvatar } from '../utils/placeholderImages';

const ArtistsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedArtist, setExpandedArtist] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [socialStats, setSocialStats] = useState({});
  const [liveFeeds, setLiveFeeds] = useState({});

  // Redux state
  const artists = reduxUseSelector(selectAllArtists);
  const isLoading = reduxUseSelector(selectArtistsLoading);
  const filters = reduxUseSelector(selectArtistsFilters);
  const pagination = reduxUseSelector(selectArtistsPagination);

  // Available genres from backend
  const availableGenres = [
    'Electronic', 'Synthwave', 'Indie', 'Dream Pop', 'Alternative Rock',
    'Hip Hop', 'R&B', 'Jazz', 'Classical', 'Metal', 'Folk', 'Pop',
    'Techno', 'House', 'Dubstep', 'Trap', 'Lo-fi', 'Ambient',
  ];

  // Fetch social stats for artists
  useEffect(() => {
    const fetchSocialData = async () => {
      const stats = {};
      for (const artist of artists.slice(0, 5)) {
        try {
          const response = await socialService.getArtistPosts(artist._id);
          stats[artist._id] = response;
        } catch (error) {
          console.error(`Failed to fetch social stats for ${artist.username}:`, error);
        }
      }
      setSocialStats(stats);
    };

    if (artists.length > 0) {
      fetchSocialData();
    }
  }, [artists]);


  // Fetch artists on mount and filter changes
  useEffect(() => {
    const loadArtists = async () => {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        search: searchTerm || undefined,
      };
      
      await dispatch(fetchAllArtists(params));
    };

    const debounceTimer = setTimeout(() => {
      loadArtists();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [dispatch, filters, selectedGenres, searchTerm, pagination.page, pagination.limit]);


  // Handlers
  const handleArtistClick = (artist) => {
    dispatch(addToRecentlyViewed(artist));
    navigate(`/artist/${artist._id}`);
  };

  const handleFollowClick = async (artistId, e) => {
    e.stopPropagation();
    const isFollowing = reduxUseSelector(selectIsFollowing(artistId));
    
    if (isFollowing) {
      await dispatch(unfollowArtist(artistId));
    } else {
      await dispatch(followArtist(artistId));
    }
  };

  const handleShareArtist = (artist, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Check out ${artist.username} on ArtistHub`,
        text: artist.artistProfile?.bio || 'Amazing artist on ArtistHub',
        url: `${window.location.origin}/artist/${artist._id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/artist/${artist._id}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleAddToPlaylist = (artist, e) => {
    e.stopPropagation();
    toast.success(`Added ${artist.username} to your playlist`);
  };

  const handleSyncSocial = async (artistId, e) => {
    e.stopPropagation();
    toast.loading('Syncing social media...');
    try {
      await socialService.syncArtistSocial(artistId);
      toast.success('Social media synced successfully!');
    } catch (error) {
      toast.error('Failed to sync social media');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSearchTerm('');
    dispatch(clearFilters());
  };

  // Filter artists by criteria
  const filteredArtists = artists.filter(artist => {
    // Genre filter
    if (selectedGenres.length > 0) {
      const artistGenres = artist.artistProfile?.genre || [];
      if (!selectedGenres.some(genre => artistGenres.includes(genre))) {
        return false;
      }
    }

    // Location filter
    if (filters.location && artist.artistProfile?.location) {
      if (!artist.artistProfile.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Get artist engagement score
  const getEngagementScore = (artist) => {
    const followers = artist.followers || 0;
    const posts = artist.postCount || 0;
    const products = artist.productCount || 0;
    
    // Simple engagement calculation
    return Math.round((followers / 1000 + posts * 10 + products * 5) * 10) / 10;
  };

  // Render social media stats
  const renderSocialStats = (artistId) => {
    const stats = socialStats[artistId] || {};
    return (
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {stats.instagram && (
          <Tooltip title={`Instagram: ${stats.instagram.followers} followers`}>
            <Chip
              size="small"
              icon={<Instagram />}
              label={stats.instagram.followers > 1000 
                ? `${(stats.instagram.followers / 1000).toFixed(1)}K` 
                : stats.instagram.followers}
              sx={{ background: '#E1306C', color: 'white' }}
            />
          </Tooltip>
        )}
        {stats.youtube && (
          <Tooltip title={`YouTube: ${stats.youtube.subscribers} subscribers`}>
            <Chip
              size="small"
              icon={<YouTube />}
              label={stats.youtube.subscribers > 1000 
                ? `${(stats.youtube.subscribers / 1000).toFixed(1)}K` 
                : stats.youtube.subscribers}
              sx={{ background: '#FF0000', color: 'white' }}
            />
          </Tooltip>
        )}
        {stats.tiktok && (
          <Tooltip title={`TikTok: ${stats.tiktok.followers} followers`}>
            <Chip
              size="small"
              // icon={<TikTok />}
              label={stats.tiktok.followers > 1000 
                ? `${(stats.tiktok.followers / 1000).toFixed(1)}K` 
                : stats.tiktok.followers}
              sx={{ background: '#000000', color: 'white' }}
            />
          </Tooltip>
        )}
      </Stack>
    );
  };

  // Render artist card
  const renderArtistCard = (artist, index) => {
  //  const isFollowing = reduxUseSelector(selectIsFollowing(artist));
 
    const engagementScore = getEngagementScore(artist);
    const stats = socialStats[artist._id] || {};

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={artist._id}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                '& .artist-card-actions': {
                  opacity: 1,
                },
              },
            }}
            onClick={() => handleArtistClick(artist)}
          >
            {/* Premium/Verified badge */}
            {artist.artistProfile.isVerified && (
              <Badge
                badgeContent={
                  <Tooltip title="Verified Artist">
                    <Verified sx={{ fontSize: 16, color: '#00D4FF' }} />
                  </Tooltip>
                }
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 1,
                }}
              />
            )}

            {/* Engagement score */}
            <Chip
              label={`🔥 ${engagementScore}`}
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 1,
                background: 'rgba(255, 77, 77, 0.9)',
                color: 'white',
              }}
            />

            {/* Artist image */}
            <Box sx={{ position: 'relative', height: 200 }}>
              <CardMedia
                component="img"
                height="200"
                image={getSafeImageUrl(artist.profileImage, 'artist')}
                alt={artist.username}
                sx={{
                  objectFit: 'cover',
                  filter: 'brightness(0.8)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {artist.username}
                </Typography>
                {artist.artistProfile?.location && (
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <LocationOn fontSize="inherit" /> {artist.artistProfile.location}
                  </Typography>
                )}
              </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
              {/* Genres */}
              <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                {artist.artistProfile?.genre?.slice(0, 3).map((genre, idx) => (
                  <Chip
                    key={idx}
                    label={genre}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>

              {/* Bio snippet */}
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

              {/* Stats row */}
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Stack alignItems="center">
                    <People fontSize="small" />
                    <Typography variant="caption">
                      {artist.followers > 1000 
                        ? `${(artist.followers / 1000).toFixed(1)}K` 
                        : artist.followers}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={4}>
                  <Stack alignItems="center">
                    <Album fontSize="small" />
                    <Typography variant="caption">
                      {artist.productCount || 0}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={4}>
                  <Stack alignItems="center">
                    <Event fontSize="small" />
                    <Typography variant="caption">
                      {artist.postCount || 0}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>

              {/* Social media stats */}
              {renderSocialStats(artist._id)}
            </CardContent>

            {/* Quick actions */}
            <CardActions className="artist-card-actions" sx={{ 
              p: 2, 
              pt: 0, 
              opacity: 0,
              transition: 'opacity 0.3s',
            }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  { <IconButton
                    size="small"
                    onClick={(e) => handleFollowClick(artist._id, e)}
                    // color={isFollowing ? 'error' : 'default'}
                  >
                    {/* {isFollowing ? <Favorite /> : <FavoriteBorder />} */}
                  </IconButton> }
                </Grid>
                <Grid item xs={4}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleShareArtist(artist, e)}
                  >
                    <Share />
                  </IconButton>
                </Grid>
                <Grid item xs={4}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleAddToPlaylist(artist, e)}
                  >
                    <PlaylistAdd />
                  </IconButton>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </motion.div>
      </Grid>
    );
  };

  // Render expanded artist view
  const renderExpandedView = (artist) => {
    if (!expandedArtist || expandedArtist._id !== artist._id) return null;

    return (
      <Zoom in={true}>
        <Paper
          sx={{
            mt: 2,
            p: 3,
            background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Typography variant="h6">Quick Actions</Typography>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Favorite />}
                  onClick={(e) => handleFollowClick(artist._id, e)}
                >
                  {/* {reduxUseSelector(selectIsFollowing(artist._id)) ? 'Unfollow' : 'Follow'} */}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={(e) => handleShareArtist(artist, e)}
                >
                  Share Profile
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PlaylistAdd />}
                  onClick={(e) => handleAddToPlaylist(artist, e)}
                >
                  Add to Playlist
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={(e) => handleSyncSocial(artist._id, e)}
                >
                  Sync Social Media
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>Live Social Feed</Typography>
              {/* This would show live posts from social media */}
              <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Live social feed would appear here
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Zoom>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" className="gradient-text" gutterBottom>
          Discover Artists
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Connect with talented creators, explore their work, and build your community
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search artists by name, genre, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                startIcon={<FilterList />}
                onClick={toggleFilters}
                variant={showFilters ? 'contained' : 'outlined'}
              >
                Filters
              </Button>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => dispatch(setSortBy(e.target.value))}
                >
                  <MenuItem value="popular">Most Popular</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="followers">Most Followers</MenuItem>
                  <MenuItem value="engagement">Engagement</MenuItem>
                  <MenuItem value="alphabetical">A-Z</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Genres
                    </Typography>
                    <Autocomplete
                      multiple
                      options={availableGenres}
                      value={selectedGenres}
                      onChange={(event, newValue) => setSelectedGenres(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select genres..."
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            size="small"
                          />
                        ))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Location
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter city, state, or country..."
                      value={filters.location}
                      onChange={(e) => dispatch(setFilters({ location: e.target.value }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Price Range
                    </Typography>
                    <Slider
                      value={priceRange}
                      onChange={(e, newValue) => setPriceRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={1000}
                      sx={{ mt: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">${priceRange[0]}</Typography>
                      <Typography variant="caption">${priceRange[1]}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={filters.verified}
                            onChange={(e) => dispatch(setFilters({ verified: e.target.checked }))}
                          />
                        }
                        label="Verified Artists Only"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Show Active Artists"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>

      {/* Tabs Section */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
            },
          }}
        >
          <Tab label="All Artists" icon={<People />} />
          <Tab label="Trending" icon={<LocalFireDepartment />} />
          {/* <Tab label="New Releases" icon={<NewReleases />} /> */}
          <Tab label="Nearby" icon={<LocationOn />} />
          <Tab label="Following" icon={<Favorite />} />
        </Tabs>
      </Paper>

      {/* Artists Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredArtists.map((artist, index) => (
              <React.Fragment key={artist._id}>
                {renderArtistCard(artist, index)}
              </React.Fragment>
            ))}
          </Grid>

          {/* Empty State */}
          {filteredArtists.length === 0 && !isLoading && (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <People sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No artists found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search or filters
              </Typography>
              <Button
                variant="contained"
                onClick={clearAllFilters}
              >
                Clear Filters
              </Button>
            </Paper>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  gap: 1,
                  background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? 'contained' : 'outlined'}
                      onClick={() => dispatch(setPage(pageNum))}
                      sx={{ minWidth: 40 }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </Paper>
            </Box>
          )}
        </>
      )}

      {/* Quick Stats */}
      <Paper
        sx={{
          mt: 6,
          p: 3,
          background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <Stack alignItems="center">
              <Typography variant="h3" className="gradient-text">
                {pagination.totalArtists}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Artists
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Stack alignItems="center">
              <Typography variant="h3" className="gradient-text">
                {filteredArtists.filter(a => a.isVerified).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verified Artists
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Stack alignItems="center">
              <Typography variant="h3" className="gradient-text">
                {availableGenres.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Music Genres
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} md={3}>
            <Stack alignItems="center">
              <Typography variant="h3" className="gradient-text">
                {filteredArtists.reduce((sum, artist) => sum + (artist.followers || 0), 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Followers
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
        }}
        onClick={() => navigate('/artists/map')}
      >
        <LocationOn />
      </Fab>
    </Container>
  );
};

export default ArtistsPage;