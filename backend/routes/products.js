const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, artist, featured, sort } = req.query;
    let query = {};

    if (category) query.category = category;
    if (artist) query.artist = artist;
    if (featured) query.featured = featured === 'true';

    let sortOptions = {};
    if (sort === 'newest') sortOptions.createdAt = -1;
    if (sort === 'popular') sortOptions['stats.sales'] = -1;
    if (sort === 'price-low') sortOptions.price = 1;
    if (sort === 'price-high') sortOptions.price = -1;

    const products = await Product.find(query)
      .populate('artist', 'username profileImage')
      .sort(sortOptions);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('artist', 'username profileImage artistProfile');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    product.stats.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create product (artist only)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'artist' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only artists can create products' });
    }

    const product = new Product({
      ...req.body,
      artist: req.userId,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.artist.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.artist.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/unlike product
router.post('/:id/like', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Toggle like logic here
    // You might want to add likes to User model
    product.stats.likes += 1;
    await product.save();

    res.json({ likes: product.stats.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;