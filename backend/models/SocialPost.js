const mongoose = require('mongoose');

const socialPostSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    enum: ['instagram', 'tiktok', 'twitter', 'youtube', 'spotify', 'native'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  media: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'audio']
    },
    thumbnail: String
  }],
  metadata: {
    externalId: String,
    likes: Number,
    comments: Number,
    shares: Number,
    views: Number,
    postedAt: Date
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SocialPost', socialPostSchema);