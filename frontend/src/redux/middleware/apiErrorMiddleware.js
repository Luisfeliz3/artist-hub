import { isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { clearCredentials } from '../slices/authSlice';

export const apiErrorMiddleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload;
    
    // Handle 401 Unauthorized errors
    if (error?.status === 401 || error?.message?.includes('authenticate')) {
      store.dispatch(clearCredentials());
      toast.error('Session expired. Please login again.');
    }
    
    // Handle other errors
    else if (error?.message) {
      toast.error(error.message);
    }
  }

  return next(action);
};

// Add this middleware to your store configuration