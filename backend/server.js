const dotenv = require('dotenv');
// Load environment variables before any module that reads process.env
dotenv.config();

const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS — allow frontend origin with credentials
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Multer error handling
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum 5MB per file.' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ message: 'Too many files. Maximum 6 files per request.' });
  }
  if (err.message?.includes('Only image files')) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
