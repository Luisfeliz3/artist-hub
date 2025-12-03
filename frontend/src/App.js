import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { checkAuthStatus } from './utils/debugAuth';
// Layout Components
import Layout from './components/layout/Layout';

// Page Components
import HomePage from './pages/HomePage';
// import ArtistProfile from './pages/ArtistProfile';
// import ShopPage from './pages/ShopPage';
// import MusicPage from './pages/MusicPage';
// import SocialFeed from './pages/SocialFeed';
import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import CheckoutPage from './pages/CheckoutPage';
// import DashboardPage from './pages/DashboardPage';
// import CartPage from './pages/CartPage';
// import ProfilePage from './pages/ProfilePage';

// Redux
import { fetchCurrentUser, selectIsAuthenticated, selectAuthLoading } from './redux/slices/authSlice';

// Protected Route Component with auto-login
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const location = useLocation();

  useEffect(() => {
    // Try to fetch current user on mount for protected routes
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated && !isLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  // In useEffect or componentDidMount
useEffect(() => {
  console.log('Checking auth status...');
  checkAuthStatus();
}, []);


  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0A0A0F'
      }}>
        <div className="gradient-text" style={{ fontSize: '24px' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Auth Route Component (for login/register when already authenticated)
const AuthRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to home or previous location
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

function AppRoutes() {
  const dispatch = useDispatch();

  // Try to restore authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* <Route path="artist/:id" element={<ArtistProfile />} /> */}
        {/* <Route path="shop" element={<ShopPage />} /> */}
        {/* <Route path="music" element={<MusicPage />} /> */}
        {/* <Route path="feed" element={<SocialFeed />} /> */}
        {/* <Route path="cart" element={<CartPage />} /> */}
        
        {/* Auth Routes */}
        <Route path="login" element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        } />
        <Route path="register" element={
          <AuthRoute>
            {/* <RegisterPage /> */}
          </AuthRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="checkout" element={
          <ProtectedRoute>
            {/* <CheckoutPage /> */}
          </ProtectedRoute>
        } />
        <Route path="dashboard/*" element={
          <ProtectedRoute>
            {/* <DashboardPage /> */}
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            {/* <ProfilePage /> */}
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A1A2E',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
          <AppRoutes />
        </PersistGate>
      </Provider>
    </Router>
  );
}

export default App;