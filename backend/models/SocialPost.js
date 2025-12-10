const mongoose = require('mongoose');

const socialPostSchema = new mongoose.Schema({
  // Creator & Platform Info
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  
  platform: { 
    type: String, 
    enum: ['instagram', 'tiktok', 'twitter', 'youtube', 'facebook', 'spotify', 'soundcloud', 'bandcamp', 'internal'],
    required: true,
    index: true
  },
  
  platformPostId: { 
    type: String,
    sparse: true // Allows null for internal posts
  },
  
  // Content
  content: { 
    type: String,
    maxlength: 5000
  },
  
  // Media
  media: [{
    url: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['image', 'video', 'audio', 'gif', 'carousel'],
      required: true
    },
    thumbnail: String,
    duration: Number, // For video/audio in seconds
    width: Number,
    height: Number,
    alt: String,
    order: { type: Number, default: 0 }
  }],
  
  // Engagement
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true, maxlength: 1000 },
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
  
  // Stats
  stats: {
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 }
  },
  
  // Metadata
  tags: [{ 
    type: String,
    lowercase: true,
    index: true
  }],
  
  mentions: [{
    username: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  location: {
    name: String,

  },
  
  // Platform Specific Data
  platformData: {
    // Instagram specific
    instagram: {
      isReel: Boolean,
      isStory: Boolean,
      musicTrack: String,
      filters: [String]
    },
    // TikTok specific
    tiktok: {
      sound: String,
      duetEnabled: Boolean,
      stitchEnabled: Boolean,
      hashtags: [String]
    },
    // Twitter specific
    twitter: {
      isRetweet: Boolean,
      isQuoteTweet: Boolean,
      retweetCount: Number,
      quoteTweetId: String
    },
    // YouTube specific
    youtube: {
      videoId: String,
      duration: String,
      category: String,
      license: String
    },
    // Spotify specific
    spotify: {
      trackId: String,
      albumId: String,
      artistId: String,
      durationMs: Number
    }
  },
  
  // Scheduling & Publication
  isPublished: { 
    type: Boolean, 
    default: true 
  },
  
  isScheduled: { 
    type: Boolean, 
    default: false 
  },
  
  publishAt: { 
    type: Date,
    index: true
  },
  
  publishedAt: { 
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Sync Information
  lastSyncedAt: Date,
  syncStatus: { 
    type: String, 
    enum: ['synced', 'pending', 'failed', 'manual'],
    default: 'manual'
  },
  
  syncAttempts: { 
    type: Number, 
    default: 0 
  },
  
  syncError: String,
  
  // Featured & Pinned
  featured: { 
    type: Boolean, 
    default: false,
    index: true
  },
  
  isPinned: { 
    type: Boolean, 
    default: false 
  },
  
  pinnedUntil: Date,
  
  // Product/Commerce Integration
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  
  // Link in Bio
  linkInBio: {
    enabled: Boolean,
    title: String,
    url: String,
    clicks: { type: Number, default: 0 }
  },
  
  // Privacy
  isPublic: { 
    type: Boolean, 
    default: true 
  },
  
  visibility: { 
    type: String, 
    enum: ['public', 'followers', 'private'],
    default: 'public' 
  },
  
  // Analytics
  analytics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    profileVisits: { type: Number, default: 0 },
    websiteClicks: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 }
  }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
socialPostSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
socialPostSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual for share count
socialPostSchema.virtual('shareCount').get(function() {
  return this.shares ? this.shares.length : 0;
});

// Virtual for save count
socialPostSchema.virtual('saveCount').get(function() {
  return this.saves ? this.saves.length : 0;
});

// Virtual for total engagement
socialPostSchema.virtual('totalEngagement').get(function() {
  return this.likeCount + this.commentCount + this.shareCount + this.saveCount;
});

// Virtual for engagement rate (if we have views)
socialPostSchema.virtual('engagementRatePercent').get(function() {
  if (this.stats.viewsCount > 0) {
    return ((this.totalEngagement / this.stats.viewsCount) * 100).toFixed(2);
  }
  return 0;
});

// Virtual for formatted publish date
socialPostSchema.virtual('formattedDate').get(function() {
  const now = new Date();
  const postDate = this.publishedAt;
  const diffMs = now - postDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return postDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
});

// Pre-save middleware
socialPostSchema.pre('save', function(next) {
  // Update stats from arrays
  this.stats.likesCount = this.likes ? this.likes.length : 0;
  this.stats.commentsCount = this.comments ? this.comments.length : 0;
  this.stats.sharesCount = this.shares ? this.shares.length : 0;
  this.stats.saveCount = this.saves ? this.saves.length : 0;
  
  // Calculate engagement
  this.stats.engagement = this.totalEngagement;
  
  // Set publishedAt if not set and post is being published
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Handle scheduled posts
  if (this.isScheduled && this.publishAt) {
    this.isPublished = this.publishAt <= new Date();
  }
  
  next();
});

// Method to add a comment
socialPostSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content,
    createdAt: new Date()
  });
  return this.save();
};

// Method to add a like
socialPostSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  
  if (likeIndex > -1) {
    // Unlike
    this.likes.splice(likeIndex, 1);
  } else {
    // Like
    this.likes.push(userId);
  }
  
  return this.save();
};

// Indexes for better query performance
socialPostSchema.index({ artist: 1, publishedAt: -1 });
socialPostSchema.index({ platform: 1, publishedAt: -1 });
socialPostSchema.index({ tags: 1 });
socialPostSchema.index({ featured: 1, publishedAt: -1 });
socialPostSchema.index({ isPublished: 1, publishAt: 1 });
socialPostSchema.index({ 'location.coordinates': '2dsphere' });
socialPostSchema.index({ createdAt: -1 });
socialPostSchema.index({ 'stats.engagement': -1 });

// Text search index for content and tags
socialPostSchema.index({ 
  content: 'text',
  tags: 'text'
});

module.exports = mongoose.model('SocialPost', socialPostSchema);