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
    const user = await User.findById(req._id)
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







// Get user profile by ID
router.get('/:userId/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate stats
    const [followerCount, followingCount, postCount, orderCount] = await Promise.all([
      User.countDocuments({ following: user._id }),
      user.following.length,
      SocialPost.countDocuments({ artist: user._id }),
      Order.countDocuments({ user: user._id }),
    ]);

    const userData = user.toObject();
    userData.stats = {
      followers: followerCount,
      following: followingCount,
      posts: postCount,
      orders: orderCount,
      engagement: Math.floor(Math.random() * 100), // Mock engagement score
      revenue: orderCount * 50, // Mock revenue
    };

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Get user followers
router.get('/:userId/followers', async (req, res) => {
  try {
    const followers = await User.find({ following: req.params.userId })
      .select('username profileImage bio role isVerified')
      .limit(50);

    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching followers', error: error.message });
  }
});

// Get user following
router.get('/:userId/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('following').populate('following', 'username profileImage bio role isVerified');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching following', error: error.message });
  }
});

// Remove follower
router.delete('/followers/:followerId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const follower = await User.findById(req.params.followerId);

    if (!follower) {
      return res.status(404).json({ message: 'Follower not found' });
    }

    // Remove from user's followers
    await User.findByIdAndUpdate(req.userId, {
      $pull: { followers: follower._id }
    });

    // Remove from follower's following
    await User.findByIdAndUpdate(follower._id, {
      $pull: { following: req.userId }
    });

    res.json({ followerId: follower._id });
  } catch (error) {
    res.status(500).json({ message: 'Error removing follower', error: error.message });
  }
});

// Block user
router.post('/block/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const userToBlock = await User.findById(req.params.userId);

    if (!userToBlock) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.blockedUsers.includes(userToBlock._id)) {
      user.blockedUsers.push(userToBlock._id);
      await user.save();
    }

    res.json({ userId: userToBlock._id });
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user', error: error.message });
  }
});

// Unblock user
router.delete('/block/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== req.params.userId);
    await user.save();

    res.json({ userId: req.params.userId });
  } catch (error) {
    res.status(500).json({ message: 'Error unblocking user', error: error.message });
  }
});

// Get blocked users
router.get('/blocked', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('blockedUsers', 'username profileImage');
    res.json(user.blockedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blocked users', error: error.message });
  }
});

// Payment methods
router.get('/payment-methods', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('paymentMethods');
    res.json(user.paymentMethods || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment methods', error: error.message });
  }
});

router.post('/payment-methods', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const paymentMethod = req.body;

    if (!user.paymentMethods) {
      user.paymentMethods = [];
    }

    user.paymentMethods.push(paymentMethod);
    await user.save();

    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ message: 'Error adding payment method', error: error.message });
  }
});

router.delete('/payment-methods/:methodId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.paymentMethods) {
      user.paymentMethods = user.paymentMethods.filter(
        method => method._id.toString() !== req.params.methodId
      );
      await user.save();
    }

    res.json({ message: 'Payment method removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing payment method', error: error.message });
  }
});

// Account settings
router.put('/account-settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Update settings
    if (req.body.privacy) user.privacy = req.body.privacy;
    if (req.body.notifications) user.notifications = req.body.notifications;
    if (req.body.language) user.language = req.body.language;
    if (req.body.theme) user.theme = req.body.theme;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

// Deactivate account
router.post('/deactivate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.isActive = false;
    user.deactivatedAt = new Date();
    user.deactivationReason = req.body.reason;
    
    await user.save();
    res.json({ message: 'Account deactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating account', error: error.message });
  }
});

// Get user stats
router.get('/:userId/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [followers, following, posts, orders, reviews] = await Promise.all([
      User.countDocuments({ following: user._id }),
      user.following.length,
      SocialPost.countDocuments({ artist: user._id }),
      Order.countDocuments({ user: user._id }),
      0, // Review count would come from reviews collection
    ]);

    res.json({
      followers,
      following,
      posts,
      orders,
      reviews,
      avgRating: 4.5, // Mock rating
      engagement: Math.floor(Math.random() * 100),
      revenue: orders * 50,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stats', error: error.message });
  }
});

// Get user activity
router.get('/:userId/activity', auth, async (req, res) => {
  try {
    // Mock activity data
    const activities = [
      {
        type: 'purchase',
        description: 'Purchased "Neon Dreams" album',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        type: 'follow',
        description: 'Started following Nova Rhythm',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
      {
        type: 'like',
        description: 'Liked a post by Luna Waves',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        type: 'review',
        description: 'Left a 5-star review for Echo Theory',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
    ];

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity', error: error.message });
  }
});

// Upload profile image
router.post('/upload-profile-image', auth, async (req, res) => {
  try {
    // In production, you would upload to cloud storage
    // For now, mock the response
    const imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(req.user.username)}&background=8A2BE2&color=fff&size=400`;
    
    const user = await User.findById(req.userId);
    user.profileImage = imageUrl;
    await user.save();

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

module.exports = router;
