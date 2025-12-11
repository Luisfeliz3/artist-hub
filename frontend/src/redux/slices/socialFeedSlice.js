// client/src/services/socialService.js
import api from './api';

const socialService = {
  // Get social feed
  getSocialFeed: async (params = {}) => {
    return api.get('/api/social/feed', { params });
  },

  // Get trending posts
  getTrendingPosts: async (params = {}) => {
    return api.get('/api/social/trending', { params });
  },

  // Engage with post (like, save, comment, share, view)
  engageWithPost: async (postId, action, comment = null, duration = 0) => {
    return api.post(`/api/social/posts/${postId}/engage`, {
      action,
      comment,
      duration
    });
  },

  // Get post comments
  getPostComments: async (postId, params = {}) => {
    return api.get(`/api/social/posts/${postId}/comments`, { params });
  },

  // Add comment to post
  addComment: async (postId, content) => {
    return api.post(`/api/social/posts/${postId}/comments`, { content });
  },

  // Sync social media posts
  syncSocialMedia: async (platform, artistId) => {
    return api.post('/api/social/sync', { platform, artistId });
  },

  // Create new post
  createPost: async (postData) => {
    return api.post('/api/social/posts', postData);
  },

  // Delete post
  deletePost: async (postId) => {
    return api.delete(`/api/social/posts/${postId}`);
  },

  // Get user's posts
  getUserPosts: async (userId, params = {}) => {
    return api.get(`/api/social/user/${userId}/posts`, { params });
  },

  // Get platform stats
  getPlatformStats: async () => {
    return api.get('/api/social/stats');
  }
};

export default socialService;