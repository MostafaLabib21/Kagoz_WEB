const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
});

const uploadToCloudinary = async (buffer, folder = 'products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

module.exports = { upload, uploadToCloudinary };
