import React from 'react';

const STATUS_MAP = {
  pending: {
    label: 'Pending Payment',
    className: 'bg-yellow-100 text-yellow-800',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-blue-100 text-blue-800',
  },
  shipped_to_courier: {
    label: 'Shipped to Courier',
    className: 'bg-purple-100 text-purple-800',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    className: 'bg-orange-100 text-orange-800',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800',
  },
};

const StatusBadge = ({ status }) => {
  const fallback = {
    label: status || 'Unknown',
    className: 'bg-gray-100 text-gray-800',
  };

  const statusConfig = STATUS_MAP[status] || fallback;

  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusConfig.className}`}
    >
      {statusConfig.label}
    </span>
  );
};

export default StatusBadge;
