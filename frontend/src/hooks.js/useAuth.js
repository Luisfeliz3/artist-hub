import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsArtist,
  selectIsAdmin,
  logoutUser,
  fetchCurrentUser,
} from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isArtist = useSelector(selectIsArtist);
  const isAdmin = useSelector(selectIsAdmin);
  
  const logout = () => dispatch(logoutUser());
  const refreshUser = () => dispatch(fetchCurrentUser());
  
  return {
    user,
    isAuthenticated,
    isArtist,
    isAdmin,
    logout,
    refreshUser,
  };
};