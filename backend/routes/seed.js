const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const SocialPost = require('../models/SocialPost');
const Order = require('../models/Order');

// Get seeding stats
router.get('/stats', async (req, res) => {
  try {
    const [
      userCount,
      artistCount,
      productCount,
      postCount,
      orderCount
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'artist' }),
      Product.countDocuments(),
      SocialPost.countDocuments(),
      Order.countDocuments()
    ]);

    res.json({
      users: userCount,
      artists: artistCount,
      products: productCount,
      socialPosts: postCount,
      orders: orderCount,
      total: userCount + artistCount + productCount + postCount + orderCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting stats', error: error.message });
  }
});

// Get sample data
router.get('/sample', async (req, res) => {
  try {
    const [
      sampleArtist,
      sampleProduct,
      samplePost,
      sampleOrder
    ] = await Promise.all([
      User.findOne({ role: 'artist' }).select('-password'),
      Product.findOne().populate('artist', 'username'),
      SocialPost.findOne().populate('artist', 'username'),
      Order.findOne().populate('user', 'username').populate('items.product', 'name')
    ]);

    res.json({
      artist: sampleArtist,
      product: sampleProduct,
      socialPost: samplePost,
      order: sampleOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting sample data', error: error.message });
  }
});

module.exports = router;