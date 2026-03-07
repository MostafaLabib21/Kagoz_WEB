const mongoose = require('mongoose');
const { generateProductId } = require('../utils/generateId');

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 160, trim: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, default: null },
  images: {
    type: [{ url: String, publicId: String }],
    validate: {
      validator: (v) => v.length >= 1,
      message: 'At least 1 image is required',
    },
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [String],
  variants: [
    {
      label: String,
      value: String,
      priceModifier: { type: Number, default: 0 },
    },
  ],
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, trim: true },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.index({ productId: 1 }, { unique: true });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ sku: 1 }, { sparse: true, unique: true });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', shortDescription: 'text', tags: 'text' });
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ isActive: 1, category: 1 });
productSchema.index({ isActive: 1, stock: 1 });

productSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.productId = await generateProductId();
  }

  if (this.isNew || this.isModified('name')) {
    let base = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = base;
    let suffix = 2;
    const Product = this.constructor;
    while (true) {
      const existing = await Product.findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      slug = `${base}-${suffix}`;
      suffix++;
    }
    this.slug = slug;
  }

  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
