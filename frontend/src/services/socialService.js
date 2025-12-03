import api from './api';

export const socialService = {
  getFeed: async (params = {}) => {
    const response = await api.get('/social', { params });
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/social', postData);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/social/${postId}/like`);
    return response.data;
  },

  getArtistPosts: async (artistId) => {
    const response = await api.get(`/social/artist/${artistId}`);
    return response.data;
  },

  syncInstagram: async () => {
    const response = await api.post('/social/sync/instagram');
    return response.data;
  },

  syncTikTok: async () => {
    const response = await api.post('/social/sync/tiktok');
    return response.data;
  },
};