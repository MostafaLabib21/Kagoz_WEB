import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import OrderCard from '../../components/customer/OrderCard';

const MyOrdersPage = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/orders/my-orders');
      return response.data;
    },
  });

  const orders = data?.orders || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Orders</h1>
      {!isLoading && !isError && (
        <p className="text-sm text-gray-500 mb-6">{orders.length} orders</p>
      )}

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 bg-gray-200 animate-pulse rounded-sm" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12">
          <p className="text-gray-700 mb-4">Failed to load orders. Please try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="border border-gray-300 rounded-sm px-4 py-2 text-sm hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="text-center py-14">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-sm text-gray-500 mb-5">When you place an order it will appear here</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-gray-900 text-white px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
