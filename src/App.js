import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './services/contexts/AuthContext';

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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            {/* <Route path="artist/:id" element={<ArtistProfile />} /> */}
            {/* <Route path="shop" element={<ShopPage />} /> */}
            {/* <Route path="music" element={<MusicPage />} /> */}
            {/* <Route path="feed" element={<SocialFeed />} /> */}
            <Route path="login" element={<LoginPage />} />
            {/* <Route path="register" element={<RegisterPage />} /> */}
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  {/* <CheckoutPage /> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard/*"
              element={
                <ProtectedRoute>
                  {/* <DashboardPage /> */}
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;