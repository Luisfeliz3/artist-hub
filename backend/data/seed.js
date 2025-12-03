const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const SocialPost = require('../models/SocialPost');
const Order = require('../models/Order');

dotenv.config();

const artists = [
  {
    username: 'nova_rhythm',
    email: 'nova@artisthub.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    role: 'artist',
    artistProfile: {
      bio: 'Electronic music producer creating futuristic soundscapes. Blending synthwave with modern electronic elements.',
      genre: ['Electronic', 'Synthwave', 'Future Bass'],
      location: 'Los Angeles, CA',
      website: 'https://novarhythm.com',
      socialLinks: {
        instagram: 'https://instagram.com/nova_rhythm',
        twitter: 'https://twitter.com/nova_rhythm',
        tiktok: 'https://tiktok.com/@nova_rhythm',
        youtube: 'https://youtube.com/c/novarhythm',
        spotify: 'https://open.spotify.com/artist/nova'
      }
    }
  },
  {
    username: 'luna_waves',
    email: 'luna@artisthub.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w-400&h=400&fit=crop',
    role: 'artist',
    artistProfile: {
      bio: 'Indie dream pop artist with ethereal vocals and atmospheric instrumentals.',
      genre: ['Indie', 'Dream Pop', 'Alternative'],
      location: 'Portland, OR',
      website: 'https://lunawaves.com',
      socialLinks: {
        instagram: 'https://instagram.com/luna_waves',
        twitter: 'https://twitter.com/luna_waves',
        tiktok: 'https://tiktok.com/@luna_waves',
        youtube: 'https://youtube.com/c/lunawaves',
        spotify: 'https://open.spotify.com/artist/luna'
      }
    }
  },
  {
    username: 'echo_theory',
    email: 'echo@artisthub.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    role: 'artist',
    artistProfile: {
      bio: 'Alternative rock band with powerful vocals and intricate guitar work.',
      genre: ['Alternative Rock', 'Indie Rock', 'Post-Rock'],
      location: 'Brooklyn, NY',
      website: 'https://echotheory.com',
      socialLinks: {
        instagram: 'https://instagram.com/echo_theory',
        twitter: 'https://twitter.com/echo_theory',
        tiktok: 'https://tiktok.com/@echo_theory',
        youtube: 'https://youtube.com/c/echotheory',
        spotify: 'https://open.spotify.com/artist/echo'
      }
    }
  }
];

const users = [
  {
    username: 'music_fan',
    email: 'fan@artisthub.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    role: 'user',
    artistProfile: null
  },
  {
    username: 'collector',
    email: 'collector@artisthub.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    role: 'user',
    artistProfile: null
  },
  {
    username: 'demo_admin',
    email: 'admin@artisthub.com',
    password: 'password123',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    role: 'admin',
    artistProfile: null
  }
];

const products = [
  // Nova Rhythm Products
  {
    name: 'Digital Album - "Neon Dreams"',
    description: 'Full digital album featuring 12 tracks of futuristic synthwave. Includes bonus instrumental versions.',
    price: 19.99,
    category: 'digital',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
        alt: 'Neon Dreams Album Cover'
      }
    ],
    variants: [],
    stock: 9999,
    digitalContent: 'https://example.com/downloads/neon-dreams.zip',
    tags: ['digital', 'album', 'synthwave', 'electronic'],
    featured: true,
    stats: {
      sales: 124,
      views: 2567,
      likes: 89
    }
  },
  {
    name: 'Limited Edition Vinyl',
    description: '180g vinyl pressing of "Neon Dreams" with exclusive artwork and liner notes. Limited to 500 copies.',
    price: 39.99,
    category: 'physical',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1598387993499-40ad4b2adecd?w=800&h=800&fit=crop',
        alt: 'Limited Edition Vinyl'
      }
    ],
    variants: [
      {
        name: 'Color',
        options: [
          { value: 'Neon Pink', priceAdjustment: 5, stock: 100 },
          { value: 'Clear', priceAdjustment: 0, stock: 200 },
          { value: 'Glow in Dark', priceAdjustment: 10, stock: 50 }
        ]
      }
    ],
    stock: 350,
    tags: ['vinyl', 'limited', 'collector', 'physical'],
    featured: true,
    stats: {
      sales: 87,
      views: 1890,
      likes: 145
    }
  },
  {
    name: 'Tour Hoodie 2024',
    description: 'Premium quality hoodie with embroidered logo and tour dates on back. 80% cotton, 20% polyester.',
    price: 64.99,
    category: 'merch',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
        alt: 'Tour Hoodie'
      }
    ],
    variants: [
      {
        name: 'Size',
        options: [
          { value: 'S', priceAdjustment: 0, stock: 50 },
          { value: 'M', priceAdjustment: 0, stock: 75 },
          { value: 'L', priceAdjustment: 0, stock: 75 },
          { value: 'XL', priceAdjustment: 2, stock: 50 }
        ]
      }
    ],
    stock: 250,
    tags: ['clothing', 'hoodie', 'tour', 'merch'],
    featured: false,
    stats: {
      sales: 203,
      views: 3456,
      likes: 287
    }
  },

  // Luna Waves Products
  {
    name: 'Acoustic EP - "Moonlight Sessions"',
    description: 'Intimate acoustic EP featuring stripped-down versions of fan favorites. Recorded live.',
    price: 9.99,
    category: 'digital',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=800&fit=crop',
        alt: 'Moonlight Sessions EP Cover'
      }
    ],
    variants: [],
    stock: 9999,
    digitalContent: 'https://example.com/downloads/moonlight-sessions.zip',
    tags: ['digital', 'ep', 'acoustic', 'indie'],
    featured: true,
    stats: {
      sales: 156,
      views: 2345,
      likes: 112
    }
  },
  {
    name: 'Cassette Tape Bundle',
    description: 'Limited edition cassette tape with exclusive B-sides. Includes digital download code.',
    price: 24.99,
    category: 'physical',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=800&h=800&fit=crop',
        alt: 'Cassette Tape Bundle'
      }
    ],
    variants: [
      {
        name: 'Tape Color',
        options: [
          { value: 'Pink', priceAdjustment: 0, stock: 100 },
          { value: 'Blue', priceAdjustment: 0, stock: 100 }
        ]
      }
    ],
    stock: 200,
    tags: ['cassette', 'limited', 'retro', 'bundle'],
    featured: false,
    stats: {
      sales: 67,
      views: 1234,
      likes: 78
    }
  },

  // Echo Theory Products
  {
    name: 'Concert Tickets - World Tour',
    description: 'General admission tickets for Echo Theory\'s World Tour 2024. Multiple dates available.',
    price: 59.99,
    category: 'ticket',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501281667305-0d4eb5394f76?w=800&h=800&fit=crop',
        alt: 'Concert Tickets'
      }
    ],
    variants: [
      {
        name: 'Venue',
        options: [
          { value: 'Madison Square Garden', priceAdjustment: 20, stock: 1000 },
          { value: 'Red Rocks Amphitheatre', priceAdjustment: 10, stock: 500 },
          { value: 'The Greek Theatre', priceAdjustment: 0, stock: 750 }
        ]
      }
    ],
    stock: 2250,
    tags: ['tickets', 'tour', 'live', 'concert'],
    featured: true,
    stats: {
      sales: 456,
      views: 5678,
      likes: 321
    }
  },
  {
    name: 'Guitar Pick Set',
    description: 'Set of 10 custom-designed guitar picks used by the band. Different thicknesses included.',
    price: 14.99,
    category: 'merch',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop',
        alt: 'Guitar Pick Set'
      }
    ],
    variants: [],
    stock: 500,
    tags: ['accessories', 'music', 'guitar', 'collectible'],
    featured: false,
    stats: {
      sales: 189,
      views: 2345,
      likes: 167
    }
  }
];

const socialPosts = [
  // Instagram-style posts
  {
    platform: 'instagram',
    content: 'Studio session vibes 🎵 Working on new material for the upcoming album! #studio #newmusic #producer',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=1200&fit=crop',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      }
    ],
    metadata: {
      externalId: 'insta_001',
      likes: 1245,
      comments: 89,
      shares: 45,
      views: 5678,
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    tags: ['studio', 'newmusic', 'producer'],
    featured: true
  },
  {
    platform: 'instagram',
    content: 'Throwback to our last show! Can\'t wait to see you all on tour! 🎸 #throwback #concert #live',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=1200&fit=crop',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      }
    ],
    metadata: {
      externalId: 'insta_002',
      likes: 890,
      comments: 56,
      shares: 23,
      views: 3456,
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    tags: ['throwback', 'concert', 'live'],
    featured: false
  },

  // TikTok-style posts
  {
    platform: 'tiktok',
    content: 'New song snippet! What do you think? 👀 Full version dropping next week! #newsong #snippet',
    media: [
      {
        url: 'https://videos.unsplash.com/video-1597609253215-55a3f8d5e5c8?mp4',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop'
      }
    ],
    metadata: {
      externalId: 'tiktok_001',
      likes: 5678,
      comments: 234,
      shares: 456,
      views: 12567,
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    tags: ['newsong', 'snippet', 'preview'],
    featured: true
  },

  // YouTube-style posts
  {
    platform: 'youtube',
    content: 'Full live performance from our last show! Link in bio to watch the full set.',
    media: [
      {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop'
      }
    ],
    metadata: {
      externalId: 'youtube_001',
      likes: 3456,
      comments: 189,
      shares: 567,
      views: 45678,
      postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    tags: ['live', 'performance', 'fullset'],
    featured: false
  },

  // Spotify-style posts
  {
    platform: 'spotify',
    content: 'New playlist curated by me! Featuring my favorite tracks of the month. Listen now!',
    media: [
      {
        url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
        type: 'audio',
        thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop'
      }
    ],
    metadata: {
      externalId: 'spotify_001',
      likes: 789,
      comments: 45,
      shares: 123,
      views: 8901,
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    tags: ['playlist', 'curated', 'music'],
    featured: true
  },

  // Native platform posts
  {
    platform: 'native',
    content: 'Announcing our exclusive merch drop! Limited quantities available. Link in bio to shop.',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w-800&h=800&fit=crop',
        type: 'image',
        thumbnail: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?w=400&h=400&fit=crop'
      }
    ],
    metadata: {
      externalId: null,
      likes: 234,
      comments: 34,
      shares: 12,
      views: 1234,
      postedAt: new Date()
    },
    tags: ['merch', 'drop', 'exclusive', 'limited'],
    featured: true
  }
];

const orders = [
  {
    items: [
      {
        quantity: 1,
        price: 39.99,
        variant: {
          name: 'Color',
          option: 'Neon Pink'
        }
      },
      {
        quantity: 1,
        price: 14.99
      }
    ],
    totalAmount: 54.98,
    shippingAddress: {
      street: '123 Music Lane',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90001'
    },
    status: 'delivered',
    payment: {
      method: 'stripe',
      transactionId: 'txn_123456',
      status: 'completed'
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  },
  {
    items: [
      {
        quantity: 2,
        price: 59.99,
        variant: {
          name: 'Venue',
          option: 'Madison Square Garden'
        }
      }
    ],
    totalAmount: 119.98,
    shippingAddress: {
      street: '456 Concert Blvd',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001'
    },
    status: 'processing',
    payment: {
      method: 'paypal',
      transactionId: 'PAY-123456',
      status: 'completed'
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await SocialPost.deleteMany({});
    await Order.deleteMany({});
    console.log('Existing data cleared.');

    // Create artists
    console.log('Creating artists...');
    const createdArtists = [];
    for (const artistData of artists) {
      const artist = new User(artistData);
      await artist.save();
      createdArtists.push(artist);
      console.log(`Created artist: ${artist.username}`);
    }

    // Create regular users
    console.log('\nCreating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create products for each artist
    console.log('\nCreating products...');
    const createdProducts = [];
    const productTemplates = [...products];
    
    // Distribute products among artists
    for (let i = 0; i < productTemplates.length; i++) {
      const productData = { ...productTemplates[i] };
      const artistIndex = Math.floor(i / 2) % createdArtists.length;
      productData.artist = createdArtists[artistIndex]._id;
      
      const product = new Product(productData);
      await product.save();
      createdProducts.push(product);
      console.log(`Created product: ${product.name} for ${createdArtists[artistIndex].username}`);
    }

    // Create social posts
    console.log('\nCreating social posts...');
    for (let i = 0; i < socialPosts.length; i++) {
      const postData = { ...socialPosts[i] };
      const artistIndex = i % createdArtists.length;
      postData.artist = createdArtists[artistIndex]._id;
      
      const post = new SocialPost(postData);
      await post.save();
      console.log(`Created ${post.platform} post for ${createdArtists[artistIndex].username}`);
    }

    // Create orders
    console.log('\nCreating orders...');
    for (let i = 0; i < orders.length; i++) {
      const orderData = { ...orders[i] };
      orderData.user = createdUsers[i % createdUsers.length]._id;
      
      // Assign actual products to order items
      for (let j = 0; j < orderData.items.length; j++) {
        const productIndex = (i + j) % createdProducts.length;
        orderData.items[j].product = createdProducts[productIndex]._id;
      }
      
      const order = new Order(orderData);
      await order.save();
      console.log(`Created order #${order._id} for ${createdUsers[i % createdUsers.length].username}`);
    }

    // Update artists with favorites and cart
    console.log('\nSetting up user favorites and cart...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      
      // Add some products to favorites
      user.favorites = [
        createdProducts[i % createdProducts.length]._id,
        createdProducts[(i + 1) % createdProducts.length]._id
      ];
      
      // Add some products to cart
      user.cart = [
        {
          product: createdProducts[i % createdProducts.length]._id,
          quantity: 1
        },
        {
          product: createdProducts[(i + 2) % createdProducts.length]._id,
          quantity: 2
        }
      ];
      
      await user.save();
      console.log(`Updated ${user.username} with favorites and cart`);
    }

    // Update product sales stats based on orders
    console.log('\nUpdating product sales statistics...');
    for (const order of await Order.find()) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { 'stats.sales': item.quantity } }
        );
      }
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Artists created: ${createdArtists.length}`);
    console.log(`   Users created: ${createdUsers.length}`);
    console.log(`   Products created: ${createdProducts.length}`);
    console.log(`   Social posts created: ${socialPosts.length}`);
    console.log(`   Orders created: ${orders.length}`);
    
    console.log('\n👤 Demo Accounts:');
    console.log('   Artist: nova@artisthub.com / password123');
    console.log('   Regular User: fan@artisthub.com / password123');
    console.log('   Admin: admin@artisthub.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
}

// Run the seeding script
seedDatabase();