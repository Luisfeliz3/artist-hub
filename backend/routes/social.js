const express = require('express');
const router = express.Router();
const SocialPost = require('../models/SocialPost');
const auth = require('../middleware/auth');
const axios = require('axios');

// Get all social posts
router.get('/', async (req, res) => {
  try {
    const { platform, artist, featured } = req.query;
    let query = {};

    if (platform) query.platform = platform;
    if (artist) query.artist = artist;
    if (featured) query.featured = featured === 'true';

    const posts = await SocialPost.find(query)
      .populate('artist', 'username profileImage')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create social post
router.post('/', auth, async (req, res) => {
  try {
    const post = new SocialPost({
      ...req.body,
      artist: req.userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Sync Instagram posts (webhook endpoint)
router.post('/sync/instagram', async (req, res) => {
  try {
    // This would be called by Instagram webhook
    const { data } = req.body;
    
    // Process Instagram posts and save to database
    // You would need to implement Instagram API integration
    
    res.json({ message: 'Instagram posts synced' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', errorlatest: error.message });
  }
});

// Get latest posts
router.get('/latest', async (req, res) => {
  try {
    const posts = await SocialPost.find()
      .populate('artist', 'username profileImage')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest posts', error: error.message });
  }
});

// Sync TikTok posts
router.post('/sync/tiktok', async (req, res) => {
  try {
    // TikTok API integration
    res.json({ message: 'TikTok posts synced' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;