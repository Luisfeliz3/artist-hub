import api from './api';

export const profileService = {
  // Get user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/users/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get followers
  getFollowers: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/followers`, { params });
    return response.data;
  },

  // Get following
  getFollowing: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/following`, { params });
    return response.data;
  },

  // Follow user
  followUser: async (targetUserId) => {
    const response = await api.post(`/users/${targetUserId}/follow`);
    return response.data;
  },

  // Unfollow user
  unfollowUser: async (targetUserId) => {
    const response = await api.delete(`/users/${targetUserId}/follow`);
    return response.data;
  },

  // Remove follower
  removeFollower: async (followerId) => {
    const response = await api.delete(`/users/followers/${followerId}`);
    return response.data;
  },

  // Block user
  blockUser: async (userId) => {
    const response = await api.post(`/users/block/${userId}`);
    return response.data;
  },

  // Unblock user
  unblockUser: async (userId) => {
    const response = await api.delete(`/users/block/${userId}`);
    return response.data;
  },

  // Get blocked users
  getBlockedUsers: async () => {
    const response = await api.get('/users/blocked');
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get('/users/payment-methods');
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (paymentData) => {
    const response = await api.post('/users/payment-methods', paymentData);
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (paymentMethodId) => {
    const response = await api.delete(`/users/payment-methods/${paymentMethodId}`);
    return response.data;
  },

  // Update account settings
  updateAccountSettings: async (settings) => {
    const response = await api.put('/users/account-settings', settings);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },

  // Deactivate account
  deactivateAccount: async (reason) => {
    const response = await api.post('/users/deactivate', { reason });
    return response.data;
  },

  // Get user stats
  getUserStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  },

  // Get user activity
  getUserActivity: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/activity`, { params });
    return response.data;
  },

  // Export user data
  exportUserData: async () => {
    const response = await api.get('/users/export-data');
    return response.data;
  },

  // Get notification settings
  getNotificationSettings: async () => {
    const response = await api.get('/users/notification-settings');
    return response.data;
  },

  // Update notification settings
  updateNotificationSettings: async (settings) => {
    const response = await api.put('/users/notification-settings', settings);
    return response.data;
  },

  // Get privacy settings
  getPrivacySettings: async () => {
    const response = await api.get('/users/privacy-settings');
    return response.data;
  },

  // Update privacy settings
  updatePrivacySettings: async (settings) => {
    const response = await api.put('/users/privacy-settings', settings);
    return response.data;
  },

  // Get connected accounts
  getConnectedAccounts: async () => {
    const response = await api.get('/users/connected-accounts');
    return response.data;
  },

  // Connect social account
  connectSocialAccount: async (platform, token) => {
    const response = await api.post('/users/connect-account', { platform, token });
    return response.data;
  },

  // Disconnect social account
  disconnectSocialAccount: async (platform) => {
    const response = await api.delete(`/users/connected-accounts/${platform}`);
    return response.data;
  },

  // Get subscription info
  getSubscriptionInfo: async () => {
    const response = await api.get('/users/subscription');
    return response.data;
  },

  // Update subscription
  updateSubscription: async (planId) => {
    const response = await api.put('/users/subscription', { planId });
    return response.data;
  },
};