import React from 'react';
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/orderConstants';

const StatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
