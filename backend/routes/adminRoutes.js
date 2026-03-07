const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary } = require('../middleware/uploadMiddleware');
const cloudinary = require('../utils/cloudinary');

const { getStats } = require('../controllers/adminDashboardController');
const { getProducts, getProduct, createProduct, updateProduct, updateAvailability, deleteProduct } = require('../controllers/adminProductController');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/adminCategoryController');
const { getOrders, getOrder, updateOrderStatus } = require('../controllers/adminOrderController');
const { getHomepage, updateHero, updateFeatured, updateCategories, updateSettings } = require('../controllers/adminHomepageController');

// All routes protected + admin only
router.use(protect, adminOnly);

// Upload
router.post('/upload', upload.array('images', 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const results = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer, 'products'))
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/upload', async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: 'publicId is required' });
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hero image upload
router.post('/homepage/hero/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await uploadToCloudinary(req.file.buffer, 'hero');
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard
router.get('/dashboard/stats', getStats);

// Products
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.patch('/products/:id/availability', updateAvailability);
router.delete('/products/:id', deleteProduct);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Orders
router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);
router.patch('/orders/:id/status', updateOrderStatus);

// Homepage
router.get('/homepage', getHomepage);
router.put('/homepage/hero', updateHero);
router.put('/homepage/featured', updateFeatured);
router.put('/homepage/categories', updateCategories);
router.put('/homepage/settings', updateSettings);

module.exports = router;
