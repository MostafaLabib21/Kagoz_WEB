import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Banknote, ShoppingBag, Package, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { STATUS_LABELS, STATUS_COLORS } from '../../constants/orderConstants';

const DashboardPage = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/admin/dashboard/stats');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-5 h-24 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-20 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statuses = ['pending', 'confirmed', 'shipped_to_courier', 'out_for_delivery', 'delivered', 'money_received', 'cancelled'];

  return (
    <div className="space-y-6">
      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Revenue Collected" value={`৳${(data.totalRevenue || 0).toFixed(2)}`} icon={Banknote} accentColor="green" />
        <StatCard title="Total Orders" value={data.totalOrders} icon={ShoppingBag} accentColor="blue" />
        <StatCard title="Total Products" value={data.totalProducts} icon={Package} accentColor="purple" />
        <StatCard title="Total Customers" value={data.totalCustomers} icon={Users} accentColor="orange" />
      </div>

      {/* Row 2: Status Strip */}
      <div className="grid grid-cols-7 gap-3">
        {statuses.map((status) => {
          const colors = STATUS_COLORS[status];
          return (
            <button
              key={status}
              onClick={() => navigate(`/admin/orders?status=${status}`)}
              className="bg-white rounded-lg shadow-sm p-4 text-left hover:shadow-md transition"
            >
              <p className={`text-2xl font-bold ${colors.text}`}>
                {data.ordersByStatus?.[status] || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">{STATUS_LABELS[status]}</p>
            </button>
          );
        })}
      </div>

      {/* Row 3: Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          {data.recentOrders?.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="py-2">
                      <Link to={`/admin/orders/${order._id}`} className="font-mono text-indigo-600 hover:underline text-xs">
                        {order.orderId}
                      </Link>
                    </td>
                    <td className="py-2 text-gray-700">
                      {order.user?.name || order.guestEmail || 'Guest'}
                    </td>
                    <td className="py-2 font-medium">৳{order.totalPrice?.toFixed(2)}</td>
                    <td className="py-2"><StatusBadge status={order.status} /></td>
                    <td className="py-2 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
          )}
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-semibold text-gray-900">Stock Alerts</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Products needing attention</p>
          {data.stockAlerts?.length ? (
            <div className="max-h-80 overflow-y-auto space-y-2">
              {data.stockAlerts.map((product) => (
                <div key={product._id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-700 truncate w-40">{product.name}</span>
                  <div className="flex items-center gap-3">
                    {product.stock === 0 ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Out of Stock</span>
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Low: {product.stock} left</span>
                    )}
                    <Link to={`/admin/products/${product._id}/edit`} className="text-xs text-indigo-600 hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
              <p className="text-sm text-green-600">All products well stocked</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
