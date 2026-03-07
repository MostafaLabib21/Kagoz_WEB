const Order = require('../models/Order');
const { isValidTransition, STATUS_LABELS } = require('../utils/orderTransitions');

const getOrders = async (req, res) => {
  try {
    let { page = 1, limit = 15, status, search } = req.query;
    page = parseInt(page);
    limit = Math.min(parseInt(limit) || 15, 50);

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const [orders, total, statusCounts] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name email')
        .select('orderId user guestEmail totalPrice status createdAt items paymentMethod')
        .lean(),
      Order.countDocuments(filter),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const countsByStatus = {
      pending: 0, confirmed: 0, shipped_to_courier: 0,
      out_for_delivery: 0, delivered: 0, money_received: 0, cancelled: 0,
    };
    statusCounts.forEach((s) => { countsByStatus[s._id] = s.count; });

    res.json({ orders, total, page, pages: Math.ceil(total / limit), countsByStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email address')
      .populate('items.product', 'name images productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, courierName, courierTrackingNumber, advancePaymentDetails } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped_to_courier', 'out_for_delivery', 'delivered', 'money_received', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Payment-method-aware transition validation
    if (status === 'money_received' && order.paymentMethod !== 'cod') {
      return res.status(400).json({ message: 'Money received status is only for COD orders' });
    }

    if (!isValidTransition(order.status, status)) {
      // For advance payment, delivered is terminal (no money_received)
      if (order.paymentMethod !== 'cod' && order.status === 'delivered') {
        return res.status(400).json({ message: 'This order is already at its final status' });
      }
      return res.status(400).json({
        message: `Cannot change from '${STATUS_LABELS[order.status]}' to '${STATUS_LABELS[status]}'`,
      });
    }

    // Require courier info when shipping
    if (status === 'shipped_to_courier') {
      if (!courierName || !courierName.trim()) {
        return res.status(400).json({ message: 'Courier name is required when shipping to courier' });
      }
      order.courierInfo = {
        name: courierName.trim(),
        trackingNumber: courierTrackingNumber?.trim() || '',
      };
    }

    // Save advance payment details when confirming advance payment orders
    if (advancePaymentDetails && order.paymentMethod !== 'cod') {
      const { method, bankAccountNo, mobileNumber, amount } = advancePaymentDetails;
      if (method && ['bank', 'bkash', 'nagad', 'rocket'].includes(method)) {
        order.advancePaymentDetails = {
          method,
          bankAccountNo: bankAccountNo?.trim() || '',
          mobileNumber: mobileNumber?.trim() || '',
          amount: Number(amount) || 0,
        };
        order.paidAt = new Date();
      }
    }

    order.status = status;
    order.statusHistory.push({ status, changedAt: new Date(), note: note || '' });
    if (status === 'delivered') order.deliveredAt = new Date();
    if (status === 'money_received') order.paidAt = new Date();

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, getOrder, updateOrderStatus };
