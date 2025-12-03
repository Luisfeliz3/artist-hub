import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Email,
  Lock,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  loginUser,
  loginWithGoogle,
  selectAuthLoading,
  selectAuthError,
} from '../redux/slices/authSlice';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

    const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  

    // Test credentials for easy testing
  const fillTestCredentials = () => {
    setFormData({
      email: 'admin@artisthub.com',
      password: 'password123'
    });
  };

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: { xs: 3, sm: 6 },
              borderRadius: 4,
              background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h3" className="gradient-text" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your ArtistHub account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error.message || 'Login Failed'}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                  value={formData.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                value={formData.password}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

                  <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Button
              onClick={fillTestCredentials}
              variant="outlined"
              size="small"
              color="secondary"
            >
              Fill Test Credentials
            </Button>
          </Box>

              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ '&:hover': { textDecoration: 'underline' } }}
                  >
                    Forgot password?
                  </Typography>
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7B1FA2, #0099CC)',
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
          
          </Box>
            <Divider sx={{ my: 3, color: 'text.secondary' }}>
              <Typography variant="body2" color="text.secondary">
                OR CONTINUE WITH
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  borderColor: 'primary.main',
                  background: 'rgba(138, 43, 226, 0.1)',
                },
              }}
            >
              Sign in with Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Typography
                    component="span"
                    color="primary.main"
                    sx={{ fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                  >
                    Sign up
                  </Typography>
                </Link>
              </Typography>
            </Box>
     
            <Alert severity="info" sx={{ mt: 3, background: 'rgba(0,212,255,0.1)' }}>
              <Typography variant="body2">
                Demo accounts are available. Try email: admin@artisthub.com, password: password123
              </Typography>
            </Alert>
            
          </Paper>
          
        </motion.div>
      </Box>

       
    </Container>
  );
};

export default LoginPage;