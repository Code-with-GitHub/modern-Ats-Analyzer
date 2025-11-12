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
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import custom modules
import connectDB from './db.js';
import authRoutes from './auth.js';
import User from './User.js';
import { protect } from './authmiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';

// ==========================================
// 🗄️ CONNECT TO DATABASE
// ==========================================
connectDB();

// ==========================================
// 🔐 PASSPORT CONFIGURATION
// ==========================================

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Check by email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              // Link Google account to existing user
              user.googleId = profile.id;
              user.avatar = profile.photos[0]?.value;
              await user.save();
            } else {
              // Create new user
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

if (AI_PROVIDER === 'openai') {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY not found in .env file');
    process.exit(1);
  }

  aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('✅ OpenAI client initialized');
}

if (AI_PROVIDER === 'openrouter') {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('❌ ERROR: OPENROUTER_API_KEY not found');
    process.exit(1);
  }
  aiClient = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
      'X-Title': 'ATS Resume Optimizer',
    },
  });
  console.log('✅ OpenRouter client initialized');
}

if (AI_PROVIDER === 'gemini') {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
    process.exit(1);
  }

  aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  geminiModel = aiClient.getGenerativeModel({
    model: 'gemini-2.5-flash',
  });

  console.log('✅ Gemini client initialized');
}

// ==========================================
// 🛡️ MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

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

// ==========================================
// 📊 CALL AI FUNCTION
// ==========================================

async function callAI(systemPrompt, userPrompt) {
  try {
    if (AI_PROVIDER === 'openai' || AI_PROVIDER === 'openrouter') {
      const modelName =
        AI_PROVIDER === 'openrouter' ? 'google/gemini-1.5-flash' : 'gpt-4o';

      console.log(`🤖 Calling ${modelName}`);

      const response = await aiClient.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });
      return response.choices[0].message.content;
    }

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
// ❤️ ROUTE: HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: AI_PROVIDER,
    database: 'connected',
    message: 'Resume Optimizer API is running',
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
    `🌐 Frontend allowed from: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`
  );
  console.log('🚀=================================🚀');
});