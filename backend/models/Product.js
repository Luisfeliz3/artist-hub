const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['merch', 'music', 'ticket', 'digital', 'physical'],
    required: true
  },
  images: [{
    url: String,
    alt: String
  }],
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  variants: [{
    name: String,
    options: [{
      value: String,
      priceAdjustment: Number,
      stock: Number
    }]
  }],
  stock: {
    type: Number,
    default: 0
  },
  digitalContent: {
    type: String,
    required: function() {
      return this.category === 'digital';
    }
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  stats: {
    sales: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);