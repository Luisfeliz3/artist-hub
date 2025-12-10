const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const SocialPost = require('../models/SocialPost');
const Order = require('../models/Order');

dotenv.config();

// Enhanced user data with complete profile information
const users = [
  // ==================== ARTISTS ====================
  {
    username: 'nova_rhythm',
    email: 'nova@artisthub.com',
    password: 'password123',
    profileImage: 'https://ui-avatars.com/api/?name=Nova+Rhythm&background=8A2BE2&color=fff&size=400',
    coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1600&h=400&fit=crop',
    bio: 'Electronic music producer and sound designer from Los Angeles. Creating immersive synthwave and future bass experiences. 5+ years in the industry with releases on major labels.',
    location: 'Los Angeles, CA',
    website: 'https://novarhythm.com',
    phone: '+1 (323) 555-0123',
    birthday: new Date('1992-08-15'),
    role: 'artist',
    isVerified: true,
    isActive: true,
    followers: 120,
    // following: 89,
    socialLinks: {
      instagram: 'https://instagram.com/nova_rhythm',
      twitter: 'https://twitter.com/nova_rhythm',
      tiktok: 'https://tiktok.com/@nova_rhythm',
      youtube: 'https://youtube.com/c/novarhythm',
      spotify: 'https://open.spotify.com/artist/nova',
      soundcloud: 'https://soundcloud.com/nova-rhythm',
      facebook: 'https://facebook.com/nova.rhythm.music'
    },
    artistProfile: {
      stageName: 'Nova Rhythm',
      realName: 'Alex Johnson',
      genre: ['Electronic', 'Synthwave', 'Future Bass', 'Chillwave'],
      instruments: ['Synthesizers', 'Drum Machine', 'DAW', 'Guitar'],
      influences: ['Kavinsky', 'The Midnight', 'FM-84', 'Timecop1983'],
      yearsActive: 5,
      label: 'Neon Dreams Records',
      setup: 'Ableton Live, Moog Subsequent, Roland TR-8S, Arturia KeyLab',
      achievements: [
        '2023: Synthwave Artist of the Year',
        '2022: 1M+ Streams on Spotify',
        '2021: Featured on Spotify\'s "Synthwave Now"',
        '2020: Debut album "Neon Dreams" released'
      ],
      upcomingEvents: [
        {
          date: new Date('2024-03-15'),
          venue: 'The Roxy Theatre',
          city: 'Los Angeles, CA',
          tickets: 'https://tickets.novarhythm.com'
        },
        {
          date: new Date('2024-04-20'),
          venue: 'Brooklyn Steel',
          city: 'New York, NY',
          tickets: 'https://tickets.novarhythm.com/nyc'
        }
      ],
      discography: [
        { year: 2023, title: 'Digital Dreams EP', type: 'EP', tracks: 6 },
        { year: 2022, title: 'Midnight Drive', type: 'Single', tracks: 1 },
        { year: 2021, title: 'Neon Dreams', type: 'Album', tracks: 12 },
        { year: 2020, title: 'First Light', type: 'EP', tracks: 5 }
      ]
    },
    paymentMethods: [
      {
        type: 'card',
        last4: '4242',
        expiryDate: '12/25',
        nameOnCard: 'Alex Johnson',
        isDefault: true
      },
      {
        type: 'paypal',
        email: 'alex@novarhythm.com',
        isDefault: false
      }
    ],
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false
    },
    privacy: 'public',
    theme: 'dark',
    language: 'en'
  },
  {
    username: 'luna_waves',
    email: 'luna@artisthub.com',
    password: 'password123',
    profileImage: 'https://ui-avatars.com/api/?name=Luna+Waves&background=00D4FF&color=fff&size=400',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=400&fit=crop',
    bio: 'Indie dream pop artist with ethereal vocals and atmospheric instrumentals. Based in Portland, crafting songs about love, loss, and self-discovery.',
    location: 'Portland, OR',
    website: 'https://lunawaves.com',
    phone: '+1 (503) 555-9876',
    birthday: new Date('1995-03-22'),
    role: 'artist',
    isVerified: true,
    isActive: true,
    followers: 89000,
    // following: 156,
    socialLinks: {
      instagram: 'https://instagram.com/luna_waves',
      twitter: 'https://twitter.com/luna_waves',
      tiktok: 'https://tiktok.com/@luna_waves',
      youtube: 'https://youtube.com/c/lunawaves',
      spotify: 'https://open.spotify.com/artist/luna',
      soundcloud: 'https://soundcloud.com/luna-waves',
      bandcamp: 'https://lunawaves.bandcamp.com'
    },
    artistProfile: {
      stageName: 'Luna Waves',
      realName: 'Sophie Martinez',
      genre: ['Indie', 'Dream Pop', 'Alternative', 'Folk'],
      instruments: ['Vocals', 'Guitar', 'Piano', 'Ukulele'],
      influences: ['Mitski', 'Phoebe Bridgers', 'Japanese Breakfast', 'Big Thief'],
      yearsActive: 3,
      label: 'Indie Collective',
      setup: 'Logic Pro, Taylor Guitar, Fender Jazzmaster, Focusrite Interface',
      achievements: [
        '2023: Featured on NPR Tiny Desk Contest',
        '2022: West Coast Tour (15 cities)',
        '2021: Debut EP "Moonlight Sessions" released',
        '2020: 500K+ streams across platforms'
      ],
      upcomingEvents: [
        {
          date: new Date('2024-02-28'),
          venue: 'Mississippi Studios',
          city: 'Portland, OR',
          tickets: 'https://tickets.lunawaves.com'
        }
      ],
      discography: [
        { year: 2023, title: 'Ocean Breeze', type: 'Single', tracks: 1 },
        { year: 2022, title: 'Moonlight Sessions', type: 'EP', tracks: 5 },
        { year: 2021, title: 'Starry Nights', type: 'Album', tracks: 10 }
      ]
    },
    paymentMethods: [
      {
        type: 'card',
        last4: '8888',
        expiryDate: '06/24',
        nameOnCard: 'Sophie Martinez',
        isDefault: true
      }
    ],
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: true
    },
    privacy: 'public',
    theme: 'dark',
    language: 'en'
  },
  {
    username: 'echo_theory',
    email: 'echo@artisthub.com',
    password: 'password123',
    profileImage: 'https://ui-avatars.com/api/?name=Echo+Theory&background=FF4D4D&color=fff&size=400',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1600&h=400&fit=crop',
    bio: 'Alternative rock band from Brooklyn known for powerful vocals and intricate guitar work. Blending post-rock elements with indie sensibilities.',
    location: 'Brooklyn, NY',
    website: 'https://echotheory.com',
    phone: '+1 (718) 555-4567',
    birthday: new Date('2018-06-10'), // Band formation date
    role: 'artist',
    isVerified: true,
    isActive: true,
    followers: 156000,
    // following: 203,
    socialLinks: {
      instagram: 'https://instagram.com/echo_theory',
      twitter: 'https://twitter.com/echo_theory',
      tiktok: 'https://tiktok.com/@echo_theory',
      youtube: 'https://youtube.com/c/echotheory',
      spotify: 'https://open.spotify.com/artist/echo',
      bandcamp: 'https://echotheory.bandcamp.com',
      facebook: 'https://facebook.com/echotheoryband'
    },
    artistProfile: {
      stageName: 'Echo Theory',
      realName: 'Band',
      genre: ['Alternative Rock', 'Indie Rock', 'Post-Rock', 'Shoegaze'],
      instruments: ['Vocals', 'Guitar', 'Bass', 'Drums', 'Synth'],
      influences: ['Radiohead', 'Interpol', 'The National', 'Slowdive'],
      yearsActive: 6,
      label: 'Brooklyn Sound Records',
      setup: 'Multiple guitar rigs, vintage synthesizers, full drum kit',
      achievements: [
        '2023: Headlined Brooklyn Steel (sold out)',
        '2022: National Tour (30+ cities)',
        '2021: Album "Reflections" reached #15 on indie charts',
        '2020: Featured in Rolling Stone "Artists to Watch"'
      ],
      upcomingEvents: [
        {
          date: new Date('2024-05-10'),
          venue: 'Madison Square Garden',
          city: 'New York, NY',
          tickets: 'https://tickets.echotheory.com/msg'
        },
        {
          date: new Date('2024-06-15'),
          venue: 'Red Rocks Amphitheatre',
          city: 'Morrison, CO',
          tickets: 'https://tickets.echotheory.com/redrocks'
        }
      ],
      discography: [
        { year: 2023, title: 'Urban Echoes', type: 'Album', tracks: 11 },
        { year: 2022, title: 'Midnight City', type: 'Single', tracks: 1 },
        { year: 2021, title: 'Reflections', type: 'Album', tracks: 10 },
        { year: 2020, title: 'First Light EP', type: 'EP', tracks: 6 }
      ]
    },
    paymentMethods: [
      {
        type: 'card',
        last4: '5555',
        expiryDate: '09/26',
        nameOnCard: 'Echo Theory LLC',
        isDefault: true
      },
      {
        type: 'bank',
        accountType: 'business',
        isDefault: false
      }
    ],
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: true
    },
    privacy: 'public',
    theme: 'dark',
    language: 'en'
  },
  {
    username: 'midnight_syntax',
    email: 'midnight@artisthub.com',
    password: 'password123',
    profileImage: 'https://ui-avatars.com/api/?name=Midnight+Syntax&background=00CC88&color=fff&size=400',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=400&fit=crop',
    bio: 'Hip-hop producer and beatmaker from Atlanta. Specializing in lo-fi beats, boom bap, and experimental hip-hop production.',
    location: 'Atlanta, GA',
    website: 'https://midnightsyntax.com',
    phone: '+1 (404) 555-7890',
    birthday: new Date('1990-11-30'),
    role: 'artist',
    isVerified: false,
    isActive: true,
    followers: 45000,
    // following: 67,
    socialLinks: {
      instagram: 'https://instagram.com/midnight_syntax',
      twitter: 'https://twitter.com/midnight_syntax',
      youtube: 'https://youtube.com/c/midnightsyntax',
      spotify: 'https://open.spotify.com/artist/midnight',
      soundcloud: 'https://soundcloud.com/midnight-syntax',
      bandcamp: 'https://midnightsyntax.bandcamp.com'
    },
    artistProfile: {
      stageName: 'Midnight Syntax',
      realName: 'Marcus Williams',
      genre: ['Hip Hop', 'Lo-fi', 'Boom Bap', 'Experimental'],
      instruments: ['MPC', 'Sampler', 'Keyboard', 'DAW'],
      influences: ['J Dilla', 'Madlib', 'Flying Lotus', 'Knxwledge'],
      yearsActive: 8,
      label: 'Independent',
      setup: 'MPC Live II, SP-404, Komplete Kontrol, Studio Monitors',
      achievements: [
        '2023: Beat featured on major label album',
        '2022: 100K monthly listeners on Spotify',
        '2021: Started beat subscription service',
        '2020: Beat tape series "Midnight Sessions"'
      ],
      upcomingEvents: [
        {
          date: new Date('2024-04-05'),
          venue: 'Aisle 5',
          city: 'Atlanta, GA',
          tickets: 'https://tickets.midnightsyntax.com'
        }
      ],
      discography: [
        { year: 2023, title: 'Urban Grooves Vol. 3', type: 'Beat Tape', tracks: 15 },
        { year: 2022, title: 'Night Shift', type: 'EP', tracks: 7 },
        { year: 2021, title: 'Midnight Sessions II', type: 'Album', tracks: 12 }
      ]
    },
    paymentMethods: [
      {
        type: 'paypal',
        email: 'marcus@midnightsyntax.com',
        isDefault: true
      }
    ],
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false
    },
    privacy: 'private',
    theme: 'dark',
    language: 'en'
  },
  
  // ==================== REGULAR USERS ====================
  {
    username: 'music_fan',
    email: 'fan@artisthub.com',
    password: 'password123',
    profileImage: 'https://ui-avatars.com/api/?name=Music+Fan&background=FFAA00&color=fff&size=400',
    coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1600&h=400&fit=crop',
    bio: 'Music enthusiast and collector. Always searching for new artists and supporting independent music. Vinyl collector with 500+ records.',
    location: 'Chicago, IL',
    website: '',
    phone: '+1 (312) 555-1234',
    birthday: new Date('1988-05-18'),
    role: 'user',
    isVerified: true,
    isActive: true,
    followers: 245,
    // following: 128,
    socialLinks: {
      instagram: 'https://instagram.com/musicfan88',
      twitter: 'https://twitter.com/musicfan88',
      spotify: 'https://open.spotify.com/user/musicfan88'
    },
    paymentMethods: [
      {
        type: 'card',
        last4: '1234',
        expiryDate: '03/25',
        nameOnCard: 'John Smith',
        isDefault: true
      },
      {
        type: 'card',
        last4: '5678',
        expiryDate: '11/24',
        nameOnCard: 'John Smith',
        isDefault: false
      }
    ],
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: true
    },
    privacy: 'public',
    theme: 'dark',
    language: 'en',
    preferences: {
      favoriteGenres: ['Electronic', 'Indie', 'Alternative', 'Jazz'],
      notificationFrequency: 'daily',
      autoplay: true,
      explicitContent: true
    }
  },
  {
    username: 'vinyl_collector',
    email: 'collector@artisthub.com',
    password: 'password123',
    profileImage: 'https://ui-avatars.com/api/?name=Vinyl+Collector&background=9C27B0&color=fff&size=400',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=400&fit=crop',
    bio: 'Passionate vinyl collector since 2010. Specializing in limited edition pressings and rare finds. Always on the hunt for colored vinyl!',
    location: 'Seattle, WA',
    website: 'https://vinylblog.collector.com',
    phone: '+1 (206) 555-9876',
    birthday: new Date('1985-09-12'),
    role: 'user',
    isVerified: false,
    isActive: true,
    followers: 567,
    // following: 89,
    socialLinks: {
      instagram: 'https://instagram.com/vinyl_collector',
      twitter: 'https://twitter.com/vinylcollector',
      discogs: 'https://discogs.com/user/vinylcollector'
    },
    paymentMethods: [
      {
        type: 'card',
        last4: '4321',
        expiryDate: '08/26',
        nameOnCard: 'Michael Chen',
        isDefault: true
      },
      {
        type: 'paypal',
        email: 'michael@collector.com',
        isDefault: false
      }
    ],
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: true
    },
    privacy: 'friends',
    theme: 'light',
    language: 'en',
    preferences: {
      favoriteGenres: ['Rock', 'Jazz', 'Folk', 'Classical'],
      notificationFrequency: 'weekly',
      autoplay: false,
      explicitContent: false
    }
  },
  {
    username: 'concert_goer',
    email: 'concert@artisthub.com',
    password: 'password123',
    profileImage: 'https://ui-avatars.com/api/?name=Concert+Goer&background=FF4D4D&color=fff&size=400',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1600&h=400&fit=crop',
    bio: 'Live music enthusiast! Attended 50+ concerts in the past year. Always looking for the next great show. Front row or nothing!',
    location: 'Austin, TX',
    website: '',
    phone: '+1 (512) 555-3456',
    birthday: new Date('1993-07-25'),
    role: 'user',
    isVerified: true,
    isActive: true,
    followers: 892,
    // following: 456,
    socialLinks: {
      instagram: 'https://instagram.com/concert_goer',
      twitter: 'https://twitter.com/concertgoer93',
      songkick: 'https://songkick.com/users/concertgoer'
    },
    paymentMethods: [
      {
        type: 'card',
        last4: '9876',
        expiryDate: '05/25',
        nameOnCard: 'Sarah Johnson',
        isDefault: true
      }
    ],
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: true
    },
    privacy: 'public',
    theme: 'dark',
    language: 'en',
    preferences: {
      favoriteGenres: ['Alternative', 'Indie', 'Rock', 'Electronic'],
      notificationFrequency: 'instant',
      autoplay: true,
      explicitContent: true
    }
  },
  
  // ==================== ADMIN USER ====================
  {
    username: 'admin_user',
    email: 'admin@artisthub.com',
    password: 'password123',
    profileImage: 'https://ui-avatars.com/api/?name=Admin+User&background=607D8B&color=fff&size=400',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=400&fit=crop',
    bio: 'Platform administrator and community manager. Dedicated to supporting artists and creating the best music community online.',
    location: 'San Francisco, CA',
    website: 'https://artisthub.com/admin',
    phone: '+1 (415) 555-7890',
    birthday: new Date('1982-12-01'),
    role: 'admin',
    isVerified: true,
    isActive: true,
    followers: 1200,
    // following: 345,
    socialLinks: {
      twitter: 'https://twitter.com/artisthub_admin',
      linkedin: 'https://linkedin.com/in/artisthub-admin'
    },
    paymentMethods: [
      {
        type: 'card',
        last4: '0000',
        expiryDate: '12/30',
        nameOnCard: 'ArtistHub Admin',
        isDefault: true
      }
    ],
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false
    },
    privacy: 'private',
    theme: 'dark',
    language: 'en',
    adminPermissions: {
      canManageUsers: true,
      canManageContent: true,
      canManagePayments: true,
      canViewAnalytics: true,
      canManageArtists: true
    }
  }
];

// Sample products for artists
const products = [
  // Nova Rhythm Products
  {
    name: 'Digital Album - "Neon Dreams"',
    description: 'Full digital album featuring 12 tracks of futuristic synthwave. Includes bonus instrumental versions.',
    price: 19.99,
    category: 'digital',
    images: [
      {
        url: 'https://ui-avatars.com/api/?name=Neon+Dreams&background=8A2BE2&color=fff&size=800',
        alt: 'Neon Dreams Album Cover'
      }
    ],
    stock: 9999,
    digitalContent: 'https://example.com/downloads/neon-dreams.zip',
    tags: ['digital', 'album', 'synthwave', 'electronic'],
    featured: true,
    stats: {
      sales: 124,
      views: 2567,
      likes: 89,
      averageRating : 5,
      reviewCount :23

    }
  },
  {
    name: 'Limited Edition Vinyl',
    description: '180g vinyl pressing of "Neon Dreams" with exclusive artwork and liner notes. Limited to 500 copies.',
    price: 39.99,
    category: 'physical',
    images: [
      {
        url: 'https://ui-avatars.com/api/?name=Vinyl+Edition&background=00D4FF&color=fff&size=800',
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
      likes: 145,
      averageRating : 4,
      reviewCount :13
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
        url: 'https://ui-avatars.com/api/?name=Moonlight+Sessions&background=00CC88&color=fff&size=800',
        alt: 'Moonlight Sessions EP Cover'
      }
    ],
    stock: 9999,
    digitalContent: 'https://example.com/downloads/moonlight-sessions.zip',
    tags: ['digital', 'ep', 'acoustic', 'indie'],
    featured: true,
    stats: {
      sales: 156,
      views: 2345,
      likes: 112,
      averageRating : 3,
      reviewCount :44
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
        url: 'https://ui-avatars.com/api/?name=Concert+Tickets&background=FF4D4D&color=fff&size=800',
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
      likes: 321,
         averageRating : 4,
      reviewCount :54
    }
  }
];

// Sample social posts
const socialPosts = [
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
    tags: ['studio', 'newmusic', 'producer'],
    featured: true
  },
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
    tags: ['newsong', 'snippet', 'preview'],
    featured: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://user1:password1234@cluster0.k6ma6.mongodb.net/artist-hub?retryWrites=true&w=majority") 
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await SocialPost.deleteMany({});
    await Order.deleteMany({});
    console.log('Existing data cleared.');

    // Create users
    console.log('\nCreating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username} (${user.role})`);
    }

    // Create products and assign to artists
    console.log('\nCreating products...');
    const createdProducts = [];
    
    // Get artist users
    const artists = createdUsers.filter(user => user.role === 'artist');
    const regularUsers = createdUsers.filter(user => user.role === 'user');
    
    for (let i = 0; i < products.length; i++) {
      const productData = { ...products[i] };
      
      // Assign products to artists in round-robin fashion
      const artistIndex = i % artists.length;
      productData.artist = artists[artistIndex]._id;
      
      const product = new Product(productData);
      await product.save();
      createdProducts.push(product);
      console.log(`Created product: ${product.name} for ${artists[artistIndex].username}`);
      
      // Add product to artist's products array
      await User.findByIdAndUpdate(artists[artistIndex]._id, {
        $push: { products: product._id }
      });
    }

    // Create social posts and assign to artists
    console.log('\nCreating social posts...');
    for (let i = 0; i < socialPosts.length; i++) {
      const postData = { ...socialPosts[i] };
      const artistIndex = i % artists.length;
      postData.artist = artists[artistIndex]._id;
      
      const post = new SocialPost(postData);
      await post.save();
      console.log(`Created ${post.platform} post for ${artists[artistIndex].username}`);
    }

    // Create sample orders
    console.log('\nCreating sample orders...');
    const sampleOrders = [
      {
        items: [
          {
            quantity: 1,
            price: 39.99,
            product: createdProducts[1]._id, // Vinyl
            variant: {
              name: 'Color',
              option: 'Neon Pink'
            }
            
          }
        ],
        role : createdUsers[1]._id,
        orderNumber : "000001019201",
        subtotal : 40.98,
        customerEmail : "ipayed@pay.com",
        name :"Iamname",
        totalAmount: 44.99, // including variant price adjustment
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
        }
      },
      {
        items: [
          {
            quantity: 2,
            price: 59.99,
            product: createdProducts[3]._id, // Concert tickets
            variant: {
              artist: "THE MAX VIBE@",
              name: 'Venue',
              option: 'Madison Square Garden'
            }
          }
        ],
        role : createdUsers[1]._id,
        orderNumber : "000001019201B",
        totalAmount: 139.98,
        subtotal : 44.65,
        customerEmail : "uowe@pay.com",
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
        }
      }
    ];

    for (let i = 0; i < sampleOrders.length; i++) {
      const orderData = { ...sampleOrders[i] };
      const userIndex = i % regularUsers.length;
      orderData.user = regularUsers[userIndex]._id;
      
      const order = new Order(orderData);
      await order.save();
      console.log(`Created order for ${regularUsers[userIndex].username}`);
    }

    // Create following relationships
    console.log('\nCreating following relationships...');
    
    // Music Fan follows all artists
    const musicFan = createdUsers.find(u => u.username === 'music_fan');
    if (musicFan) {
      for (const artist of artists) {
        await User.findByIdAndUpdate(musicFan._id, {
          $push: { following: artist._id }
        });
        await User.findByIdAndUpdate(artist._id, {
          $inc: { followers: 1 }
        });
      }
      console.log(`Music Fan now follows ${artists.length} artists`);
    }

    // Vinyl Collector follows some artists
    const vinylCollector = createdUsers.find(u => u.username === 'vinyl_collector');
    if (vinylCollector && artists.length >= 2) {
      await User.findByIdAndUpdate(vinylCollector._id, {
        $push: { following: artists[0]._id }
      });
      await User.findByIdAndUpdate(artists[0]._id, {
        $inc: { followers: 1 }
      });
      console.log(`Vinyl Collector now follows ${artists[0].username}`);
    }

    // Add products to user carts
    console.log('\nAdding products to user carts...');
    for (let i = 0; i < regularUsers.length; i++) {
      const user = regularUsers[i];
      const productIndex = i % createdProducts.length;
      
      await User.findByIdAndUpdate(user._id, {
        $push: {
          cart: {
            product: createdProducts[productIndex]._id,
            quantity: 1
          },
          favorites: createdProducts[(productIndex + 1) % createdProducts.length]._id
        }
      });
      console.log(`Added products to ${user.username}'s cart and favorites`);
    }

    // Update product sales stats based on orders
    console.log('\nUpdating product sales statistics...');
    const allOrders = await Order.find();
    for (const order of allOrders) {
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { 'stats.sales': item.quantity } }
          );
        }
      }
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Total Users: ${createdUsers.length}`);
    console.log(`   Artists: ${artists.length}`);
    console.log(`   Regular Users: ${regularUsers.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Social Posts: ${socialPosts.length}`);
    console.log(`   Orders: ${sampleOrders.length}`);
    
    console.log('\n👤 Demo Accounts:');
    console.log('   Artist: nova@artisthub.com / password123');
    console.log('   Regular User: fan@artisthub.com / password123');
    console.log('   Admin: admin@artisthub.com / password123');
    
    console.log('\n🎯 Sample Profile URLs:');
    console.log('   Artist Profile: /profile/nova_rhythm');
    console.log('   User Profile: /profile/music_fan');
    console.log('   Admin Profile: /profile/admin_user');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
}

// Run the seeding script
seedDatabase();