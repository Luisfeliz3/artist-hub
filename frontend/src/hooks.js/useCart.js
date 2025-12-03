import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  fetchCart,
} from '../redux/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  
  const addItem = (productId, quantity = 1, variant = null) =>
    dispatch(addToCart({ productId, quantity, variant }));
  
  const removeItem = (productId) => dispatch(removeFromCart(productId));
  
  const updateItem = (productId, quantity) =>
    dispatch(updateCartItem({ productId, quantity }));
  
  const clearAll = () => dispatch(clearCart());
  
  const refreshCart = () => dispatch(fetchCart());
  
  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateItem,
    clearAll,
    refreshCart,
  };
};