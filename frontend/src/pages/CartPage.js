import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Divider,
  Paper,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Payment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartTotalPrice,
  removeFromCart,
  updateCartItem,
  clearCart,
  fetchCart,
} from '../redux/slices/cartSlice';
import { useCart } from '../hooks/useCart';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useCart();

  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateCartItem({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            borderRadius: 4,
            background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Add some products to get started!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/shop')}
            sx={{
              background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Items ({items.length})</Typography>
              <Button
                color="error"
                startIcon={<Delete />}
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {items.map((item, index) => (
              <motion.div
                key={item.product?._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    mb: 2,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <CardMedia
                          component="img"
                          image={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                          alt={item.product?.name}
                          sx={{
                            borderRadius: 2,
                            height: 100,
                            objectFit: 'cover',
                          }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="h6" gutterBottom>
                          {item.product?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.product?.artist?.username}
                        </Typography>
                        {item.variant && (
                          <Typography variant="caption" color="primary">
                            {item.variant.name}: {item.variant.option}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                item.product?._id,
                                item.quantity - 1
                              )
                            }
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            size="small"
                            sx={{
                              width: 60,
                              mx: 1,
                              '& .MuiInputBase-root': {
                                height: 40,
                              },
                            }}
                            inputProps={{
                              style: { textAlign: 'center' },
                            }}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.product?._id,
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                item.product?._id,
                                item.quantity + 1
                              )
                            }
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={2} sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" color="primary.main">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.product?._id)}
                          sx={{ mt: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'sticky',
              top: 100,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>

            <Box sx={{ my: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>${totalPrice.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography color="text.secondary">Shipping</Typography>
                <Typography>$5.99</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography color="text.secondary">Tax</Typography>
                <Typography>${(totalPrice * 0.08).toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary.main">
                  ${(totalPrice + 5.99 + totalPrice * 0.08).toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Payment />}
              onClick={handleCheckout}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7B1FA2, #0099CC)',
                },
              }}
            >
              Proceed to Checkout
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/shop')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              Continue Shopping
            </Button>

            <Box sx={{ mt: 3, p: 2, background: 'rgba(0,212,255,0.1)', borderRadius: 2 }}>
              <LocalShipping fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="caption">
                Free shipping on orders over $100
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;