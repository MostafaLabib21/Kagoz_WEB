import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Truck, Loader } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { useCart } from '../../context/CartContext';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { clearCart } = useCart();

  useEffect(() => {
    // Only clear if cart is not already empty
    const stored = localStorage.getItem('kagoj-cart');
    if (stored && JSON.parse(stored).length > 0) {
      clearCart();
    }
  }, [clearCart]);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/orders/${orderId}`);
      return response.data.order;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the order you're looking for.
        </p>
        <Link
          to="/profile"
          className="px-6 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  const { shippingAddress } = order;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-600">
        Thank you for your order, {shippingAddress.name}!
      </p>

      {/* Order ID Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mt-6 text-left">
        <p className="text-xs text-gray-500 uppercase mb-1">Order ID</p>
        <p className="font-mono font-bold text-lg text-gray-900">
          {order.orderId}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Place this order at collection / show this to delivery person
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 mt-4 text-left">
        <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-3 divide-y divide-gray-100 mb-4">
          {order.items.map((item, index) => (
            <div
              key={`${item.productId}-${index}`}
              className="flex items-center gap-3 py-2 pt-3 first:pt-0"
            >
              <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {item.name}
                </p>
                {item.variant && (
                  <p className="text-xs text-gray-500">{item.variant}</p>
                )}
                <p className="text-xs text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-900">
                  £{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
          <span className="font-medium text-gray-900">Total</span>
          <span className="font-bold text-gray-900 text-lg">
            £{order.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 mt-4 text-left">
        <h3 className="font-semibold text-gray-900 mb-3">Delivering to</h3>
        <div className="text-sm text-gray-600 leading-relaxed space-y-0.5">
          <p>{shippingAddress.house}, {shippingAddress.street}</p>
          <p>
            {shippingAddress.thana}, {shippingAddress.district}{' '}
            {shippingAddress.zip ? `- ${shippingAddress.zip}` : ''}
          </p>
          <p>{shippingAddress.country}</p>
          <p className="mt-2 text-gray-500">Phone: {order.phone}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 mt-4 text-left flex items-center gap-3">
        <Truck className="w-5 h-5 text-gray-500" />
        <div>
          <p className="font-medium text-sm text-gray-900">
            Payment: Cash on Delivery
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
        <Link
          to="/profile"
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors font-medium"
        >
          View My Orders
        </Link>
        <Link
          to="/shop"
          className="px-6 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-colors font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
