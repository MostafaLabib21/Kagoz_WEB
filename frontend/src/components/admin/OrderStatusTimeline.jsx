import React from 'react';
import { Clock } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/orderConstants';

const OrderStatusTimeline = ({ statusHistory = [] }) => {
  const sorted = [...statusHistory].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} className="text-gray-500" />
        <h3 className="font-semibold text-gray-900">Status History</h3>
      </div>
      <div className="space-y-0">
        {sorted.map((entry, idx) => {
          const colors = STATUS_COLORS[entry.status] || { text: 'text-gray-800' };
          const isLast = idx === sorted.length - 1;
          return (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${colors.text.replace('text-', 'bg-')}`} />
                {!isLast && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
              </div>
              <div className="pb-4">
                <p className={`font-medium text-sm ${colors.text}`}>
                  {STATUS_LABELS[entry.status] || entry.status}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(entry.changedAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}{' '}
                  {new Date(entry.changedAt).toLocaleTimeString('en-GB', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
                {entry.note && <p className="text-sm text-gray-400 italic mt-0.5">{entry.note}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
