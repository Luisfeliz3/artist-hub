import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/google',
  async (_, { rejectWithValue }) => {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/auth/google`;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await api.get('/auth/me');
      const user = response.data;
      
      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      // Clear invalid token
      authService.logout();
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user' });
    }
  }
);

// Initial state - load from localStorage if available
const getInitialState = () => {
  const token = authService.getToken();
  const user = authService.getCurrentUser();
  
  return {
    user: user,
    token: token,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
    isArtist: user?.role === 'artist',
    isAdmin: user?.role === 'admin',
  };
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isArtist = user?.role === 'artist';
      state.isAdmin = user?.role === 'admin';
      
      // Update localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isArtist = false;
      state.isAdmin = false;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isArtist = action.payload.user.role === 'artist';
        state.isAdmin = action.payload.user.role === 'admin';
        toast.success('Registration successful!');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || 'Registration failed');
      })
      
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isArtist = action.payload.user.role === 'artist';
        state.isAdmin = action.payload.user.role === 'admin';
        toast.success('Login successful!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || 'Login failed');
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isArtist = false;
        state.isAdmin = false;
        toast.success('Logged out successfully');
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still clear state even if logout API fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isArtist = false;
        state.isAdmin = false;
        toast.success('Logged out');
      })
      
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isArtist = action.payload.role === 'artist';
        state.isAdmin = action.payload.role === 'admin';
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isArtist = false;
        state.isAdmin = false;
      });
  },
});

export const { setCredentials, clearCredentials, clearError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsArtist = (state) => state.auth.isArtist;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;