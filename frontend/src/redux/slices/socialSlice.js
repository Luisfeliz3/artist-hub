import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchSocialFeed = createAsyncThunk(
  'social/fetchFeed',
  async ({ page = 1, limit = 10, platform }, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (platform) params.platform = platform;
      
      const response = await api.get('/social', { params });
      return {
        posts: response.data,
        page,
        hasMore: response.data.length === limit,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'social/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.post('/social', postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'social/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/social/${postId}/like`);
      return { postId, likes: response.data.likes };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchArtistPosts = createAsyncThunk(
  'social/fetchArtistPosts',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/social/artist/${artistId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  feed: [],
  artistPosts: {},
  featuredPosts: [],
  currentPage: 1,
  hasMore: true,
  isLoading: false,
  error: null,
  platformFilter: null,
};

// Create slice
const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setPlatformFilter: (state, action) => {
      state.platformFilter = action.payload;
      state.currentPage = 1;
      state.feed = [];
      state.hasMore = true;
    },
    clearPlatformFilter: (state) => {
      state.platformFilter = null;
      state.currentPage = 1;
      state.feed = [];
      state.hasMore = true;
    },
    addNewPost: (state, action) => {
      state.feed.unshift(action.payload);
    },
    updatePostLikes: (state, action) => {
      const { postId, likes } = action.payload;
      const post = state.feed.find((p) => p._id === postId);
      if (post) {
        post.metadata.likes = likes;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch social feed
      .addCase(fetchSocialFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSocialFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.page === 1) {
          state.feed = action.payload.posts;
        } else {
          state.feed = [...state.feed, ...action.payload.posts];
        }
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchSocialFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.feed.unshift(action.payload);
      })
      
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.feed.find((p) => p._id === action.payload.postId);
        if (post) {
          post.metadata.likes = action.payload.likes;
        }
      })
      
      // Fetch artist posts
      .addCase(fetchArtistPosts.fulfilled, (state, action) => {
        state.artistPosts[action.meta.arg] = action.payload;
      });
  },
});

export const {
  setPlatformFilter,
  clearPlatformFilter,
  addNewPost,
  updatePostLikes,
} = socialSlice.actions;

// Selectors
export const selectSocialFeed = (state) => state.social.feed;
export const selectFeaturedPosts = (state) =>
  state.social.feed.filter((post) => post.featured);
export const selectPlatformFilter = (state) => state.social.platformFilter;
export const selectSocialLoading = (state) => state.social.isLoading;
export const selectHasMorePosts = (state) => state.social.hasMore;
export const selectArtistPosts = (artistId) => (state) =>
  state.social.artistPosts[artistId] || [];

export default socialSlice.reducer;