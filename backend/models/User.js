const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication & Basic Info
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String,
    required: function() { return !this.googleId; } // Required only if not using Google auth
  },
  googleId: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'artist', 'admin'], 
    default: 'user',
    required: true
  },
  
  // Profile Info
  profileImage: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  bio: { type: String, maxlength: 500, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  phone: { type: String, default: '' },
  birthday: { type: Date },
  
  // Social Links
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    youtube: { type: String, default: '' },
    spotify: { type: String, default: '' },
    soundcloud: { type: String, default: '' },
    bandcamp: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    discogs: { type: String, default: '' },
    songkick: { type: String, default: '' }
  },
  
  // Artist Specific Profile (only for artists)
  artistProfile: {
    stageName: { type: String, default: '' },
    realName: { type: String, default: '' },
    genre: [{ type: String }],
    instruments: [{ type: String }],
    influences: [{ type: String }],
    yearsActive: { type: Number, default: 0 },
    label: { type: String, default: '' },
    setup: { type: String, default: '' },
    achievements: [{
      year: String,
      type: String
    }],
    upcomingEvents: [{
      date: Date,
      venue: String,
      city: String,
      tickets: String,
      isSoldOut: { type: Boolean, default: false }
    }],
    discography: [{
      year: Number,
      title: String,
      type: { type: String, enum: ['Album', 'EP', 'Single', 'Beat Tape'] },
      tracks: Number
    }]
  },
  
  // Admin Permissions (only for admins)
  adminPermissions: {
    canManageUsers: { type: Boolean, default: false },
    canManageContent: { type: Boolean, default: false },
    canManagePayments: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: false },
    canManageArtists: { type: Boolean, default: false }
  },
  
  // E-commerce
  cart: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    },
    quantity: { 
      type: Number, 
      default: 1,
      min: 1 
    },
    variant: {
      name: String,
      option: String
    },
    addedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  
  // Payment Methods
  paymentMethods: [{
    type: { 
      type: String, 
      enum: ['card', 'paypal', 'bank'],
      required: true 
    },
    last4: { type: String },
    expiryDate: { type: String },
    nameOnCard: { type: String },
    email: { type: String }, // for PayPal
    accountType: { type: String }, // for bank
    isDefault: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Social & Relationships
followers: {
  type: Number,
  default: 0,
  min: 0
},
  
// following: {
//   type: Number,
//   default: 0,
//   min: 0
// },
  
  blockedUsers: { 
    type: Number,
    default :0
  },
  
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  
  // Account Status & Verification
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  verificationRequest: {
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    submittedAt: Date,
    verifiedAt: Date,
    documents: [String],
    notes: String
  },
  
  // Preferences
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  },
  
  preferences: {
    favoriteGenres: [{ type: String }],
    notificationFrequency: { 
      type: String, 
      enum: ['instant', 'daily', 'weekly'],
      default: 'daily' 
    },
    autoplay: { type: Boolean, default: true },
    explicitContent: { type: Boolean, default: false }
  },
  
  privacy: { 
    type: String, 
    enum: ['public', 'private', 'friends'], 
    default: 'public' 
  },
  
  theme: { 
    type: String, 
    enum: ['light', 'dark', 'auto'], 
    default: 'dark' 
  },
  
  language: { 
    type: String, 
    default: 'en' 
  },
  
  // Stats (virtual or updated periodically)
  followersCount: { 
    type: Number, 
    default: 0 
  },
  
  followingCount: { 
    type: Number, 
    default: 0 
  }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full follower count
userSchema.virtual('totalFollowers').get(function() {
  return this.followers ? this.followers.length : 0;
});

// Virtual for full following count
userSchema.virtual('totalFollowing').get(function() {
  return this.following ? this.following.length : 0;
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is artist
userSchema.methods.isArtist = function() {
  return this.role === 'artist';
};

// Method to check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Indexes for better query performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'artistProfile.genre': 1 });
userSchema.index({ 'artistProfile.stageName': 1 });
userSchema.index({ location: 1 });

module.exports = mongoose.model('User', userSchema);