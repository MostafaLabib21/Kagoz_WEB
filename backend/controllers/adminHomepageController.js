const HomepageConfig = require('../models/HomepageConfig');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getOrCreateConfig = async () => {
  let config = await HomepageConfig.findOne();
  if (!config) {
    config = await HomepageConfig.create({
      heroSlides: [],
      featuredSection: { title: 'Featured Products', subtitle: '', productIds: [] },
      categoryHighlights: [],
      newArrivalsCount: 8,
    });
  }
  return config;
};

const getHomepage = async (req, res) => {
  try {
    let config = await HomepageConfig.findOne()
      .populate('featuredSection.productIds', 'productId name images price isActive')
      .populate('categoryHighlights.category', 'name slug image');
    if (!config) config = await getOrCreateConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHero = async (req, res) => {
  try {
    const { heroSlides } = req.body;
    const config = await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { heroSlides, updatedAt: Date.now() } },
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFeatured = async (req, res) => {
  try {
    const { title, subtitle, productIds } = req.body;
    if (productIds && productIds.length > 12) {
      return res.status(400).json({ message: 'Maximum 12 featured products allowed' });
    }
    if (productIds) {
      const found = await Product.find({ _id: { $in: productIds }, isActive: true }).select('_id');
      if (found.length !== productIds.length) {
        return res.status(400).json({ message: 'Some products not found or inactive' });
      }
    }

    const update = { updatedAt: Date.now() };
    if (title !== undefined) update['featuredSection.title'] = title;
    if (subtitle !== undefined) update['featuredSection.subtitle'] = subtitle;
    if (productIds !== undefined) update['featuredSection.productIds'] = productIds;

    const config = await HomepageConfig.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body;
    const count = await Category.countDocuments({ _id: { $in: categoryIds } });
    if (count !== categoryIds.length) {
      return res.status(400).json({ message: 'Some categories not found' });
    }

    const highlights = categoryIds.map((id, i) => ({ category: id, displayOrder: i }));
    const config = await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { categoryHighlights: highlights, updatedAt: Date.now() } },
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { newArrivalsCount } = req.body;
    const val = parseInt(newArrivalsCount);
    if (isNaN(val) || val < 4 || val > 16) {
      return res.status(400).json({ message: 'newArrivalsCount must be between 4 and 16' });
    }

    const config = await HomepageConfig.findOneAndUpdate(
      {},
      { $set: { newArrivalsCount: val, updatedAt: Date.now() } },
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHomepage, updateHero, updateFeatured, updateCategories, updateSettings };
