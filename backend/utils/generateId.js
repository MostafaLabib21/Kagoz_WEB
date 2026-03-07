const Counter = require('../models/Counter');

const generateProductId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'product' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return 'PRD-' + String(counter.seq).padStart(5, '0');
};

const generateOrderId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'order' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const year = new Date().getFullYear();
  return 'ORD-' + year + '-' + String(counter.seq).padStart(5, '0');
};

module.exports = { generateProductId, generateOrderId };
