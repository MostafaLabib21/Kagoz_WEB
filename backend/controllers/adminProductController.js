const mongoose = require('mongoose');
const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');

const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 20, search, category, isActive, stock } = req.query;
    page = parseInt(page);
    limit = Math.min(parseInt(limit) || 20, 50);

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { productId: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = new mongoose.Types.ObjectId(category);
    if (isActive !== undefined && isActive !== '') filter.isActive = isActive === 'true';
    if (stock === 'out') filter.stock = 0;
    if (stock === 'low') filter.stock = { $gt: 0, $lte: 5 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category', 'name slug')
        .select('productId name slug sku price compareAtPrice images stock isActive isFeatured category createdAt')
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images } = req.body;
    if (!name || !description || price == null || !category || !images?.length) {
      return res.status(400).json({ message: 'Name, description, price, category and at least 1 image are required' });
    }
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const update = { updatedAt: Date.now() };
    if (req.body.isActive !== undefined) update.isActive = req.body.isActive;
    if (req.body.stock !== undefined) update.stock = req.body.stock;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $set: update },
      { new: true }
    ).select('productId name stock isActive updatedAt');

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete images from Cloudinary in parallel
    if (product.images?.length) {
      await Promise.all(
        product.images
          .filter((img) => img.publicId)
          .map((img) => cloudinary.uploader.destroy(img.publicId))
      );
    }

    product.isActive = false;
    await product.save();
    res.json({ message: 'Product deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, updateAvailability, deleteProduct };
