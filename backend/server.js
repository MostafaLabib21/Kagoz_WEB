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
const orderRoutes = require('./routes/orderRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Render and similar platforms run behind a proxy.
app.set('trust proxy', 1);

const allowedOrigins = [
  ...(process.env.CLIENT_URLS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  process.env.CLIENT_URL,
  'http://localhost:3000',
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Allow Vercel deployments (production + preview URLs).
  if (origin.endsWith('.vercel.app')) {
    return true;
  }

  return false;
};

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS — allow frontend origin with credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests and tools like health checks.
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      // Reject silently as CORS-denied instead of triggering a 500 error handler response.
      return callback(null, false);
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'kagoz-backend' });
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API working' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/orders', orderRoutes);

// Multer and general error handling
app.use((err, req, res, next) => {
  // Multer specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum 5MB per file.' });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ message: 'Too many files. Maximum 6 files per request.' });
  }

  // Handle errors that have a status code set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
