// COD flow: pending → confirmed → shipped_to_courier → out_for_delivery → delivered → money_received
// Advance payment flow: pending → confirmed → shipped_to_courier → out_for_delivery → delivered
const VALID_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped_to_courier', 'cancelled'],
  shipped_to_courier: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: ['money_received'], // only for COD orders
  money_received: [],
  cancelled: [],
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped_to_courier: 'Shipped to Courier',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  money_received: 'Money Received',
  cancelled: 'Cancelled',
};

const STATUS_COLORS = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
  shipped_to_courier: { bg: 'bg-purple-100', text: 'text-purple-800' },
  out_for_delivery: { bg: 'bg-orange-100', text: 'text-orange-800' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  money_received: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

const isValidTransition = (current, next) => {
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
};

const getNextStatuses = (current) => {
  return VALID_TRANSITIONS[current] ?? [];
};

module.exports = {
  VALID_TRANSITIONS,
  STATUS_LABELS,
  STATUS_COLORS,
  isValidTransition,
  getNextStatuses,
};
