import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchSpotifyArtist = createAsyncThunk(
  'music/fetchSpotifyArtist',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/music/spotify/artist/${artistId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchMusic = createAsyncThunk(
  'music/search',
  async ({ query, type = 'artist' }, { rejectWithValue }) => {
    try {
      const response = await api.get('/music/search', { params: { query, type } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchArtistProducts = createAsyncThunk(
  'music/fetchArtistProducts',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/music/artist/${artistId}/products`);
      return { artistId, products: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  spotifyArtists: {},
  searchResults: [],
  artistProducts: {},
  currentArtist: null,
  isLoading: false,
  error: null,
  player: {
    currentTrack: null,
    isPlaying: false,
    volume: 0.8,
    progress: 0,
  },
};

// Create slice
const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.player.currentTrack = action.payload;
      state.player.isPlaying = true;
    },
    togglePlay: (state) => {
      state.player.isPlaying = !state.player.isPlaying;
    },
    setVolume: (state, action) => {
      state.player.volume = action.payload;
    },
    setProgress: (state, action) => {
      state.player.progress = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setCurrentArtist: (state, action) => {
      state.currentArtist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Spotify artist
      .addCase(fetchSpotifyArtist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSpotifyArtist.fulfilled, (state, action) => {
        state.isLoading = false;
        const { artist } = action.payload;
        state.spotifyArtists[artist.id] = action.payload;
        state.currentArtist = artist.id;
      })
      .addCase(fetchSpotifyArtist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Search music
      .addCase(searchMusic.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchMusic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMusic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch artist products
      .addCase(fetchArtistProducts.fulfilled, (state, action) => {
        state.artistProducts[action.payload.artistId] = action.payload.products;
      });
  },
});

export const {
  setCurrentTrack,
  togglePlay,
  setVolume,
  setProgress,
  clearSearchResults,
  setCurrentArtist,
} = musicSlice.actions;

// Selectors
export const selectCurrentArtistData = (artistId) => (state) =>
  state.music.spotifyArtists[artistId];
export const selectSearchResults = (state) => state.music.searchResults;
export const selectArtistProducts = (artistId) => (state) =>
  state.music.artistProducts[artistId] || [];
export const selectMusicLoading = (state) => state.music.isLoading;
export const selectPlayerState = (state) => state.music.player;
export const selectCurrentTrack = (state) => state.music.player.currentTrack;
export const selectIsPlaying = (state) => state.music.player.isPlaying;

export default musicSlice.reducer;