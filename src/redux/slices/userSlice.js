import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', userData);
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateArtistProfile = createAsyncThunk(
  'user/updateArtistProfile',
  async (artistData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/artist-profile', artistData);
      toast.success('Artist profile updated!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post('/users/upload-image', formData, {
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

export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  artistProfile: null,
  stats: {
    totalOrders: 0,
    totalSpent: 0,
    favoriteArtists: 0,
    followers: 0,
  },
  isLoading: false,
  error: null,
};

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      if (action.payload.artistProfile) {
        state.artistProfile = action.payload.artistProfile;
      }
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.artistProfile = null;
      state.stats = initialState.stats;
    },
    updateLocalProfile: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update artist profile
      .addCase(updateArtistProfile.fulfilled, (state, action) => {
        state.artistProfile = { ...state.artistProfile, ...action.payload };
      })
      
      // Upload profile image
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.profileImage = action.payload.imageUrl;
        }
      })
      
      // Fetch user stats
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setUserProfile, clearUserProfile, updateLocalProfile } = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectArtistProfile = (state) => state.user.artistProfile;
export const selectUserStats = (state) => state.user.stats;
export const selectIsArtistUser = (state) => !!state.user.artistProfile;
export const selectUserLoading = (state) => state.user.isLoading;

export default userSlice.reducer;