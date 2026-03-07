import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Package, PlusCircle, Pencil, EyeOff, CheckCircle, Copy } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import Pagination from '../../components/admin/Pagination';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import useDebounce from '../../hooks/useDebounce';

const ProductsListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const isActive = searchParams.get('isActive') || '';
  const stock = searchParams.get('stock') || '';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [stockSuccess, setStockSuccess] = useState(null);

  // Sync debounced search to URL
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) params.set('search', debouncedSearch);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => { const { data } = await axiosInstance.get('/api/admin/categories'); return data; },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, searchParams.get('search'), category, isActive, stock],
    queryFn: async () => {
      const params = { page, limit: 20 };
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (category) params.category = category;
      if (isActive) params.isActive = isActive;
      if (stock) params.stock = stock;
      const { data } = await axiosInstance.get('/api/admin/products', { params });
      return data;
    },
  });

  const availabilityMutation = useMutation({
    mutationFn: ({ id, body }) => axiosInstance.patch(`/api/admin/products/${id}/availability`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
    onError: (err) => showToast(err.response?.data?.message || 'Update failed', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      showToast('Product deactivated', 'success');
      setDeleteTarget(null);
    },
    onError: (err) => showToast(err.response?.data?.message || 'Delete failed', 'error'),
  });

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handleCopy = useCallback((id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleStockBlur = (productId) => {
    const val = parseInt(stockValue);
    if (!isNaN(val) && val >= 0) {
      availabilityMutation.mutate({ id: productId, body: { stock: val } });
      setStockSuccess(productId);
      setTimeout(() => setStockSuccess(null), 2000);
    }
    setEditingStock(null);
  };

  const hasFilters = search || category || isActive || stock;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          {data && <p className="text-sm text-gray-500">{data.total} total products</p>}
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
        >
          <PlusCircle size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, SKU, or Product ID"
              className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
          <select value={category} onChange={(e) => updateParam('category', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All Categories</option>
            {categoriesData?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={isActive} onChange={(e) => updateParam('isActive', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select value={stock} onChange={(e) => updateParam('stock', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800">Clear all filters</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3 w-8"><input type="checkbox" disabled className="rounded" /></th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Product ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {[...Array(9)].map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : data?.products?.length ? (
              data.products.map((product) => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3"><input type="checkbox" disabled className="rounded" /></td>
                  <td className="px-4 py-3">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt="" className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                        <Package size={16} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 group">
                      <span className="font-mono text-xs text-gray-500">{product.productId}</span>
                      <button onClick={() => handleCopy(product.productId)} className="opacity-0 group-hover:opacity-100 transition">
                        {copiedId === product.productId ? <CheckCircle size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    {product.sku && <p className="text-xs text-gray-400">{product.sku}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category?.name || '—'}</td>
                  <td className="px-4 py-3">
                    {product.compareAtPrice && (
                      <p className="text-xs text-gray-400 line-through">৳{product.compareAtPrice.toFixed(2)}</p>
                    )}
                    <p className="font-medium">৳{product.price.toFixed(2)}</p>
                  </td>
                  <td className="px-4 py-3">
                    {editingStock === product._id ? (
                      <input
                        autoFocus
                        type="number"
                        min="0"
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                        onBlur={() => handleStockBlur(product._id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleStockBlur(product._id)}
                        className="w-16 text-center border rounded px-1 py-0.5 text-sm"
                      />
                    ) : (
                      <button
                        onClick={() => { setEditingStock(product._id); setStockValue(product.stock.toString()); }}
                        className={`font-medium ${
                          product.stock === 0 ? 'text-red-600' :
                          product.stock <= 5 ? 'text-amber-600' : 'text-green-600'
                        }`}
                      >
                        {stockSuccess === product._id ? <CheckCircle size={14} className="inline text-green-500" /> : product.stock}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => availabilityMutation.mutate({ id: product._id, body: { isActive: !product.isActive } })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${product.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition transform ${product.isActive ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/admin/products/${product._id}/edit`)} className="text-gray-400 hover:text-indigo-600">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(product)} className="text-gray-400 hover:text-red-600">
                        <EyeOff size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center">
                  <Package size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No products found</p>
                  {hasFilters ? (
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                  ) : (
                    <button onClick={() => navigate('/admin/products/new')} className="text-sm text-indigo-600 mt-2 hover:underline">
                      Add your first product
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && <Pagination page={data.page} pages={data.pages} total={data.total} limit={20} onChange={(p) => updateParam('page', p.toString())} />}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Deactivate "${deleteTarget?.name}"?`}
        message="This will hide the product from customers. It can be reactivated later."
        confirmLabel="Deactivate"
        dangerous
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ProductsListPage;
