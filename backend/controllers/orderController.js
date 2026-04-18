const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Setting = require('../models/Setting');
const Product = require('../models/Product');
const { generateOrderId } = require('../utils/generateId');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    phone,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items in order');
  }

  // Validate items and fetch product references
  const productIdsData = items.map(item => item.productId);
  const products = await Product.find({ productId: { $in: productIdsData } });
  
  const productMap = {};
  products.forEach(p => {
    productMap[p.productId] = p._id;
  });

  // Verify all items have a valid product
  for (const item of items) {
    if (!productMap[item.productId]) {
      res.status(400);
      throw new Error(`Product not found: ${item.productId}`);
    }
  }

  if (
    !shippingAddress ||
    !shippingAddress.name ||
    !shippingAddress.street ||
    !shippingAddress.district ||
    !shippingAddress.thana ||
    !shippingAddress.house ||
    !shippingAddress.country
  ) {
    res.status(400);
    throw new Error('Shipping address is incomplete');
  }

  if (!phone) {
    res.status(400);
    throw new Error('Phone number is required');
  }
  
  // Get Delivery Charge Setting
  const setting = await Setting.findOne({ key: 'delivery_charge' });
  const deliveryCharge = setting ? Number(setting.value) : 60; // Default 60 if not set

  // Calculate prices
  const itemsPrice =
    Math.round(
      items.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100
    ) / 100;

  // Apply delivery charge
  const shippingPrice = itemsPrice >= 3000 ? 0 : deliveryCharge; // Example threshold 3000, adjust as needed

  const taxPrice = 0; // No tax as per previous request

  const totalPrice =
    Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

  // Generate order ID explicitly
  const orderId = await generateOrderId();
  console.log('Generated OrderID:', orderId); // Debug log

  const orderItems = items.map(item => {
    const pId = productMap[item.productId];
    console.log(`Mapping item ${item.productId} to ObjectId ${pId}`);
    return {
      ...item,
      product: pId // Use actual ObjectId
    };
  });

  const order = new Order({
    orderId,
    user: req.user._id,
    items: orderItems,
    shippingAddress: {
      ...shippingAddress,
      // Ensure mapped correctly
      district: shippingAddress.district,
      thana: shippingAddress.thana,
      street: shippingAddress.street,
      house: shippingAddress.house,
      zip: shippingAddress.zip,
      country: shippingAddress.country || 'Bangladesh'
    },
    phone,
    paymentMethod: 'cod',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    status: 'pending',
  });

  const createdOrder = await order.save();

  res.status(201).json({
    success: true,
    orderId: createdOrder.orderId,
    _id: createdOrder._id,
    totalPrice: createdOrder.totalPrice,
    status: createdOrder.status,
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select(
      'orderId items totalPrice status paymentMethod createdAt shippingAddress itemsPrice shippingPrice taxPrice'
    )
    .lean();

  res.json({ orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    orderId: req.params.id,
    user: req.user._id,
  }).lean();

  if (order) {
    res.json({ order });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
