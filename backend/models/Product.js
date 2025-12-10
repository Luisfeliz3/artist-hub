const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Info
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  
  description: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  
  // Pricing
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  salePrice: { 
    type: Number,
    min: 0
  },
  
  isOnSale: { 
    type: Boolean, 
    default: false 
  },
  
  // Category & Type
  category: { 
    type: String, 
    enum: ['digital', 'physical', 'ticket', 'merchandise', 'service'],
    required: true
  },
  
  type: { 
    type: String, 
    enum: ['album', 'single', 'ep', 'vinyl', 'cd', 'cassette', 'merch', 'ticket', 'digital', 'other'],
    default: 'other'
  },
  
  // Images
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  
  // Variants (for different colors, sizes, versions)
  variants: [{
    name: { type: String, required: true }, // e.g., "Color", "Size"
    options: [{
      value: { type: String, required: true }, // e.g., "Red", "Large"
      priceAdjustment: { type: Number, default: 0 }, // Additional cost
      stock: { type: Number, default: 0 },
      sku: { type: String },
      image: { type: String } // Specific image for this variant
    }]
  }],
  
  // Digital Content (for digital products)
  digitalContent: {
    files: [{
      name: String,
      url: String,
      type: { type: String, enum: ['audio', 'video', 'document', 'zip', 'other'] },
      size: Number,
      format: String
    }],
    downloadLimit: { type: Number, default: 3 }, // Max downloads per purchase
    accessDuration: { type: Number, default: null } // Days before expiry
  },
  
  // Stock & Inventory
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0
  },
  
  sku: { 
    type: String, 
    unique: true,
    sparse: true
  },
  
  // Shipping Info (for physical products)
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    requiresShipping: { type: Boolean, default: true },
    shippingCost: { type: Number, default: 0 }
  },
  
  // Tags & Metadata
  tags: [{ 
    type: String,
    lowercase: true
  }],
  
  // Stats & Analytics
  stats: {
    sales: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 }
  },
  
  // Reviews
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
    images: [{ type: String }],
    verifiedPurchase: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Status & Visibility
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  featured: { 
    type: Boolean, 
    default: false 
  },
  
  isSoldOut: { 
    type: Boolean, 
    default: false 
  },
  
  // Additional Info
  releaseDate: { 
    type: Date 
  },
  
  preOrder: {
    enabled: { type: Boolean, default: false },
    releaseDate: Date,
    cutoffDate: Date
  },
  
  // SEO & Discoverability
  metaTitle: { type: String },
  metaDescription: { type: String },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true
  }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for current price (handles sales)
productSchema.virtual('currentPrice').get(function() {
  return this.isOnSale && this.salePrice ? this.salePrice : this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.isOnSale && this.salePrice && this.price > this.salePrice) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for total stock (including variants)
productSchema.virtual('totalStock').get(function() {
  if (!this.variants || this.variants.length === 0) {
    return this.stock;
  }
  
  let total = 0;
  this.variants.forEach(variant => {
    variant.options.forEach(option => {
      total += option.stock || 0;
    });
  });
  
  return total;
});

// Method to check if product is available
productSchema.methods.isAvailable = function() {
  if (this.stock > 0) return true;
  
  if (this.variants && this.variants.length > 0) {
    return this.variants.some(variant => 
      variant.options.some(option => option.stock > 0)
    );
  }
  
  return false;
};

// Method to update stock after purchase
productSchema.methods.updateStock = function(variantName, optionValue, quantity) {
  if (this.variants && variantName && optionValue) {
    const variant = this.variants.find(v => v.name === variantName);
    if (variant) {
      const option = variant.options.find(o => o.value === optionValue);
      if (option) {
        option.stock = Math.max(0, option.stock - quantity);
        return option.stock;
      }
    }
  } else {
    this.stock = Math.max(0, this.stock - quantity);
    return this.stock;
  }
  return null;
};

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  
  // Update isSoldOut based on stock
  this.isSoldOut = !this.isAvailable();
  
  next();
});

// Indexes
productSchema.index({ artist: 1, createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ type: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ 'stats.sales': -1 });
productSchema.index({ 'stats.averageRating': -1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);