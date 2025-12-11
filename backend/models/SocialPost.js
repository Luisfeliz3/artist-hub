// models/SocialPost.js - Updated with platform-specific enhancements
const mongoose = require('mongoose');

const socialPostSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    maxlength: 200
  },
  
  content: {
    type: String,
    maxlength: 5000
  },
  
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Platform Information
  platform: {
    type: String,
    enum: ['instagram', 'tiktok', 'twitter', 'youtube', 'facebook', 'spotify', 'internal'],
    required: true,
    index: true
  },
  
  platformPostId: {
    type: String,
    sparse: true
  },
  
  platformUrl: {
    type: String
  },
  
  // Content Type
  contentType: {
    type: String,
    enum: ['post', 'reel', 'story', 'video', 'tweet', 'live', 'album', 'track'],
    default: 'post'
  },
  
  // Media Content
  media: [{
    url: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['image', 'video', 'audio', 'gif', 'carousel'],
      required: true
    },
    thumbnail: String,
    duration: Number,
    width: Number,
    height: Number,
    aspectRatio: String,
    format: String,
    size: Number,
    order: { type: Number, default: 0 }
  }],
  
  // Platform-Specific Data
  platformData: {
    // Instagram
    instagram: {
      isReel: Boolean,
      isStory: Boolean,
      musicTrack: String,
      filters: [String],
      locationTag: String,
      productTags: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        position: { x: Number, y: Number }
      }]
    },
    
    // TikTok
    tiktok: {
      sound: {
        id: String,
        title: String,
        author: String
      },
      duetEnabled: Boolean,
      stitchEnabled: Boolean,
      hashtags: [String],
      challenges: [String],
      videoEffects: [String]
    },
    
    // YouTube
    youtube: {
      videoId: String,
      channelId: String,
      duration: String,
      category: String,
      license: String,
      liveBroadcastContent: String,
      defaultAudioLanguage: String,
      caption: Boolean
    },
    
    // Twitter
    twitter: {
      isRetweet: Boolean,
      isQuoteTweet: Boolean,
      retweetedStatusId: String,
      quotedStatusId: String,
      hashtags: [String],
      symbols: [String],
      userMentions: [{
        screenName: String,
        userId: String
      }]
    },
    
    // Facebook
    facebook: {
      type: String,
      isLiveVideo: Boolean,
      is360Video: Boolean,
      reactions: {
        like: Number,
        love: Number,
        wow: Number,
        haha: Number,
        sad: Number,
        angry: Number
      }
    },
    
    // Spotify
    spotify: {
      trackId: String,
      albumId: String,
      artistId: String,
      durationMs: Number,
      previewUrl: String,
      explicit: Boolean,
      popularity: Number
    }
  },
  
  // Engagement Metrics
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    
    // Platform-specific metrics
    retweets: { type: Number, default: 0 }, // Twitter
    favorites: { type: Number, default: 0 }, // Twitter
    bookmarks: { type: Number, default: 0 }, // Twitter
    
    plays: { type: Number, default: 0 }, // TikTok/YouTube
    reposts: { type: Number, default: 0 }, // TikTok
    
    subscribersGained: { type: Number, default: 0 } // YouTube
  },
  
  // User Engagement
  userEngagement: {
    likes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      index: true 
    }],
    
    comments: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true, maxlength: 1000 },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      replies: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, maxlength: 500 },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        createdAt: { type: Date, default: Date.now }
      }],
      createdAt: { type: Date, default: Date.now }
    }],
    
    shares: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    
    saves: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    
    views: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      viewedAt: { type: Date, default: Date.now },
      duration: Number
    }]
  },
  
  // Tags & Categories
  hashtags: [{ 
    type: String,
    lowercase: true,
    index: true
  }],
  
  mentions: [{
    username: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  categories: [{
    type: String,
    enum: ['music', 'dance', 'comedy', 'education', 'gaming', 'sports', 'fashion', 'food', 'travel', 'art']
  }],
  
  // Location
  location: {
    name: String,

  },
  
  // Commerce Features
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    position: { x: Number, y: Number },
    price: Number,
    salePrice: Number
  }],
  
  affiliateLinks: [{
    title: String,
    url: String,
    description: String,
    clicks: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  }],
  
  // Visibility & Moderation
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private', 'scheduled', 'archived'],
    default: 'public',
    index: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  isSponsored: {
    type: Boolean,
    default: false
  },
  
  isAgeRestricted: {
    type: Boolean,
    default: false
  },
  
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'approved'
  },
  
  // Timestamps
  publishedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  scheduledFor: {
    type: Date,
    index: true
  },
  
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Analytics
  analytics: {
    watchTime: { type: Number, default: 0 }, // Total watch time in seconds
    averageViewDuration: { type: Number, default: 0 },
    clickThroughRate: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    
    // Audience demographics (simplified)
    audience: {
      ageGroups: {
        '13-17': Number,
        '18-24': Number,
        '25-34': Number,
        '35-44': Number,
        '45+': Number
      },
      gender: {
        male: Number,
        female: Number,
        other: Number
      },
      countries: [{
        country: String,
        viewers: Number
      }]
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
socialPostSchema.index({ artist: 1, publishedAt: -1 });
socialPostSchema.index({ platform: 1, publishedAt: -1 });
socialPostSchema.index({ 'hashtags': 1, publishedAt: -1 });
socialPostSchema.index({ 'categories': 1 });
socialPostSchema.index({ 'metrics.views': -1 });
socialPostSchema.index({ 'metrics.likes': -1 });
socialPostSchema.index({ 'metrics.engagementRate': -1 });
socialPostSchema.index({ 'visibility': 1, publishedAt: -1 });
socialPostSchema.index({ 'isFeatured': 1, publishedAt: -1 });
socialPostSchema.index({ 'content': 'text', 'hashtags': 'text' });
socialPostSchema.index({ 'location.coordinates': '2dsphere' });

// Virtuals
socialPostSchema.virtual('engagementScore').get(function() {
  return (
    this.metrics.likes * 1 +
    this.metrics.comments * 2 +
    this.metrics.shares * 3 +
    this.metrics.saves * 1.5 +
    (this.metrics.views / 1000)
  );
});

socialPostSchema.virtual('isTrending').get(function() {
  const hoursSincePosted = (Date.now() - this.publishedAt) / (1000 * 60 * 60);
  if (hoursSincePosted > 72) return false;
  
  const engagementRate = this.metrics.views > 0 
    ? (this.metrics.likes + this.metrics.comments * 2) / this.metrics.views 
    : 0;
    
  return engagementRate > 0.05 && this.metrics.views > 1000;
});

// Pre-save middleware
socialPostSchema.pre('save', function(next) {
  this.lastUpdatedAt = new Date();
  
  // Calculate engagement rate
  if (this.metrics.views > 0) {
    this.metrics.engagementRate = (
      (this.metrics.likes + this.metrics.comments * 2 + this.metrics.shares * 3) / 
      this.metrics.views
    ) * 100;
  }
  
  next();
});

// Methods
socialPostSchema.methods.addView = function(userId, duration = 0) {
  if (userId) {
    this.userEngagement.views.push({
      user: userId,
      viewedAt: new Date(),
      duration: duration
    });
  }
  this.metrics.views += 1;
  
  if (duration > 0) {
    this.analytics.watchTime += duration;
    this.analytics.averageViewDuration = 
      (this.analytics.watchTime / this.metrics.views);
  }
  
  return this.save();
};

socialPostSchema.methods.toggleLike = async function(userId) {
  const likeIndex = this.userEngagement.likes.indexOf(userId);
  
  if (likeIndex > -1) {
    // Unlike
    this.userEngagement.likes.splice(likeIndex, 1);
    this.metrics.likes = Math.max(0, this.metrics.likes - 1);
  } else {
    // Like
    this.userEngagement.likes.push(userId);
    this.metrics.likes += 1;
  }
  
  await this.save();
  return this.metrics.likes;
};

socialPostSchema.methods.addComment = function(userId, content, parentCommentId = null) {
  const comment = {
    user: userId,
    content: content,
    createdAt: new Date(),
    likes: [],
    replies: []
  };
  
  if (parentCommentId) {
    const parentComment = this.userEngagement.comments.id(parentCommentId);
    if (parentComment) {
      parentComment.replies.push(comment);
    }
  } else {
    this.userEngagement.comments.push(comment);
  }
  
  this.metrics.comments += 1;
  return this.save();
};

module.exports = mongoose.model('SocialPost', socialPostSchema);