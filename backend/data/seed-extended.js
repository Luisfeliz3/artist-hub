const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const SocialPost = require('../models/SocialPost');
const Order = require('../models/Order');
// const { faker } = require('@faker-js/faker');

dotenv.config();

// Generate random data using faker
function generateExtendedSeedData() {
  const extendedArtists = [];
  const extendedUsers = [];
  const extendedProducts = [];
  const extendedSocialPosts = [];
  const extendedOrders = [];

  // Generate 10 artists
  for (let i = 0; i < 10; i++) {
    const genres = [
      ['Electronic', 'Synthwave'],
      ['Indie', 'Dream Pop'],
      ['Alternative Rock', 'Indie Rock'],
      ['Hip Hop', 'Rap'],
      ['R&B', 'Soul'],
      ['Jazz', 'Fusion'],
      ['Classical', 'Orchestral'],
      ['Metal', 'Hard Rock'],
      ['Folk', 'Acoustic'],
      ['Pop', 'Dance']
    ];
    
    extendedArtists.push({
      username: faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, '_'),
      email: faker.internet.email(),
      password: 'password123',
      profileImage: faker.image.avatar(),
      role: 'artist',
      artistProfile: {
        bio: faker.lorem.paragraph(),
        genre: genres[i],
        location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
        website: faker.internet.url(),
        socialLinks: {
          instagram: `https://instagram.com/${faker.internet.userName()}`,
          twitter: `https://twitter.com/${faker.internet.userName()}`,
          tiktok: `https://tiktok.com/@${faker.internet.userName()}`,
          youtube: `https://youtube.com/c/${faker.internet.userName()}`,
          spotify: `https://open.spotify.com/artist/${faker.string.alphanumeric(22)}`
        }
      }
    });
  }

  // Generate 20 regular users
  for (let i = 0; i < 20; i++) {
    extendedUsers.push({
      username: faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, '_'),
      email: faker.internet.email(),
      password: 'password123',
      profileImage: faker.image.avatar(),
      role: 'user',
      artistProfile: null
    });
  }

  // Generate 50 products
  const productTypes = [
    { name: 'Digital Album', category: 'digital', priceRange: [9.99, 24.99] },
    { name: 'Limited Vinyl', category: 'physical', priceRange: [29.99, 49.99] },
    { name: 'Merch Hoodie', category: 'merch', priceRange: [44.99, 74.99] },
    { name: 'Concert Ticket', category: 'ticket', priceRange: [39.99, 149.99] },
    { name: 'Instrument Pick', category: 'merch', priceRange: [4.99, 19.99] },
    { name: 'Poster Print', category: 'merch', priceRange: [14.99, 34.99] },
    { name: 'Sticker Pack', category: 'merch', priceRange: [4.99, 14.99] },
    { name: 'Digital Single', category: 'digital', priceRange: [1.99, 4.99] },
    { name: 'Cassette Tape', category: 'physical', priceRange: [14.99, 29.99] },
    { name: 'CD Bundle', category: 'physical', priceRange: [19.99, 39.99] }
  ];

  for (let i = 0; i < 50; i++) {
    const type = productTypes[Math.floor(Math.random() * productTypes.length)];
    const price = faker.number.float({ 
      min: type.priceRange[0], 
      max: type.priceRange[1], 
      fractionDigits: 2 
    });
    
    extendedProducts.push({
      name: `${type.name} - "${faker.music.songName()}"`,
      description: faker.commerce.productDescription(),
      price: price,
      category: type.category,
      images: [
        {
          url: faker.image.urlPicsumPhotos({ width: 800, height: 800 }),
          alt: faker.lorem.words(3)
        }
      ],
      variants: Math.random() > 0.5 ? [
        {
          name: 'Size',
          options: [
            { value: 'S', priceAdjustment: 0, stock: faker.number.int({ min: 10, max: 100 }) },
            { value: 'M', priceAdjustment: 0, stock: faker.number.int({ min: 10, max: 100 }) },
            { value: 'L', priceAdjustment: 0, stock: faker.number.int({ min: 10, max: 100 }) },
            { value: 'XL', priceAdjustment: 2, stock: faker.number.int({ min: 10, max: 100 }) }
          ]
        }
      ] : [],
      stock: faker.number.int({ min: 10, max: 1000 }),
      digitalContent: type.category === 'digital' ? faker.internet.url() : null,
      tags: faker.lorem.words(faker.number.int({ min: 2, max: 5 })).split(' '),
      featured: Math.random() > 0.7,
      stats: {
        sales: faker.number.int({ min: 0, max: 500 }),
        views: faker.number.int({ min: 100, max: 5000 }),
        likes: faker.number.int({ min: 0, max: 300 })
      },
      createdAt: faker.date.past({ years: 1 })
    });
  }

  // Generate 100 social posts
  const platforms = ['instagram', 'tiktok', 'youtube', 'spotify', 'twitter', 'native'];
  const postTypes = ['image', 'video', 'audio'];
  
  for (let i = 0; i < 100; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const postType = platform === 'spotify' ? 'audio' : 
                     platform === 'youtube' || platform === 'tiktok' ? 'video' : 'image';
    
    extendedSocialPosts.push({
      platform: platform,
      content: faker.lorem.sentence(),
      media: [
        {
          url: postType === 'image' ? faker.image.urlPicsumPhotos({ width: 1200, height: 1200 }) :
               postType === 'video' ? 'https://example.com/video.mp4' :
               'https://open.spotify.com/track/' + faker.string.alphanumeric(22),
          type: postType,
          thumbnail: faker.image.urlPicsumPhotos({ width: 400, height: 400 })
        }
      ],
      metadata: {
        externalId: faker.string.alphanumeric(10),
        likes: faker.number.int({ min: 100, max: 10000 }),
        comments: faker.number.int({ min: 10, max: 1000 }),
        shares: faker.number.int({ min: 5, max: 500 }),
        views: faker.number.int({ min: 1000, max: 50000 }),
        postedAt: faker.date.recent({ days: 30 })
      },
      tags: faker.lorem.words(faker.number.int({ min: 2, max: 5 })).split(' '),
      featured: Math.random() > 0.8
    });
  }

  // Generate 30 orders
  for (let i = 0; i < 30; i++) {
    const itemCount = faker.number.int({ min: 1, max: 4 });
    const items = [];
    let totalAmount = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const price = faker.number.float({ min: 5, max: 100, fractionDigits: 2 });
      items.push({
        quantity: faker.number.int({ min: 1, max: 3 }),
        price: price
      });
      totalAmount += price * items[j].quantity;
    }
    
    extendedOrders.push({
      items: items,
      totalAmount: totalAmount,
      shippingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        country: faker.location.countryCode(),
        zipCode: faker.location.zipCode()
      },
      status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      payment: {
        method: faker.helpers.arrayElement(['stripe', 'paypal', 'credit_card']),
        transactionId: faker.string.alphanumeric(20),
        status: faker.helpers.arrayElement(['pending', 'completed', 'failed'])
      },
      createdAt: faker.date.past({ years: 1 })
    });
  }

  return {
    extendedArtists,
    extendedUsers,
    extendedProducts,
    extendedSocialPosts,
    extendedOrders
  };
}

async function seedExtendedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for extended seeding...');

    // Generate data
    const {
      extendedArtists,
      extendedUsers,
      extendedProducts,
      extendedSocialPosts,
      extendedOrders
    } = generateExtendedSeedData();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await SocialPost.deleteMany({});
    await Order.deleteMany({});

    // Create artists
    console.log('Creating artists...');
    const createdArtists = [];
    for (const artistData of extendedArtists) {
      const artist = new User(artistData);
      await artist.save();
      createdArtists.push(artist);
    }

    // Create users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of extendedUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    // Create products
    console.log('Creating products...');
    const createdProducts = [];
    for (let i = 0; i < extendedProducts.length; i++) {
      const productData = { ...extendedProducts[i] };
      const artistIndex = i % createdArtists.length;
      productData.artist = createdArtists[artistIndex]._id;
      
      const product = new Product(productData);
      await product.save();
      createdProducts.push(product);
    }

    // Create social posts
    console.log('Creating social posts...');
    for (let i = 0; i < extendedSocialPosts.length; i++) {
      const postData = { ...extendedSocialPosts[i] };
      const artistIndex = i % createdArtists.length;
      postData.artist = createdArtists[artistIndex]._id;
      
      const post = new SocialPost(postData);
      await post.save();
    }

    // Create orders
    console.log('Creating orders...');
    for (let i = 0; i < extendedOrders.length; i++) {
      const orderData = { ...extendedOrders[i] };
      orderData.user = createdUsers[i % createdUsers.length]._id;
      
      // Assign random products
      for (let j = 0; j < orderData.items.length; j++) {
        const productIndex = Math.floor(Math.random() * createdProducts.length);
        orderData.items[j].product = createdProducts[productIndex]._id;
      }
      
      const order = new Order(orderData);
      await order.save();
    }

    console.log('\n✅ Extended database seeding completed!');
    console.log(`📊 Created ${createdArtists.length} artists, ${createdUsers.length} users, ${createdProducts.length} products, ${extendedSocialPosts.length} social posts, and ${extendedOrders.length} orders.`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Install faker if needed: npm install @faker-js/faker
seedExtendedDatabase();