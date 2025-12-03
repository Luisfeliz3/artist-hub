import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  MoreVert,
  Share,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { selectIsFavorite } from '../../redux/slices/favoritesSlice';

const ProductCard = ({ product }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isFavorite = useSelector(selectIsFavorite(product._id));

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(product._id));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({
      productId: product._id,
      quantity: 1,
      variant: selectedVariant,
    }));
  };

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    }
    handleMenuClose();
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        onClick={handleViewDetails}
        sx={{
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        {/* Favorite button */}
        <IconButton
          onClick={handleFavoriteToggle}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            background: 'rgba(0, 0, 0, 0.6)',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        >
          {isFavorite ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder color="inherit" />
          )}
        </IconButton>

        {/* More options menu */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            position: 'absolute',
            top: 8,
            right: 48,
            zIndex: 2,
            background: 'rgba(0, 0, 0, 0.6)',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        >
          <MoreVert />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleShare}>
            <Share fontSize="small" sx={{ mr: 1 }} />
            Share
          </MenuItem>
        </Menu>

        {/* Product image */}
        <CardMedia
          component="img"
          height="200"
          image={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Chip
              label={product.category}
              size="small"
              color="primary"
              variant="outlined"
            />
            {product.featured && (
              <Chip
                label="Featured"
                size="small"
                color="secondary"
              />
            )}
          </Box>

          <Typography variant="h6" gutterBottom noWrap>
            {product.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              by
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {product.artist?.username}
            </Typography>
          </Box>

          {product.variants?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Options:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.variants[0].options?.map((option, idx) => (
                  <Chip
                    key={idx}
                    label={option.value}
                    size="small"
                    variant={selectedVariant?.option === option.value ? 'filled' : 'outlined'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariant({
                        name: product.variants[0].name,
                        option: option.value,
                      });
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary.main">
              ${product.price.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {product.stats && (
                <>
                  <Typography variant="caption" color="text.secondary">
                    👁️ {product.stats.views}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ❤️ {product.stats.likes}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            sx={{
              background: 'linear-gradient(45deg, #8A2BE2 30%, #00D4FF 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7B1FA2 30%, #0099CC 90%)',
              },
            }}
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default ProductCard;