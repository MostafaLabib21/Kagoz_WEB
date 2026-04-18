const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const {
  register,
  verifyEmail,
  resendVerification,
  login,
  googleAuth,
  logout,
  getMe,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const router = express.Router();

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const resendLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must include an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must include a lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must include a number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must include a special character'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendLimiter, resendVerification);
router.post('/login', loginLimiter, loginValidation, login);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
