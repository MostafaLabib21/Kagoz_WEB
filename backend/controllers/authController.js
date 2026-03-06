const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendVerificationEmail = require('../utils/emailService');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: strip sensitive fields from user object
const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  delete obj.emailVerifyOTP;
  delete obj.emailVerifyOTPExpiry;
  return obj;
};

// POST /api/auth/register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local',
      isEmailVerified: false,
    });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(12);
    user.emailVerifyOTP = await bcrypt.hash(otp, salt);
    user.emailVerifyOTPExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(email, name, otp);

    res.status(201).json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/verify-email
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email, isEmailVerified: false }).select(
      '+emailVerifyOTP +emailVerifyOTPExpiry'
    );

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    // Check expiry
    if (!user.emailVerifyOTPExpiry || Date.now() > user.emailVerifyOTPExpiry.getTime()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, user.emailVerifyOTP);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.isEmailVerified = true;
    user.emailVerifyOTP = undefined;
    user.emailVerifyOTPExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    generateToken(res, user._id);

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Verify email error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/resend-verification
const resendVerification = async (req, res) => {
  const { email } = req.body;

  // Always return the same response to prevent email enumeration
  const genericMsg = 'If that email is registered and unverified, a new code has been sent';

  if (!email) {
    return res.json({ message: genericMsg });
  }

  try {
    const user = await User.findOne({ email, isEmailVerified: false, authProvider: 'local' });

    if (!user) {
      return res.json({ message: genericMsg });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(12);
    user.emailVerifyOTP = await bcrypt.hash(otp, salt);
    user.emailVerifyOTPExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(email, user.name, otp);

    res.json({ message: genericMsg });
  } catch (error) {
    console.error('Resend verification error:', error.message);
    res.json({ message: genericMsg });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, authProvider: 'local' });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'Please verify your email first',
        unverified: true,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    generateToken(res, user._id);

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/google
const googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if user exists by googleId
    let user = await User.findOne({ googleId });
    if (user) {
      generateToken(res, user._id);
      return res.json({ user: sanitizeUser(user) });
    }

    // Check if email already registered as local account
    user = await User.findOne({ email });
    if (user && user.authProvider === 'local') {
      return res.status(400).json({
        message: 'An account with this email already exists. Please log in with your password.',
      });
    }

    // Create new Google user
    user = await User.create({
      name,
      email,
      googleId,
      authProvider: 'google',
      isEmailVerified: true,
    });

    generateToken(res, user._id);

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.address) user.address = req.body.address;

    // Password change for local users
    if (user.authProvider === 'local' && req.body.newPassword) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }

      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();

    res.json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  googleAuth,
  logout,
  getMe,
  updateProfile,
};
