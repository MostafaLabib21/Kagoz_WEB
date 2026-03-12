const express = require('express');
const Product = require('../models/Product');
const HomepageConfig = require('../models/HomepageConfig');

const router = express.Router();

// GET /api/public/homepage
router.get('/homepage', async (req, res) => {
  try {
    const config = await HomepageConfig.findOne()
      .populate({
        path: 'featuredSection.productIds',
        match: { isActive: true },
        select: 'productId name slug shortDescription price compareAtPrice images stock category',
        populate: { path: 'category', select: 'name slug' },
      })
      .populate('categoryHighlights.category', 'name slug image')
      .lean();

    if (!config) {
      return res.json({});
    }

    return res.json(config);
  } catch (error) {
    console.error('Error fetching homepage config:', error);
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/public/products/new-arrivals
router.get('/products/new-arrivals', async (req, res) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isNaN(requestedLimit) ? 8 : Math.min(requestedLimit, 16);

    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('productId name slug shortDescription price compareAtPrice images stock category createdAt')
      .populate('category', 'name slug')
      .lean();

    return res.json({ products });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/public/products/related/:categoryId
router.get('/products/related/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { exclude } = req.query;
    const limit = parseInt(req.query.limit) || 4;

    const query = {
      category: categoryId,
      isActive: true,
    };

    if (exclude) {
      query._id = { $ne: exclude };
    }

    const products = await Product.find(query)
      .limit(limit)
      .select('productId name slug price compareAtPrice images stock category createdAt')
      .populate('category', 'name slug')
      .lean();

    return res.json({ products });
  } catch (error) {
    console.error('Error fetching related products:', error);
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/public/products/:slug
router.get('/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug')
      .select('productId name slug description shortDescription price compareAtPrice images category tags variants stock sku isFeatured createdAt')
      .lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ product });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
