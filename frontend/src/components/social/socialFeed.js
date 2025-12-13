// // client/src/components/social/SocialFeed.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchSocialFeed,
//   fetchTrendingPosts,
//   engageWithPost,
//   updateFeedFilters,
//   clearFeed
// } from '../../redux/slices/socialFeedSlice';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import {
//   Box,
//   Container,
//   Grid,
//   Paper,
//   Tabs,
//   Tab,
//   Chip,
//   TextField,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
//   Alert,
//   Typography,
//   Button,
//   Menu,
//   MenuItem,
//   FormControl,
//   Select,
//   InputLabel
// } from '@mui/material';
// import {
//   Search,
//   FilterList,
//   Whatshot,
//   TrendingUp,
//   NewReleases,
//   SmartDisplay,
//   MusicNote,
//   CameraAlt,
//   ChatBubble,
//   Favorite,
//   Share,
//   Bookmark,
//   MoreVert,
//   PlayArrow,
//   Pause,
//   VolumeUp,
//   VolumeOff
// } from '@mui/icons-material';
// import PostCard from './PostCard';
// import TrendingSidebar from './TrendingSidebar';
// import FeedFilters from './FeedFilters';

// const SocialFeed = () => {
//   const dispatch = useDispatch();
//   const {
//     posts,
//     pagination,
//     filters,
//     loading,
//     error,
//     hasMore
//   } = useSelector((state) => state.socialFeed.feed);
  
//   const [sortBy, setSortBy] = useState('latest');
//   const [selectedPlatform, setSelectedPlatform] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   const searchTimeoutRef = useRef(null);

//   // Platforms
//   const platforms = [
//     { id: 'all', label: 'All Platforms', icon: <CameraAlt /> },
//     { id: 'instagram', label: 'Instagram', icon: <CameraAlt /> },
//     { id: 'tiktok', label: 'TikTok', icon: <SmartDisplay /> },
//     { id: 'youtube', label: 'YouTube', icon: <SmartDisplay /> },
//     { id: 'twitter', label: 'Twitter', icon: <ChatBubble /> },
//     { id: 'spotify', label: 'Spotify', icon: <MusicNote /> }
//   ];

//   // Sort options
//   const sortOptions = [
//     { value: 'latest', label: 'Latest', icon: <NewReleases /> },
//     { value: 'popular', label: 'Popular', icon: <TrendingUp /> },
//     { value: 'trending', label: 'Trending', icon: <Whatshot /> }
//   ];

//   // Handle search with debounce
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);
    
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
    
//     searchTimeoutRef.current = setTimeout(() => {
//       setDebouncedSearch(value);
//     }, 500);
//   };

//   // Fetch initial feed
//   useEffect(() => {
//     dispatch(clearFeed());
//     fetchFeed();
    
//     // Fetch trending posts
//     dispatch(fetchTrendingPosts({ timeRange: 'day' }));
//   }, []);

//   // Update filters when sort or platform changes
//   useEffect(() => {
//     const newFilters = {
//       ...filters,
//       sortBy,
//       platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
//       search: debouncedSearch || undefined
//     };
    
//     dispatch(updateFeedFilters(newFilters));
//     dispatch(clearFeed());
//     fetchFeed(newFilters);
//   }, [sortBy, selectedPlatform, debouncedSearch]);

//   const fetchFeed = (customFilters = null) => {
//     const feedFilters = customFilters || {
//       ...filters,
//       sortBy,
//       platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
//       search: debouncedSearch || undefined,
//       page: 1
//     };
    
//     dispatch(fetchSocialFeed(feedFilters));
//   };

//   const loadMore = () => {
//     if (hasMore && !loading) {
//       const nextPage = pagination.page + 1;
//       dispatch(fetchSocialFeed({
//         ...filters,
//         page: nextPage
//       }));
//     }
//   };

//   const handlePlatformChange = (platform) => {
//     setSelectedPlatform(platform);
//   };

//   const handleSortChange = (sort) => {
//     setSortBy(sort);
//   };

//   const handleEngagement = (postId, action, data = null) => {
//     dispatch(engageWithPost({ postId, action, ...data }));
//   };

//   if (error && posts.length === 0) {
//     return (
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//         <Button 
//           variant="contained" 
//           onClick={() => fetchFeed()}
//           startIcon={"<Refresh />"}
//         >
//           Retry
//         </Button>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ mt: 3 }}>
//       <Grid container spacing={3}>
//         {/* Main Feed */}
//         <Grid item xs={12} lg={8}>
//           <Paper sx={{ p: 3, mb: 3 }}>
//             {/* Feed Header */}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//               <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
//                 Social Feed
//               </Typography>
              
//               <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//                 {/* Search */}
//                 <TextField
//                   size="small"
//                   placeholder="Search posts..."
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Search />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ width: 250 }}
//                 />
                
//                 {/* Sort Select */}
//                 <FormControl size="small" sx={{ minWidth: 150 }}>
//                   <InputLabel>Sort by</InputLabel>
//                   <Select
//                     value={sortBy}
//                     label="Sort by"
//                     onChange={(e) => handleSortChange(e.target.value)}
//                   >
//                     {sortOptions.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {option.icon}
//                           {option.label}
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
                
//                 {/* Filter Button */}
//                 <FeedFilters />
//               </Box>
//             </Box>
            
//             {/* Platform Tabs */}
//             <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//               <Tabs 
//                 value={selectedPlatform} 
//                 onChange={(e, value) => handlePlatformChange(value)}
//                 variant="scrollable"
//                 scrollButtons="auto"
//               >
//                 {platforms.map((platform) => (
//                   <Tab
//                     key={platform.id}
//                     value={platform.id}
//                     icon={platform.icon}
//                     label={platform.label}
//                     sx={{ minHeight: 64 }}
//                   />
//                 ))}
//               </Tabs>
//             </Box>
            
//             {/* Infinite Scroll Feed */}
//             <InfiniteScroll
//               dataLength={posts.length}
//               next={loadMore}
//               hasMore={hasMore}
//               loader={
//                 <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                   <CircularProgress />
//                 </Box>
//               }
//               endMessage={
//                 <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
//                   <Typography>You've reached the end of the feed</Typography>
//                 </Box>
//               }
//               scrollThreshold={0.9}
//             >
//               <Grid container spacing={3}>
//                 {posts.map((post) => (
//                   <Grid item xs={12} key={post._id}>
//                     <PostCard
//                       post={post}
//                       onEngagement={handleEngagement}
//                     />
//                   </Grid>
//                 ))}
//               </Grid>
//             </InfiniteScroll>
            
//             {/* Loading State */}
//             {loading && posts.length === 0 && (
//               <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
//                 <CircularProgress size={60} />
//               </Box>
//             )}
//           </Paper>
//         </Grid>
        
//         {/* Sidebar */}
//         <Grid item xs={12} lg={4}>
//           <TrendingSidebar />
//           {/* Additional sidebar components can be added here */}
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default SocialFeed;