const mongoose = require('mongoose');

const homepageConfigSchema = new mongoose.Schema({
  heroSlides: [
    {
      image: { url: String, publicId: String },
      title: String,
      subtitle: String,
      buttonText: String,
      buttonLink: String,
      displayOrder: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
    },
  ],
  featuredSection: {
    title: { type: String, default: 'Featured Products' },
    subtitle: { type: String, default: '' },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  categoryHighlights: [
    {
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      displayOrder: Number,
    },
  ],
  newArrivalsCount: { type: Number, default: 8, min: 4, max: 16 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HomepageConfig', homepageConfigSchema);
