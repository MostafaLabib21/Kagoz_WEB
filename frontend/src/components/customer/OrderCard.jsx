import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Truck } from 'lucide-react';
import StatusBadge from './StatusBadge';

const formatDate = (dateValue) => {
  if (!dateValue) {
    return '-';
  }

  const date = new Date(dateValue);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const OrderCard = ({ order }) => {
  const previewItems = order.items?.slice(0, 2) || [];
  const remainingItems = Math.max((order.items?.length || 0) - 2, 0);

  const paymentMethod = String(order.paymentMethod || '').toLowerCase();
  const isCod = paymentMethod === 'cod';

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5 hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="font-mono font-semibold text-gray-900">Order {order.orderId}</p>
          <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-3 space-y-1">
        {previewItems.map((item, index) => (
          <div key={`${item.productId || 'item'}-${index}`} className="flex items-center gap-2 text-sm text-gray-600">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 object-cover rounded-sm bg-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-sm bg-gray-100" />
            )}
            <p className="truncate">{item.name} x {item.quantity}</p>
          </div>
        ))}

        {remainingItems > 0 && (
          <p className="text-xs text-gray-400">+ {remainingItems} more items</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 gap-3">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          {isCod ? <Truck className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
          {isCod ? 'Cash on Delivery' : 'Online Payment'}
        </p>

        <p className="font-semibold text-sm text-gray-900">£{Number(order.totalPrice || 0).toFixed(2)}</p>

        <Link
          to={`/order-confirmation/${order.orderId}`}
          className="text-sm border border-gray-300 rounded-sm px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
