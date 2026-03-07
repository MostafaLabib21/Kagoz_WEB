const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  image: { url: String, publicId: String },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ displayOrder: 1 });
categorySchema.index({ parentCategory: 1 });

categorySchema.pre('save', function (next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
