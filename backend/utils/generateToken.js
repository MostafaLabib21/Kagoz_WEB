const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction,
    // Cross-site cookie is required for Vercel frontend <-> Render backend auth.
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

module.exports = generateToken;
