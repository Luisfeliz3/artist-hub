import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// Async thunks
export const fetchAllArtists = createAsyncThunk(
  'artists/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/artists', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchArtistById = createAsyncThunk(
  'artists/fetchById',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/artists/${artistId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchArtistSocialStats = createAsyncThunk(
  'artists/fetchSocialStats',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/artists/${artistId}/social-stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchArtistProducts = createAsyncThunk(
  'artists/fetchProducts',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/artists/${artistId}/products`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchArtistPosts = createAsyncThunk(
  'artists/fetchPosts',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/artists/${artistId}/posts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const followArtist = createAsyncThunk(
  'artists/follow',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/artists/${artistId}/follow`);
      toast.success('Artist followed!');
      return response.data;
    } catch (error) {
      toast.error('Failed to follow artist');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unfollowArtist = createAsyncThunk(
  'artists/unfollow',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/artists/${artistId}/follow`);
      toast.success('Artist unfollowed');
      return response.data;
    } catch (error) {
      toast.error('Failed to unfollow artist');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchArtistAnalytics = createAsyncThunk(
  'artists/fetchAnalytics',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/artists/${artistId}/analytics`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncSocialMedia = createAsyncThunk(
  'artists/syncSocial',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/artists/${artistId}/sync-social`);
      toast.success('Social media synced successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to sync social media');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  artists: [],
  currentArtist: null,
  socialStats: {},
  products: {},
  posts: {},
  analytics: {},
  filters: {
    genre: [],
    location: '',
    sortBy: 'popular',
    verified: false,
  },
  pagination: {
    page: 1,
    totalPages: 1,
    totalArtists: 0,
    limit: 12,
  },
  isLoading: false,
  error: null,
  following: [],
  recentlyViewed: [],
};

// Create slice
const artistsSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    addToRecentlyViewed: (state, action) => {
      const artist = action.payload;
      const exists = state.recentlyViewed.find(a => a._id === artist._id);
      if (!exists) {
        state.recentlyViewed.unshift(artist);
        if (state.recentlyViewed.length > 5) {
          state.recentlyViewed.pop();
        }
      }
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all artists
      .addCase(fetchAllArtists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllArtists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artists = action.payload.artists;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllArtists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch artist by ID
      .addCase(fetchArtistById.fulfilled, (state, action) => {
        state.currentArtist = action.payload;
      })
      
      // Fetch artist social stats
      .addCase(fetchArtistSocialStats.fulfilled, (state, action) => {
        state.socialStats[action.meta.arg] = action.payload;
      })
      
      // Fetch artist products
      .addCase(fetchArtistProducts.fulfilled, (state, action) => {
        state.products[action.meta.arg] = action.payload;
      })
      
      // Fetch artist posts
      .addCase(fetchArtistPosts.fulfilled, (state, action) => {
        state.posts[action.meta.arg] = action.payload;
      })
      
      // Follow artist
      .addCase(followArtist.fulfilled, (state, action) => {
        const { artistId, followers } = action.payload;
        if (state.currentArtist?._id === artistId) {
          state.currentArtist.followers = followers;
          state.currentArtist.isFollowing = true;
        }
        const artistIndex = state.artists.findIndex(a => a._id === artistId);
        if (artistIndex !== -1) {
          state.artists[artistIndex].followers = followers;
          state.artists[artistIndex].isFollowing = true;
        }
        state.following.push(artistId);
      })
      
      // Unfollow artist
      .addCase(unfollowArtist.fulfilled, (state, action) => {
        const { artistId, followers } = action.payload;
        if (state.currentArtist?._id === artistId) {
          state.currentArtist.followers = followers;
          state.currentArtist.isFollowing = false;
        }
        const artistIndex = state.artists.findIndex(a => a._id === artistId);
        if (artistIndex !== -1) {
          state.artists[artistIndex].followers = followers;
          state.artists[artistIndex].isFollowing = false;
        }
        state.following = state.following.filter(id => id !== artistId);
      })
      
      // Fetch artist analytics
      .addCase(fetchArtistAnalytics.fulfilled, (state, action) => {
        state.analytics[action.meta.arg] = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSortBy,
  setPage,
  addToRecentlyViewed,
  clearRecentlyViewed,
  clearError,
} = artistsSlice.actions;

// Selectors
export const selectAllArtists = (state) => state.artists.artists;
export const selectCurrentArtist = (state) => state.artists.currentArtist;
export const selectArtistsLoading = (state) => state.artists.isLoading;
export const selectArtistsError = (state) => state.artists.error;
export const selectArtistsFilters = (state) => state.artists.filters;
export const selectArtistsPagination = (state) => state.artists.pagination;
export const selectArtistSocialStats = (artistId) => (state) => 
  state.artists.socialStats[artistId];
export const selectArtistProducts = (artistId) => (state) => 
  state.artists.products[artistId];
export const selectArtistPosts = (artistId) => (state) => 
  state.artists.posts[artistId];
export const selectArtistAnalytics = (artistId) => (state) => 
  state.artists.analytics[artistId];
export const selectIsFollowing = (artistId) => (state) => 
  state.artists.currentArtist?._id === artistId 
    ? state.artists.currentArtist.isFollowing 
    : state.artists.artists.find(a => a._id === artistId)?.isFollowing;
export const selectRecentlyViewedArtists = (state) => state.artists.recentlyViewed;

export default artistsSlice.reducer;