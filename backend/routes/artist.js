const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const SocialPost = require('../models/SocialPost');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const axios = require('axios');

// Get all artists with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      genre,
      location,
      sortBy = 'popular',
      verified,
    } = req.query;

    let query = { role: 'artist' };
    let sort = {};

    // Search filter
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { 'artistProfile.bio': { $regex: search, $options: 'i' } },
      ];
    }

    // Genre filter
    if (genre) {
      const genres = Array.isArray(genre) ? genre : [genre];
      query['artistProfile.genre'] = { $in: genres };
    }

    // Location filter
    if (location) {
      query['artistProfile.location'] = { $regex: location, $options: 'i' };
    }

    // Verified filter
    if (verified === 'true') {
      query.isVerified = true;
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'followers':
        sort.followers = -1;
        break;
      case 'alphabetical':
        sort.username = 1;
        break;
      case 'popular':
      default:
        sort.followers = -1;
        break;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [artists, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    // Add additional data to each artist
    const artistsWithStats = await Promise.all(
      artists.map(async (artist) => {
        const artistObj = artist.toObject();
        
        // Get product count
        const productCount = await Product.countDocuments({ artist: artist._id });
        
        // Get post count
        const postCount = await SocialPost.countDocuments({ artist: artist._id });
        
        return {
          ...artistObj,
          productCount,
          postCount,
        };
      })
    );

    res.json({
      artists: artistsWithStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalArtists: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: error.message });
  }
});

// Get single artist by ID
router.get('/:id', async (req, res) => {
  try {
    const artist = await User.findById(req.params.id)
      .select('-password')
      .populate('products', 'name price images category')
      .populate('followers', 'username profileImage');

    if (!artist || artist.role !== 'artist') {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Get additional stats
    const [productCount, postCount, totalSales] = await Promise.all([
      Product.countDocuments({ artist: artist._id }),
      SocialPost.countDocuments({ artist: artist._id }),
      Order.aggregate([
        {
          $match: {
            'items.product': { $in: await Product.find({ artist: artist._id }).select('_id') },
            status: 'delivered',
          },
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const artistData = artist.toObject();
    artistData.productCount = productCount;
    artistData.postCount = postCount;
    artistData.totalSales = totalSales[0]?.total || 0;

    res.json(artistData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist', error: error.message });
  }
});

// Get artist's social media stats
router.get('/:id/social-stats', async (req, res) => {
  try {
    const artist = await User.findById(req.params.id).select('artistProfile.socialLinks');
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const socialLinks = artist.artistProfile?.socialLinks || {};
    const stats = {};

    // Mock data for social platforms
    // In production, you would call each platform's API
    if (socialLinks.instagram) {
      stats.instagram = {
        followers: Math.floor(Math.random() * 100000) + 1000,
        posts: Math.floor(Math.random() * 500) + 50,
        engagement: Math.random() * 10 + 1,
      };
    }

    if (socialLinks.youtube) {
      stats.youtube = {
        subscribers: Math.floor(Math.random() * 50000) + 1000,
        views: Math.floor(Math.random() * 1000000) + 10000,
        videos: Math.floor(Math.random() * 200) + 10,
      };
    }

    if (socialLinks.tiktok) {
      stats.tiktok = {
        followers: Math.floor(Math.random() * 500000) + 10000,
        likes: Math.floor(Math.random() * 1000000) + 100000,
        videos: Math.floor(Math.random() * 300) + 20,
      };
    }

    if (socialLinks.twitter) {
      stats.twitter = {
        followers: Math.floor(Math.random() * 50000) + 1000,
        tweets: Math.floor(Math.random() * 1000) + 100,
      };
    }

    if (socialLinks.spotify) {
      stats.spotify = {
        monthlyListeners: Math.floor(Math.random() * 1000000) + 10000,
        followers: Math.floor(Math.random() * 50000) + 1000,
      };
    }

    if (socialLinks.soundcloud) {
      stats.soundcloud = {
        followers: Math.floor(Math.random() * 20000) + 500,
        plays: Math.floor(Math.random() * 500000) + 10000,
      };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching social stats', error: error.message });
  }
});

// Get artist's products
router.get('/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ artist: req.params.id })
      .populate('artist', 'username profileImage')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist products', error: error.message });
  }
});

// Get artist's posts
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await SocialPost.find({ artist: req.params.id })
      .populate('artist', 'username profileImage')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist posts', error: error.message });
  }
});

// Follow an artist
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const artist = await User.findById(req.params.id);
    const user = await User.findById(req.userId);

    if (!artist || artist.role !== 'artist') {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Check if already following
    if (!user.following.includes(artist._id)) {
      user.following.push(artist._id);
      artist.followers += 1;
      
      await Promise.all([user.save(), artist.save()]);
    }

    res.json({
      artistId: artist._id,
      followers: artist.followers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error following artist', error: error.message });
  }
});

// Unfollow an artist
router.delete('/:id/follow', auth, async (req, res) => {
  try {
    const artist = await User.findById(req.params.id);
    const user = await User.findById(req.userId);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Remove from following
    user.following = user.following.filter(id => id.toString() !== artist._id.toString());
    artist.followers = Math.max(0, artist.followers - 1);
    
    await Promise.all([user.save(), artist.save()]);

    res.json({
      artistId: artist._id,
      followers: artist.followers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing artist', error: error.message });
  }
});

// Sync artist's social media (webhook endpoint)
router.post('/:id/sync-social', auth, async (req, res) => {
  try {
    const artist = await User.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Check if user is the artist or admin
    if (artist._id.toString() !== req.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // In production, this would trigger social media API calls
    // For now, return success
    res.json({
      message: 'Social media sync initiated',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing social media', error: error.message });
  }
});

// Get artist's analytics
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const artist = await User.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Check if user is the artist or admin
    if (artist._id.toString() !== req.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get analytics data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      salesData,
      viewData,
      followerGrowth,
      topProducts,
    ] = await Promise.all([
      // Sales data
      Order.aggregate([
        {
          $match: {
            'items.product': { $in: await Product.find({ artist: artist._id }).select('_id') },
            createdAt: { $gte: thirtyDaysAgo },
            status: 'delivered',
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            totalSales: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // View data (simulated)
      Product.aggregate([
        { $match: { artist: artist._id } },
        { $group: { _id: null, totalViews: { $sum: '$stats.views' } } },
      ]),

      // Follower growth (simulated)
      [{ growth: Math.floor(Math.random() * 100) + 10 }],

      // Top products
      Product.find({ artist: artist._id })
        .sort({ 'stats.sales': -1 })
        .limit(5)
        .select('name price stats.sales'),
    ]);

    res.json({
      sales: salesData,
      totalViews: viewData[0]?.totalViews || 0,
      followerGrowth: followerGrowth[0].growth,
      topProducts,
      engagementRate: Math.random() * 15 + 5, // simulated
      avgOrderValue: salesData.length > 0 
        ? salesData.reduce((sum, day) => sum + day.totalSales, 0) / 
          salesData.reduce((sum, day) => sum + day.count, 0)
        : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

// Search artists
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const artists = await User.find({
      role: 'artist',
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { 'artistProfile.bio': { $regex: q, $options: 'i' } },
        { 'artistProfile.genre': { $regex: q, $options: 'i' } },
        { 'artistProfile.location': { $regex: q, $options: 'i' } },
      ],
    })
    .select('username profileImage artistProfile followers')
    .limit(10);

    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: 'Error searching artists', error: error.message });
  }
});

// Get trending artists
router.get('/trending', async (req, res) => {
  try {
    const artists = await User.find({ role: 'artist' })
      .select('username profileImage artistProfile followers')
      .sort({ followers: -1 })
      .limit(10);

    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending artists', error: error.message });
  }
});

module.exports = router;