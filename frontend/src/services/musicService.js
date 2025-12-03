import api from './api';

export const musicService = {
  getSpotifyArtist: async (artistId) => {
    const response = await api.get(`/music/spotify/artist/${artistId}`);
    return response.data;
  },

  searchMusic: async (query, type = 'artist') => {
    const response = await api.get('/music/search', { params: { query, type } });
    return response.data;
  },

  getArtistProducts: async (artistId) => {
    const response = await api.get(`/music/artist/${artistId}/products`);
    return response.data;
  },
};