import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Banknote, ShoppingBag, Package, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { STATUS_LABELS } from '../../constants/orderConstants';

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
      <div className="space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-100 p-6 h-32 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-24 mb-4" />
              <div className="h-8 bg-gray-100 rounded w-16" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-100 p-4 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statuses = ['pending', 'confirmed', 'shipped_to_courier', 'out_for_delivery', 'delivered', 'money_received', 'cancelled'];

  return (
    <div className="space-y-8">
      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Revenue Collected" value={`৳${(data.totalRevenue || 0).toFixed(2)}`} icon={Banknote} accentColor="gray" />
        <StatCard title="Total Orders" value={data.totalOrders} icon={ShoppingBag} accentColor="gray" />
        <StatCard title="Total Products" value={data.totalProducts} icon={Package} accentColor="gray" />
        <StatCard title="Total Customers" value={data.totalCustomers} icon={Users} accentColor="gray" />
      </div>

      {/* Row 2: Status Strip */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">Order Status Overview</h3>
        <div className="grid grid-cols-7 gap-4">
          {statuses.map((status) => {
            return (
              <button
                key={status}
                onClick={() => navigate(`/admin/orders?status=${status}`)}
                className="bg-white border border-gray-100 rounded-lg p-4 text-left hover:border-gray-900 hover:shadow-sm transition-all group"
              >
                <p className={`text-2xl font-bold text-gray-900 group-hover:text-black`}>
                  {data.ordersByStatus?.[status] || 0}
                </p>
                <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">{STATUS_LABELS[status]}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Panels */}
      <div className="grid grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm font-medium text-gray-900 hover:underline">View All</Link>
          </div>
          {data.recentOrders?.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 pl-1">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pl-1">
                      <Link to={`/admin/orders/${order._id}`} className="font-mono text-xs font-medium text-gray-900 hover:underline">
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
