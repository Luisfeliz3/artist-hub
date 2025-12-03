const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const SocialPost = require('../models/SocialPost');

// Get platform statistics
router.get('/platform', async (req, res) => {
  try {
    const [
      totalArtists,
      totalProducts,
      activeUsers,
      recentSales
    ] = await Promise.all([
      User.countDocuments({ role: 'artist' }),
      Product.countDocuments(),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      Order.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
    ]);

    res.json({
      totalArtists,
      totalProducts,
      activeUsers,
      recentSales
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;