import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import { STATUS_LABELS } from '../../constants/orderConstants';
import useDebounce from '../../hooks/useDebounce';

const ALL_STATUSES = ['pending', 'confirmed', 'shipped_to_courier', 'out_for_delivery', 'delivered', 'money_received', 'cancelled'];

const OrdersListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) params.set('search', debouncedSearch);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, searchParams.get('search'), status],
    queryFn: async () => {
      const params = { page, limit: 15 };
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (status) params.status = status;
      const { data } = await axiosInstance.get('/api/admin/orders', { params });
      return data;
    },
  });

  const setStatus = (s) => {
    const params = new URLSearchParams(searchParams);
    if (s) params.set('status', s); else params.delete('status');
    params.set('page', '1');
    setSearchParams(params);
  };

  const setPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p.toString());
    setSearchParams(params);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Status tabs */}
      <div className="flex items-center gap-0 border-b border-gray-200 mb-4 overflow-x-auto">
        <button
          onClick={() => setStatus('')}
          className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
            !status ? 'border-indigo-600 text-indigo-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All
          {data?.countsByStatus && (
            <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
              {Object.values(data.countsByStatus).reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
              status === s ? 'border-indigo-600 text-indigo-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {STATUS_LABELS[s]}
            {data?.countsByStatus && (
              <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
                {data.countsByStatus[s] || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by Order ID or customer email"
          className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
        {searchInput && (
          <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                </tr>
              ))
            ) : data?.orders?.length ? (
              data.orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${order._id}`} className="font-mono text-indigo-600 hover:underline text-xs">
                      {order.orderId}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {order.user ? (
                      <div>
                        <p className="font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500">Guest Order</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items?.length || 0} item(s)</td>
                  <td className="px-4 py-3 font-medium">৳{order.totalPrice?.toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="text-xs text-indigo-600 border border-indigo-600 px-3 py-1 rounded hover:bg-indigo-50"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No orders matching filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {data && <Pagination page={data.page} pages={data.pages} total={data.total} limit={15} onChange={setPage} />}
    </div>
  );
};

export default OrdersListPage;
