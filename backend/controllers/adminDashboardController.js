const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Setting = require('../models/Setting');

const getDeliveryCharge = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'delivery_charge' });
    res.json({ amount: setting ? setting.value : 60 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDeliveryCharge = async (req, res) => {
  try {
    const { amount } = req.body;
    let setting = await Setting.findOne({ key: 'delivery_charge' });
    if(setting) {
      setting.value = amount;
      await setting.save();
    } else {
      await Setting.create({ key: 'delivery_charge', value: amount, description: 'Standard delivery charge' });
    }
    res.json({ message: 'Delivery charge updated', amount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const [
      totalOrders,
      revenueResult,
      statusCounts,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalCustomers,
      recentOrders,
      stockAlerts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: {
          $or: [
            { paymentMethod: 'cod', status: 'money_received' },
            { paymentMethod: { $ne: 'cod' }, status: { $in: ['confirmed', 'shipped_to_courier', 'out_for_delivery', 'delivered'] } },
          ],
        }},
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Product.countDocuments(),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 }, isActive: true }),
      Product.countDocuments({ stock: 0, isActive: true }),
      User.countDocuments({ role: 'customer' }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .select('orderId totalPrice status createdAt guestEmail')
        .lean(),
      Product.find({ stock: { $lte: 5 }, isActive: true })
        .sort({ stock: 1 })
        .limit(10)
        .select('productId name stock images')
        .lean(),
    ]);

    const ordersByStatus = {
      pending: 0, confirmed: 0, shipped_to_courier: 0,
      out_for_delivery: 0, delivered: 0, money_received: 0, cancelled: 0,
    };
    statusCounts.forEach((s) => { ordersByStatus[s._id] = s.count; });

    res.json({
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      ordersByStatus,
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalCustomers,
      recentOrders,
      stockAlerts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getDeliveryCharge,
  updateDeliveryCharge
};

