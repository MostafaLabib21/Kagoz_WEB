const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
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

// GET /api/public/products
router.get('/products', async (req, res) => {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const requestedLimit = Number.parseInt(req.query.limit, 10);

    const page = Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage;
    const limit = Number.isNaN(requestedLimit) || requestedLimit < 1
      ? 12
      : Math.min(requestedLimit, 48);

    const { search, category, sort, minPrice, maxPrice, inStock } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category }).select('_id').lean();
      if (!categoryDoc) {
        return res.json({
          products: [],
          total: 0,
          page,
          pages: 0,
          limit,
        });
      }
      filter.category = categoryDoc._id;
    }

    const parsedMinPrice = Number.parseFloat(minPrice);
    const parsedMaxPrice = Number.parseFloat(maxPrice);

    if (!Number.isNaN(parsedMinPrice) || !Number.isNaN(parsedMaxPrice)) {
      filter.price = {};

      if (!Number.isNaN(parsedMinPrice)) {
        filter.price.$gte = parsedMinPrice;
      }

      if (!Number.isNaN(parsedMaxPrice)) {
        filter.price.$lte = parsedMaxPrice;
      }
    }

    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'oldest') sortQuery = { createdAt: 1 };
    if (sort === 'price-asc') sortQuery = { price: 1 };
    if (sort === 'price-desc') sortQuery = { price: -1 };
    if (sort === 'name-asc') sortQuery = { name: 1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .select('productId name slug shortDescription price compareAtPrice images stock category createdAt')
        .populate('category', 'name slug')
        .lean(),
      Product.countDocuments(filter),
    ]);

    const pages = total === 0 ? 0 : Math.ceil(total / limit);

    return res.json({ products, total, page, pages, limit });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/public/categories
router.get('/categories', async (req, res) => {
  try {
    const [categories, productCounts] = await Promise.all([
      Category.find()
        .sort({ displayOrder: 1, name: 1 })
        .select('name slug image displayOrder')
        .lean(),
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);

    const countsMap = new Map(productCounts.map((item) => [String(item._id), item.count]));

    const mergedCategories = categories.map((categoryItem) => ({
      ...categoryItem,
      productCount: countsMap.get(String(categoryItem._id)) || 0,
    }));

    return res.json({ categories: mergedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
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
