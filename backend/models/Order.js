const mongoose = require('mongoose');
const { generateOrderId } = require('../utils/generateId');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestEmail: { type: String, default: null, lowercase: true, trim: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productId: String,
      name: String,
      image: String,
      price: Number,
      variant: { type: String, default: '' },
      quantity: { type: Number, min: 1 },
    },
  ],
  shippingAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped_to_courier', 'out_for_delivery', 'delivered', 'money_received', 'cancelled'],
    default: 'pending',
  },
  courierInfo: {
    name: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
  },
  advancePaymentDetails: {
    method: { type: String, enum: ['', 'bank', 'bkash', 'nagad', 'rocket'], default: '' },
    bankAccountNo: { type: String, default: '' },
    mobileNumber: { type: String, default: '' },
    amount: { type: Number, default: 0 },
  },
  statusHistory: [
    {
      status: String,
      changedAt: { type: Date, default: Date.now },
      note: { type: String, default: '' },
    },
  ],
  paidAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ user: 1 });
orderSchema.index({ guestEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.orderId = await generateOrderId();
    this.statusHistory.push({
      status: 'pending',
      changedAt: new Date(),
      note: 'Order placed',
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
