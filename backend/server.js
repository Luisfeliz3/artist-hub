const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger =  require("morgan");
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
 
const app = express();
const fileURLToPath =  require("url");


app.use(logger("dev"));

const PORT = process.env.PORT || 3001;

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

connectDB();

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.get("/artist", (req,res)=>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
)
app.get("/profile", (req,res)=>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
)

// app.get("/shop", (req,res)=>
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
// )
// app.get("/music", (req,res)=>
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
//   )
app.get("/users", (req,res)=>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  )
// app.get("/products", (req,res)=>
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
//   )
// app.get("/social", (req,res)=>
//   res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
//   )

// app.get("/stats", (req,res)=>
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
//   )

//   app.get("/feed", (req,res)=>
//   res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
// )
app.get("/login", (req,res)=>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
)
// app.get("/register", (req,res)=>
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
// )
// app.get("/checkout", (req,res)=>
//   res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
// )
// app.get("/dashboard", (req,res)=>
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
// )

}


// Stripe webhook needs raw body - must come before express.json()
// app.use('/api/stripe/webhook', express.raw({type: 'application/json'}), require('./routes/stripe'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));






// Enhanced CORS configuration
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     const allowedOrigins = [
//     'http://localhost:3000/api',
//     'https://artist-hub-ebw6.onrender.com', // Your frontend Render URL
//     process.env.CLIENT_URL
//     ];
    
//     if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   optionsSuccessStatus: 200,
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'X-Requested-With',
//     'Accept',
//     'Origin',
//     'Access-Control-Allow-Headers',
//   ],
//   exposedHeaders: ['Content-Type', 'X-Requested-With'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   maxAge: 86400 // 24 hours
// };

const corsOptions = {
  origin: [
    'http://localhost:3000/api',
    'https://artist-hub-ebw6.onrender.com', // Your frontend Render URL
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const socialRoutes = require('./routes/social');
const musicRoutes = require('./routes/music');
const seedRoutes = require('./routes/seed');
const statsRoutes = require('./routes/stats');
const artistsRoutes = require('./routes/artist');
// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/artists', artistsRoutes);
// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});



// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API route not found' 
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong on the server!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});



app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});