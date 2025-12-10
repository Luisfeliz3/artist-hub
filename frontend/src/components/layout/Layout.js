import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Container,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  MusicNote,
  ShoppingBag,
  Feed,
  AccountCircle,
  ExitToApp,
  Dashboard,
  Search,
  Notifications,
  Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logoutUser,
  selectIsArtist,
} from '../../redux/slices/authSlice';
import {
  selectCartTotalItems,
  
} from '../../redux/slices/cartSlice';
import {
  
  selectFavoritesCount,
} from '../../redux/slices/favoritesSlice';
import { fetchCart } from '../../redux/slices/cartSlice';
import { fetchFavorites } from '../../redux/slices/favoritesSlice';

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
 
  
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isArtist = useSelector(selectIsArtist);
  const cartItemsCount = useSelector(selectCartTotalItems);
  const favoritesCount = useSelector(selectFavoritesCount);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchCart());
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, user, dispatch]);

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Music', icon: <MusicNote />, path: '/music' },
    { text: 'Shop', icon: <ShoppingBag />, path: '/shop' },
    { text: 'Social Feed', icon: <Feed />, path: '/feed' },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleMenuClose();
    navigate('/login');
  };

  const NavigationDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)',
          width: 280,
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" className="gradient-text" sx={{ mb: 4 }}>
          ArtistHub
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              sx={{
                mb: 1,
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(138, 43, 226, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(20, 20, 32, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Left Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography
                variant="h5"
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                className="gradient-text"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                ArtistHub
              </Typography>
            </Box>

            {/* Center Section - Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        background: 'rgba(138, 43, 226, 0.1)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit">
                <Search />
              </IconButton>
              <IconButton 
                color="inherit"
                onClick={() => navigate('/favorites')}
              >
                <Badge badgeContent={favoritesCount} color="error">
                  <Favorite />
                </Badge>
              </IconButton>
              <IconButton 
                color="inherit"
                onClick={() => navigate('/cart')}
              >
                <Badge badgeContent={cartItemsCount} color="error">
                  <ShoppingBag />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={5} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {isAuthenticated ? (
                <>
                  <IconButton onClick={handleMenuOpen}>
                    <Avatar
                      src={user?.profileImage}
                      sx={{ width: 32, height: 32 }}
                    >
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{
                      '& .MuiPaper-root': {
                        background: '#1A1A2E',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <MenuItem onClick={() => navigate('/dashboard')}>
                      <ListItemIcon>
                        <Dashboard fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                    {isArtist && (
                      <MenuItem onClick={() => navigate('/artist/dashboard')}>
                        <ListItemIcon>
                          <AccountCircle fontSize="small" />
                        </ListItemIcon>
                        Artist Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => navigate('/profile')}>
                      <ListItemIcon>
                        <AccountCircle fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <ExitToApp fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <NavigationDrawer />

      <Box component="main" sx={{ pt: { xs: 8, sm: 10 } }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;