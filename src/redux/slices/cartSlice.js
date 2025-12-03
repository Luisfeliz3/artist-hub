import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1, variant }, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/cart/add', {
        productId,
        quantity,
        variant,
      });
      toast.success('Added to cart!');
      return response.data;
    } catch (error) {
      toast.error('Failed to add to cart');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/cart/remove/${productId}`);
      toast.success('Removed from cart');
      return productId;
    } catch (error) {
      toast.error('Failed to remove from cart');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/cart/update/${productId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to update cart');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/users/cart/clear');
      toast.success('Cart cleared');
      return [];
    } catch (error) {
      toast.error('Failed to clear cart');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// Helper functions
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

// Create slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartTotals: (state) => {
      const { totalItems, totalPrice } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
      const { totalItems, totalPrice } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        const { totalItems, totalPrice } = calculateTotals(state.items);
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to cart
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItemIndex = state.items.findIndex(
          (item) => item.product?._id === action.payload.product
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          state.items[existingItemIndex].quantity += action.payload.quantity;
        } else {
          // Add new item
          state.items.push(action.payload);
        }
        
        const { totalItems, totalPrice } = calculateTotals(state.items);
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
      })
      
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.product?._id !== action.payload
        );
        const { totalItems, totalPrice } = calculateTotals(state.items);
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
      })
      
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const itemIndex = state.items.findIndex(
          (item) => item.product?._id === action.payload.product
        );
        
        if (itemIndex >= 0) {
          state.items[itemIndex].quantity = action.payload.quantity;
        }
        
        const { totalItems, totalPrice } = calculateTotals(state.items);
        state.totalItems = totalItems;
        state.totalPrice = totalPrice;
      })
      
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  },
});

export const { updateCartTotals, setCartItems } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectCartItemById = (productId) => (state) =>
  state.cart.items.find((item) => item.product?._id === productId);

export default cartSlice.reducer;