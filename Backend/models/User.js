// ============================================
// 👤 USER MODEL (FIXED)
// ============================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified or new
  if (!this.isModified('password')) {
    return next();
  }

  // Don't hash if no password (OAuth users)
  if (!this.password) {
    return next();
  }

  try {
    console.log('🔐 Hashing password for:', this.email);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('✅ Password hashed successfully');
    next();
  } catch (error) {
    console.error('❌ Password hashing error:', error);
    next(error);
  }
});

// Compare password method (FIXED)
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // If no password set (OAuth user), return false
    if (!this.password) {
      console.log('⚠️ No password to compare (OAuth user)');
      return false;
    }

    console.log('🔐 Comparing passwords...');
    console.log('Candidate password length:', candidatePassword?.length);
    console.log('Stored hash length:', this.password?.length);
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('🔐 Comparison result:', isMatch);
    
    return isMatch;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    throw new Error('Password comparison failed');
  }
};

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ githubId: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

export default User;