// ============================================
// 🔒 AUTHENTICATION ROUTES (VERCEL OPTIMIZED)
// ============================================

import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Set token cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// ==========================================
// 📝 REGISTER USER
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
    }

    // Check username if provided
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          error: 'Username already taken',
        });
      }
    }

    // Create user
    const user = await User.create({
      firstName: firstName || '',
      lastName: lastName || '',
      username: username || email.split('@')[0],
      email,
      password,
      provider: 'local',
    });

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    setTokenCookie(res, token);

    // Send response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during registration',
    });
  }
});

// ==========================================
// 🔑 LOGIN USER
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔥 Login attempt:', { email });

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if user registered with OAuth
    if (user.provider !== 'local' && !user.password) {
      return res.status(401).json({
        success: false,
        error: `This account was created with ${user.provider}. Please use ${user.provider} login.`,
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    setTokenCookie(res, token);

    console.log('✅ Login successful:', email);

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during login',
    });
  }
});

// ==========================================
// 🚪 LOGOUT
// ==========================================
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// ==========================================
// 👤 GET CURRENT USER
// ==========================================
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        provider: req.user.provider,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user data',
    });
  }
});

// ==========================================
// 🌐 GOOGLE OAUTH - ADD ERROR HANDLING
// ==========================================
router.get('/google', (req, res, next) => {
  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ Google OAuth not configured');
    return res.status(500).json({
      success: false,
      error: 'Google OAuth is not configured on the server'
    });
  }

  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
  }, (err, user) => {
    if (err) {
      console.error('Google callback error:', err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
    }
    
    if (!user) {
      console.error('No user returned from Google');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_user`);
    }

    try {
      const token = generateToken(user._id);
      setTokenCookie(res, token);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}`);
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_failed`);
    }
  })(req, res, next);
});

// ==========================================
// 🐙 GITHUB OAUTH - ADD ERROR HANDLING
// ==========================================
router.get('/github', (req, res, next) => {
  // Check if GitHub OAuth is configured
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.error('❌ GitHub OAuth not configured');
    return res.status(500).json({
      success: false,
      error: 'GitHub OAuth is not configured on the server'
    });
  }

  passport.authenticate('github', { 
    scope: ['user:email'],
    session: false 
  })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
  }, (err, user) => {
    if (err) {
      console.error('GitHub callback error:', err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_auth_failed`);
    }
    
    if (!user) {
      console.error('No user returned from GitHub');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_user`);
    }

    try {
      const token = generateToken(user._id);
      setTokenCookie(res, token);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}`);
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_failed`);
    }
  })(req, res, next);
});

export default router;