const Category = require('../models/Category');
const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');

const getCategories = async (req, res) => {
  try {
    const [categories, counts] = await Promise.all([
      Category.find().sort({ displayOrder: 1 }).lean(),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);

    const countMap = {};
    counts.forEach((c) => { countMap[c._id.toString()] = c.count; });

    const result = categories.map((cat) => ({
      ...cat,
      productCount: countMap[cat._id.toString()] || 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, parentCategory, image } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const category = await Category.create({ name, parentCategory: parentCategory || null, image });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Category name already exists' });
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // If image is being replaced, delete old one
    if (req.body.image && category.image?.publicId && category.image.publicId !== req.body.image.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId);
    }

    const { name, parentCategory, image, displayOrder } = req.body;
    if (name !== undefined) category.name = name;
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (image !== undefined) category.image = image;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Category name already exists' });
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const count = await Product.countDocuments({ category: req.params.id });
    if (count > 0) {
      return res.status(400).json({ message: `Cannot delete: ${count} products assigned to this category` });
    }

    if (category.image?.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId);
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
