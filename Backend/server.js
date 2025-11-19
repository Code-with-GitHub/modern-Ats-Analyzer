// ============================================
// 🚀 RESUME OPTIMIZER BACKEND WITH AUTH
// ============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import custom modules
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js';
import { protect } from './middleware/authmiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';

// ==========================================
// 🗄️ CONNECT TO DATABASE
// ==========================================
connectDB();

// ==========================================
// 🛡️ MIDDLEWARE (BEFORE ROUTES)
// ==========================================

// CORS - Must be first
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// 🔐 PASSPORT CONFIGURATION
// ==========================================

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              user.googleId = profile.id;
              user.avatar = profile.photos[0]?.value;
              await user.save();
            } else {
              user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                avatar: profile.photos[0]?.value,
                provider: 'google',
              });
            }
          }

          return done(null, user);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback',
        scope: ['user:email'],
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
            user = await User.findOne({ email });

            if (user) {
              user.githubId = profile.id;
              user.avatar = profile.photos?.[0]?.value;
              await user.save();
            } else {
              user = await User.create({
                githubId: profile.id,
                email,
                username: profile.username,
                firstName: profile.displayName?.split(' ')[0] || profile.username,
                lastName: profile.displayName?.split(' ')[1] || '',
                avatar: profile.photos?.[0]?.value,
                provider: 'github',
              });
            }
          }

          return done(null, user);
        } catch (error) {
          console.error('GitHub OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
}

// ==========================================
// 🔑 AI CLIENT INITIALIZATION
// ==========================================

let aiClient;
let geminiModel;

if (AI_PROVIDER === 'gemini') {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
    process.exit(1);
  }

  aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  geminiModel = aiClient.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
  });

  console.log('✅ Gemini client initialized');
}

// ==========================================
// 📊 CALL AI FUNCTION
// ==========================================

async function callAI(systemPrompt, userPrompt) {
  try {
    if (AI_PROVIDER === 'gemini') {
      console.log('🤖 Calling Google Gemini...');

      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await geminiModel.generateContent(fullPrompt);
      const response = result.response;

      return response.text();
    }

    throw new Error('Invalid AI provider specified');
  } catch (error) {
    console.error('❌ AI API Error:', error.message);

    if (error.message && error.message.includes('API key')) {
      throw new Error('Invalid API key. Please check your .env file.');
    }

    throw error;
  }
}

// ==========================================
// 🔗 ROUTES
// ==========================================

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Resume Optimizer API is running',
    status: 'ok',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      analyze: '/api/analyze-resume (Protected)',
      match: '/api/match-job (Protected)',
    },
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: AI_PROVIDER,
    database: 'connected',
    message: 'Resume Optimizer API is running',
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// ==========================================
// 📝 ROUTE: ANALYZE RESUME (Protected)
// ==========================================

app.post('/api/analyze-resume', protect, async (req, res) => {
  try {
    console.log('📨 Received resume analysis request');

    const { resumeText, prompt } = req.body;

    if (!resumeText || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing resumeText or prompt in request body',
      });
    }

    if (resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is too short (minimum 50 characters)',
      });
    }

    console.log(`📄 Resume length: ${resumeText.length} characters`);
    console.log(`👤 User: ${req.user.email}`);

    const systemPrompt =
      'You are an expert resume reviewer and ATS specialist. Always respond with valid JSON only, no additional text.';
    const userPrompt = prompt.replace('{{DOCUMENT_TEXT}}', resumeText);

    const aiResponse = await callAI(systemPrompt, userPrompt);

    console.log('✅ AI response received');

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const analysisData = JSON.parse(jsonMatch[0]);

    if (!analysisData.overallScore && !analysisData.error) {
      throw new Error('Invalid analysis format from AI');
    }

    if (analysisData.error) {
      return res.status(400).json({
        success: false,
        error: analysisData.error,
      });
    }

    return res.json({
      success: true,
      data: analysisData,
    });
  } catch (error) {
    console.error('❌ Analysis error:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze resume. Please try again.',
    });
  }
});

// ==========================================
// 🎯 ROUTE: MATCH RESUME WITH JOB (Protected)
// ==========================================

app.post('/api/match-job', protect, async (req, res) => {
  try {
    console.log('📨 Received job matching request');

    const { resumeText, jobDescription, prompt } = req.body;

    if (!resumeText || !jobDescription || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: resumeText, jobDescription, or prompt',
      });
    }

    if (resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is too short',
      });
    }

    if (jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Job description is too short',
      });
    }

    console.log(
      `📄 Resume: ${resumeText.length} chars, Job: ${jobDescription.length} chars`
    );
    console.log(`👤 User: ${req.user.email}`);

    const systemPrompt =
      'You are an expert recruiter and ATS system analyzer. Always respond with valid JSON only, no additional text.';
    const userPrompt = prompt
      .replace('{{RESUME_TEXT}}', resumeText)
      .replace('{{JOB_DESCRIPTION}}', jobDescription);

    const aiResponse = await callAI(systemPrompt, userPrompt);

    console.log('✅ AI response received');

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const matchData = JSON.parse(jsonMatch[0]);

    if (!matchData.matchPercentage) {
      throw new Error('Invalid match format from AI');
    }

    return res.json({
      success: true,
      data: matchData,
    });
  } catch (error) {
    console.error('❌ Match error:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to match resume with job. Please try again.',
    });
  }
});

// ==========================================
// 🚨 ERROR HANDLING
// ==========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// ==========================================
// 🚀 START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log('🚀=================================🚀');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using AI Provider: ${AI_PROVIDER.toUpperCase()}`);
  console.log(`🗄️ MongoDB connected`);
  console.log(
    `🌐 Frontend allowed from: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`
  );
  console.log('🚀=================================🚀');
});