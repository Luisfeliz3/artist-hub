const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// Spotify integration endpoints
router.get('/spotify/artist/:id', async (req, res) => {
  try {
    // Get Spotify access token
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'grant_type=client_credentials'
    };

    const tokenResponse = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers
    });

    const accessToken = tokenResponse.data.access_token;

    // Get artist data from Spotify
    const artistResponse = await axios.get(
      `https://api.spotify.com/v1/artists/${req.params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    // Get artist's top tracks
    const tracksResponse = await axios.get(
      `https://api.spotify.com/v1/artists/${req.params.id}/top-tracks?market=US`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    // Get featured Spotify artist
router.get('/spotify/featured', async (req, res) => {
  try {
    // For now, return mock data or fetch from your database
    // In production, you'd fetch from Spotify API
    
    const featuredArtist = await User.findOne({ role: 'artist' })
      .select('username artistProfile');
    
    // Mock Spotify data
    const mockSpotifyData = {
      artist: {
        name: featuredArtist?.username || 'Featured Artist',
        images: [{ url: featuredArtist?.profileImage || '' }],
        followers: { total: 100000 },
        genres: featuredArtist?.artistProfile?.genre || ['electronic', 'pop']
      },
      topTracks: {
        tracks: [
          { name: 'Track 1', duration_ms: 180000 },
          { name: 'Track 2', duration_ms: 210000 },
          { name: 'Track 3', duration_ms: 195000 },
        ]
      }
    };

    res.json(mockSpotifyData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured artist', error: error.message });
  }
});

    // Get artist's albums
    const albumsResponse = await axios.get(
      `https://api.spotify.com/v1/artists/${req.params.id}/albums?include_groups=album,single&market=US&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    res.json({
      artist: artistResponse.data,
      topTracks: tracksResponse.data,
      albums: albumsResponse.data
    });
  } catch (error) {
    console.error('Spotify API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching Spotify data', error: error.message });
  }
});

// Search music
router.get('/search', async (req, res) => {
  try {
    const { query, type = 'artist' } = req.query;
    
    // Get Spotify access token
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'grant_type=client_credentials'
    };

    const tokenResponse = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers
    });

    const accessToken = tokenResponse.data.access_token;

    // Search Spotify
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    res.json(searchResponse.data);
  } catch (error) {
    res.status(500).json({ message: 'Error searching music', error: error.message });
  }
});

// Get artist's music products
router.get('/artist/:artistId/products', async (req, res) => {
  try {
    const products = await Product.find({
      artist: req.params.artistId,
      category: { $in: ['music', 'digital'] }
    }).populate('artist', 'username profileImage');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;