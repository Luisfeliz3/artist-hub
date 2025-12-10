const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // User & Artist Info
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
   
  },
  
  // Order Items
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true
    },
    variant : {
    name: { type: String, required: true },
    option: { type: String, required: true },
    },
    price: { type: Number, required: true, min: 0 },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1,
      default: 1 
    },
    variant: {
      name: String,
      option: String,
      priceAdjustment: { type: Number, default: 0 }
    },
    image: { type: String },
    digitalContent: [{
      name: String,
      url: String,
      downloadToken: String,
      downloadsRemaining: Number,
      expiresAt: Date
    }]
  }],
  
  // Pricing & Totals
  subtotal: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  shippingCost: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  taxAmount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  discount: {
    code: String,
    amount: { type: Number, default: 0, min: 0 },
    type: { type: String, enum: ['percentage', 'fixed'] }
  },
  
  totalAmount: { 
    type: Number, 
    required: true,
    min: 0
  },
  
  currency: { 
    type: String, 
    default: 'USD',
    uppercase: true
  },
  
  // Shipping Address
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String }
  },
  
  billingAddress: {
    sameAsShipping: { type: Boolean, default: true },
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Order Status
  status: { 
    type: String, 
    enum: [
      'pending',      // Order created, awaiting payment
      'processing',   // Payment confirmed, processing order
      'shipped',      // Order shipped
      'delivered',    // Order delivered
      'cancelled',    // Order cancelled
      'refunded',     // Order refunded
      'failed'        // Payment failed
    ],
    default: 'pending',
    index: true
  },
  
  // Payment Information
  payment: {
    method: { 
      type: String, 
      enum: ['stripe', 'paypal', 'bank_transfer', 'cash', 'other'],
      required: true
    },
    transactionId: { type: String },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    amount: Number,
    currency: String,
    paidAt: Date,
    paymentMethodDetails: Object // Store payment provider specific details
  },
  
  // Shipping Information
  shipping: {
    method: String,
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date
  },
  
  // Order Metadata
  orderNumber: { 
    type: String, 
    unique: true,
    required: true
  },
  
  notes: { 
    type: String,
    maxlength: 500
  },
  
  // Customer Contact
  customerEmail: { 
    type: String,
    required: true,
    lowercase: true
  },
  
  customerPhone: { type: String },
  
  // Refunds & Cancellations
  refund: {
    reason: String,
    amount: Number,
    status: { type: String, enum: ['requested', 'approved', 'rejected', 'processed'] },
    requestedAt: Date,
    processedAt: Date,
    notes: String
  },
  
  cancellation: {
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    notes: String
  },
  
  // Analytics
  ipAddress: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  
  // Digital Order Specific
  isDigital: { 
    type: Boolean, 
    default: false 
  },
  
  downloadLinksSent: { 
    type: Boolean, 
    default: false 
  },
  
  downloads: [{
    file: String,
    downloadedAt: Date,
    ipAddress: String
  }]
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted order number
orderSchema.virtual('formattedOrderNumber').get(function() {
  return `ORD-${this.orderNumber}`;
});

// Virtual for items count
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order status color/class
orderSchema.virtual('statusColor').get(function() {
  const statusColors = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error',
    refunded: 'secondary',
    failed: 'error'
  };
  return statusColors[this.status] || 'default';
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.models.Order.countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const sequential = (count + 1).toString().padStart(6, '0');
    this.orderNumber = `${year}${month}${sequential}`;
  }
  
  // Set artist from first product if not set
  if (!this.artist && this.items.length > 0) {
    const Product = mongoose.model('Product');
    const product = await Product.findById(this.items[0].product).populate('artist');
    if (product && product.artist) {
      this.artist = product.artist._id;
    }
  }
  
  // Calculate subtotal if not set
  if (!this.subtotal || this.isModified('items')) {
    this.subtotal = this.items.reduce((total, item) => {
      const variantAdjustment = item.variant?.priceAdjustment || 0;
      const itemPrice = item.price + variantAdjustment;
      return total + (itemPrice * item.quantity);
    }, 0);
  }
  
  // Calculate total if not set
  if (!this.totalAmount || this.isModified(['subtotal', 'shippingCost', 'taxAmount', 'discount'])) {
    this.totalAmount = this.subtotal + this.shippingCost + this.taxAmount - (this.discount?.amount || 0);
  }
  
  // Check if order is digital
  this.isDigital = this.items.every(item => {
    // Assuming product references will be populated or we need to check differently
    // In practice, you might want to query the products
    return false; // Default to false, update in application logic
  });
  
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus, notes = '') {
  const oldStatus = this.status;
  this.status = newStatus;
  this.notes = this.notes ? `${this.notes}\n${notes}` : notes;
  
  // Update timestamps based on status
  const now = new Date();
  switch (newStatus) {
    case 'processing':
      this.payment.paidAt = now;
      this.payment.status = 'completed';
      break;
    case 'shipped':
      this.shipping.shippedAt = now;
      break;
    case 'delivered':
      this.shipping.deliveredAt = now;
      break;
    case 'refunded':
      this.refund.processedAt = now;
      break;
  }
  
  await this.save();
  
  // Update product sales stats
  if (oldStatus === 'pending' && newStatus === 'processing') {
    const Product = mongoose.model('Product');
    for (const item of this.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'stats.sales': item.quantity }
      });
    }
  }
  
  return this;
};

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ artist: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'payment.transactionId': 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ totalAmount: 1 });

module.exports = mongoose.model('Order', orderSchema);