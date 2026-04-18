const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return this.authProvider === 'local';
    },
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerifyOTP: {
    type: String,
    select: false,
  },
  emailVerifyOTPExpiry: {
    type: Date,
    select: false,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    district: String,
    cityUpozela: String,
    street: String,
    zip: String,
    country: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving (only for local auth)
userSchema.pre('save', async function (next) {
  if (this.authProvider !== 'local' || !this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
