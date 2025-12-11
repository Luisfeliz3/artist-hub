import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/profile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', profileData);
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update profile');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'profile/uploadProfileImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post('/users/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile image updated!');
      return response.data;
    } catch (error) {
      toast.error('Failed to upload image');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFollowers = createAsyncThunk(
  'profile/fetchFollowers',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/followers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  'profile/fetchFollowing',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/following`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const followUser = createAsyncThunk(
  'profile/followUser',
  async (targetUserId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${targetUserId}/follow`);
      toast.success('User followed!');
      return response.data;
    } catch (error) {
      toast.error('Failed to follow user');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'profile/unfollowUser',
  async (targetUserId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/users/${targetUserId}/follow`);
      toast.success('User unfollowed');
      return response.data;
    } catch (error) {
      toast.error('Failed to unfollow user');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFollower = createAsyncThunk(
  'profile/removeFollower',
  async (followerId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/users/followers/${followerId}`);
      toast.success('Follower removed');
      return response.data;
    } catch (error) {
      toast.error('Failed to remove follower');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const blockUser = createAsyncThunk(
  'profile/blockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/block/${userId}`);
      toast.success('User blocked');
      return response.data;
    } catch (error) {
      toast.error('Failed to block user');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unblockUser = createAsyncThunk(
  'profile/unblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/users/block/${userId}`);
      toast.success('User unblocked');
      return response.data;
    } catch (error) {
      toast.error('Failed to unblock user');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'profile/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/payment-methods');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addPaymentMethod = createAsyncThunk(
  'profile/addPaymentMethod',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/payment-methods', paymentData);
      toast.success('Payment method added!');
      return response.data;
    } catch (error) {
      toast.error('Failed to add payment method');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  'profile/deletePaymentMethod',
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/payment-methods/${paymentMethodId}`);
      toast.success('Payment method removed');
      return paymentMethodId;
    } catch (error) {
      toast.error('Failed to remove payment method');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAccountSettings = createAsyncThunk(
  'profile/updateAccountSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/account-settings', settings);
      toast.success('Account settings updated!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update settings');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/change-password', passwordData);
      toast.success('Password changed successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to change password');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deactivateAccount = createAsyncThunk(
  'profile/deactivateAccount',
  async (reason, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/deactivate', { reason });
      toast.success('Account deactivated');
      return response.data;
    } catch (error) {
      toast.error('Failed to deactivate account');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'profile/fetchUserStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserActivity = createAsyncThunk(
  'profile/fetchUserActivity',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/activity`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  userProfile: null,
  followers: [],
  following: [],
  blockedUsers: [],
  paymentMethods: [],
  userStats: null,
  userActivity: [],
  isLoading: false,
  error: null,
  activeTab: 'overview',
  editMode: false,
};

// Create slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleEditMode: (state) => {
      state.editMode = !state.editMode;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    updateLocalProfile: (state, action) => {
      if (state.userProfile) {
        state.userProfile = { ...state.userProfile, ...action.payload };
      }
    },
    clearProfile: (state) => {
      state.userProfile = null;
      state.followers = [];
      state.following = [];
      state.blockedUsers = [];
      state.paymentMethods = [];
      state.userStats = null;
      state.userActivity = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userProfile = { ...state.userProfile, ...action.payload };
        state.editMode = false;
      })
      
      // Upload profile image
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.userProfile) {
          state.userProfile.profileImage = action.payload.imageUrl;
        }
      })
      
      // Fetch followers
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      
      // Fetch following
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      })
      
      // Follow user
      .addCase(followUser.fulfilled, (state, action) => {
        const { targetUserId } = action.payload;
        // Add to following list
        if (!state.following.some(user => user._id === targetUserId)) {
          // You would fetch the user details here
          state.following.push({ _id: targetUserId, isFollowing: true });
        }
      })
      
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { targetUserId } = action.payload;
        state.following = state.following.filter(user => user._id !== targetUserId);
      })
      
      // Remove follower
      .addCase(removeFollower.fulfilled, (state, action) => {
        const { followerId } = action.payload;
        state.followers = state.followers.filter(user => user._id !== followerId);
      })
      
      // Fetch payment methods
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
      })
      
      // Add payment method
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods.push(action.payload);
      })
      
      // Delete payment method
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods = state.paymentMethods.filter(
          method => method._id !== action.payload
        );
      })
      
      // Fetch user stats
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStats = action.payload;
      })
      
      // Fetch user activity
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.userActivity = action.payload;
      });
  },
});

export const {
  setActiveTab,
  toggleEditMode,
  setEditMode,
  updateLocalProfile,
  clearProfile,
} = profileSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.profile.userProfile;
export const selectProfileLoading = (state) => state.profile.isLoading;
export const selectProfileError = (state) => state.profile.error;
export const selectFollowers = (state) => state.profile.followers;
export const selectFollowing = (state) => state.profile.following;
export const selectBlockedUsers = (state) => state.profile.blockedUsers;
export const selectPaymentMethods = (state) => state.profile.paymentMethods;
export const selectUserStats = (state) => state.profile.userStats;
export const selectUserActivity = (state) => state.profile.userActivity;
export const selectActiveTab = (state) => state.profile.activeTab;
export const selectEditMode = (state) => state.profile.editMode;
export const selectIsFollowing = (userId) => (state) => state.profile.following.some(user => user._id === userId);

export default profileSlice.reducer;