import api from './api';

export const artistService = {
  // Get all artists with filters
  getArtists: async (params = {}) => {
    const response = await api.get('/artists', { params });
    return response.data;
  },

  // Get single artist by ID
  getArtistById: async (artistId) => {
    const response = await api.get(`/artists/${artistId}`);
    return response.data;
  },

  // Get artist's social media stats
  getArtistSocialStats: async (artistId) => {
    const response = await api.get(`/artists/${artistId}/social-stats`);
    return response.data;
  },

  // Get artist's products
  getArtistProducts: async (artistId) => {
    const response = await api.get(`/artists/${artistId}/products`);
    return response.data;
  },

  // Get artist's posts
  getArtistPosts: async (artistId) => {
    const response = await api.get(`/artists/${artistId}/posts`);
    return response.data;
  },

  // Get artist's analytics
  getArtistAnalytics: async (artistId) => {
    const response = await api.get(`/artists/${artistId}/analytics`);
    return response.data;
  },

  // Follow an artist
  followArtist: async (artistId) => {
    const response = await api.post(`/artists/${artistId}/follow`);
    return response.data;
  },

  // Unfollow an artist
  unfollowArtist: async (artistId) => {
    const response = await api.delete(`/artists/${artistId}/follow`);
    return response.data;
  },

  // Sync artist's social media
  syncArtistSocial: async (artistId) => {
    const response = await api.post(`/artists/${artistId}/sync-social`);
    return response.data;
  },

  // Get live social feed for artist
  getLiveSocialFeed: async (artistId, platform) => {
    const response = await api.get(`/artists/${artistId}/social-feed/${platform}`);
    return response.data;
  },

  // Get artist's top tracks
  getArtistTopTracks: async (artistId) => {
    const response = await api.get(`/artists/${artistId}/top-tracks`);
    return response.data;
  },

  // Get similar artists
  getSimilarArtists: async (artistId) => {
    const response = await api.get(`/artists/${artistId}/similar`);
    return response.data;
  },

  // Get artist's upcoming events
  getArtistEvents: async (artistId) => {
    const response = await api.get(`/artists/${artistId}/events`);
    return response.data;
  },

  // Search artists
  searchArtists: async (query) => {
    const response = await api.get('/artists/search', { params: { q: query } });
    return response.data;
  },

  // Get trending artists
  getTrendingArtists: async () => {
    const response = await api.get('/artists/trending');
    return response.data;
  },

  // Get artist insights
  getArtistInsights: async (artistId) => {
    const response = await api.get(`/artists/${artistId}/insights`);
    return response.data;
  },
};