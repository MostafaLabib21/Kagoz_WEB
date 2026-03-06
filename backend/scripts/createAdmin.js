/**
 * Admin Seed Script
 * 
 * Usage:
 *   node scripts/createAdmin.js
 * 
 * Creates an admin account directly in the database.
 * Admin accounts cannot be created through the public API.
 * 
 * Configure admin details below or via environment variables:
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const createAdmin = async () => {
  const name = process.env.ADMIN_NAME || 'Admin';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env or as environment variables.');
    console.error('Example:');
    console.error('  ADMIN_EMAIL=admin@kagoz.com ADMIN_PASSWORD=Admin123! node scripts/createAdmin.js');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User with email "${email}" already exists.`);
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save({ validateBeforeSave: false });
        console.log(`Updated "${email}" role to admin.`);
      } else {
        console.log('User is already an admin.');
      }
      process.exit(0);
    }

    await User.create({
      name,
      email,
      password,
      role: 'admin',
      authProvider: 'local',
      isEmailVerified: true,
    });

    console.log(`Admin account created successfully: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
