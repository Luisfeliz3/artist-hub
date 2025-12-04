import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';

// Import reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import socialReducer from './slices/socialSlice';
import musicReducer from './slices/musicSlice';
import productReducer from './slices/productSlice';


import { apiErrorMiddleware } from './middleware/apiErrorMiddleware';
import artistsReducer from './slices/artistsSlice';



// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'cart', 'favorites'], // Only persist these slices
  blacklist: ['music', 'social', 'products'], // Don't persist these
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
  social: socialReducer,
  music: musicReducer,
  artists: artistsReducer,
  products: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(logger, apiErrorMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});






export const persistor = persistStore(store);
export default store;