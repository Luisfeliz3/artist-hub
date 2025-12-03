import { useSelector, useDispatch } from 'react-redux';
import {
  selectFavorites,
  selectFavoritesCount,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  fetchFavorites,
  selectIsFavorite,
} from '../redux/slices/favoritesSlice';

export const useFavorites = () => {
  const dispatch = useDispatch();
  
  const favorites = useSelector(selectFavorites);
  const favoritesCount = useSelector(selectFavoritesCount);
  
  const addFavorite = (productId) => dispatch(addToFavorites(productId));
  
  const removeFavorite = (productId) => dispatch(removeFromFavorites(productId));
  
  const toggleFavoriteItem = (productId) => dispatch(toggleFavorite(productId));
  
  const refreshFavorites = () => dispatch(fetchFavorites());
  
  const isFavorite = (productId) => dispatch(selectIsFavorite(productId));
  
  return {
    favorites,
    favoritesCount,
    addFavorite,
    removeFavorite,
    toggleFavoriteItem,
    refreshFavorites,
    isFavorite,
  };
};