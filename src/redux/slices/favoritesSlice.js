import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/favorites');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/favorites/add', { productId });
      toast.success('Added to favorites!');
      return response.data;
    } catch (error) {
      toast.error('Failed to add to favorites');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/favorites/remove/${productId}`);
      toast.success('Removed from favorites');
      return productId;
    } catch (error) {
      toast.error('Failed to remove from favorites');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { favorites } = getState();
      const isFavorite = favorites.items.some(
        (item) => item._id === productId
      );
      
      if (isFavorite) {
        await api.delete(`/users/favorites/remove/${productId}`);
        toast.success('Removed from favorites');
        return { productId, action: 'remove' };
      } else {
        const response = await api.post('/users/favorites/add', { productId });
        toast.success('Added to favorites!');
        return { product: response.data, action: 'add' };
      }
    } catch (error) {
      toast.error('Failed to update favorites');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

// Create slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
    },
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      
      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      
      // Toggle favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (action.payload.action === 'add') {
          state.items.push(action.payload.product);
        } else {
          state.items = state.items.filter(
            (item) => item._id !== action.payload.productId
          );
        }
      });
  },
});

export const { clearFavorites, setFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesLoading = (state) => state.favorites.isLoading;
export const selectIsFavorite = (productId) => (state) =>
  state.favorites.items.some((item) => item._id === productId);
export const selectFavoritesCount = (state) => state.favorites.items.length;

export default favoritesSlice.reducer;