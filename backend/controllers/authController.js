const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { randomBytes } = require('crypto');
const parseCookies = require('cookie-parser')();

const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
const apiOrigin = process.env.NODE_ENV === 'production' ? clientURL : 'http://localhost:3001';
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL || new URL('/api/auth/google/callback', apiOrigin).href;
const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID?.endsWith('.apps.googleusercontent.com') &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.JWT_SECRET
);
const googleCookie = { httpOnly: true, sameSite: 'lax', secure: new URL(googleCallbackURL).protocol === 'https:' };

if (googleConfigured) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: googleCallbackURL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existing = await User.findOne({ googleId: profile.id });
      if (existing) return done(null, existing);

      const email = profile.emails?.find(address => address.verified === true)?.value?.toLowerCase();
      if (!email || await User.exists({ email })) return done(null, false);

      const user = await User.create({
        googleId: profile.id,
        email,
        username: 'google' + randomBytes(8).toString('hex'),
        profileImage: profile.photos?.[0]?.value
      });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register controller
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      role: 'user'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = user.password && await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Keep OAuth state and the short-lived completion credential out of JavaScript.
exports.googleCookies = parseCookies;
exports.googleAuth = (req, res, next) => {
  if (!googleConfigured) {
    return res.redirect(new URL('/login?error=google_unavailable', clientURL).href);
  }

  const state = randomBytes(32).toString('hex');
  res.cookie('google_state', state, { ...googleCookie, maxAge: 600000 });
  return passport.authenticate('google', { scope: ['profile', 'email'], state, session: false })(req, res, next);
};

exports.googleCallback = (req, res, next) => {
  const failure = new URL('/login?error=auth_failed', clientURL).href;
  res.clearCookie('google_state', googleCookie);
  if (!googleConfigured || typeof req.query.state !== 'string' || req.query.state !== req.cookies.google_state) {
    return res.redirect(failure);
  }

  return passport.authenticate('google', { session: false }, (error, user) => {
    if (error || !user) return res.redirect(failure);
    const completion = jwt.sign({ userId: user.id, purpose: 'google-completion' }, process.env.JWT_SECRET, {
      expiresIn: '60s'
    });
    res.cookie('google_completion', completion, { ...googleCookie, maxAge: 60000 });
    return res.redirect(new URL('/auth/callback', clientURL).href);
  })(req, res, next);
};

exports.completeGoogleAuth = async (req, res) => {
  res.clearCookie('google_completion', googleCookie).set('Cache-Control', 'no-store');
  try {
    const { userId, purpose } = jwt.verify(req.cookies.google_completion, process.env.JWT_SECRET);
    if (purpose !== 'google-completion') return res.sendStatus(401);
    const user = await User.findById(userId).select('-password');
    if (!user) return res.sendStatus(401);
    return res.json({ token: generateToken(user.id), user: { ...user.toObject(), id: user.id } });
  } catch {
    return res.sendStatus(401);
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
};