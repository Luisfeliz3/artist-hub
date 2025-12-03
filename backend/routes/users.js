const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured artists
router.get('/featured-artists', async (req, res) => {
  try {
    const artists = await User.find({ 
      role: 'artist',
      'artistProfile.genre': { $exists: true, $ne: [] }
    })
      .select('username profileImage artistProfile followers')
      .sort({ followers: -1 })
      .limit(6);

    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured artists', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, email, profileImage } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update artist profile
router.put('/artist-profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can update artist profile' });
    }

    user.artistProfile = {
      ...user.artistProfile,
      ...req.body,
    };

    await user.save();
    res.json(user.artistProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cart endpoints
router.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('cart.product')
      .select('cart');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/cart/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;
    
    const user = await User.findById(req.userId);
    const product = await Product.findById(productId);
    
    if (!user || !product) {
      return res.status(404).json({ message: 'User or product not found' });
    }

    // Check if product is already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      user.cart[existingItemIndex].quantity += quantity;
      if (variant) {
        user.cart[existingItemIndex].variant = variant;
      }
    } else {
      // Add new item
      user.cart.push({
        product: productId,
        quantity,
        variant,
      });
    }

    await user.save();
    
    // Populate product details
    await user.populate('cart.product');
    const addedItem = user.cart.find(item => item.product._id.toString() === productId);
    
    res.json(addedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/cart/remove/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = user.cart.filter(
      item => item.product.toString() !== req.params.productId
    );

    await user.save();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/cart/update/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === req.params.productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    user.cart[itemIndex].quantity = quantity;
    await user.save();
    
    await user.populate('cart.product');
    res.json(user.cart[itemIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/cart/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = [];
    await user.save();
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Favorites endpoints
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('favorites')
      .select('favorites');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/favorites/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    const user = await User.findById(req.userId);
    const product = await Product.findById(productId);
    
    if (!user || !product) {
      return res.status(404).json({ message: 'User or product not found' });
    }

    // Check if already favorited
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/favorites/remove/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.productId
    );

    await user.save();
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'cart.product',
        select: 'price'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalSpent = user.cart.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    const stats = {
      totalOrders: user.cart.length,
      totalSpent,
      favoriteArtists: new Set(user.cart.map(item => item.product?.artist)).size,
      followers: 0, // You would track followers separately
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;