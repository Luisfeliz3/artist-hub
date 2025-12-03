import api from './api';

export const userService = {
  // Cart operations
  getCart: async () => {
    const response = await api.get('/users/cart');
    return response.data;
  },

  addToCart: async (productId, quantity = 1, variant = null) => {
    const response = await api.post('/users/cart/add', {
      productId,
      quantity,
      variant,
    });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`/users/cart/remove/${productId}`);
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    const response = await api.put(`/users/cart/update/${productId}`, {
      quantity,
    });
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/users/cart/clear');
    return response.data;
  },

  // Favorites operations
  getFavorites: async () => {
    const response = await api.get('/users/favorites');
    return response.data;
  },

  addFavorite: async (productId) => {
    const response = await api.post('/users/favorites/add', { productId });
    return response.data;
  },

  removeFavorite: async (productId) => {
    const response = await api.delete(`/users/favorites/remove/${productId}`);
    return response.data;
  },

  // Profile operations
  updateArtistProfile: async (artistData) => {
    const response = await api.put('/users/artist-profile', artistData);
    return response.data;
  },

  uploadProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/users/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};