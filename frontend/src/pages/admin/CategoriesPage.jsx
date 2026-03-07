import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderOpen, Pencil, Trash2, Upload, X } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit', data? }
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formParent, setFormParent] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => { const { data } = await axiosInstance.get('/api/admin/categories'); return data; },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, body }) =>
      id ? axiosInstance.put(`/api/admin/categories/${id}`, body) : axiosInstance.post('/api/admin/categories', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      showToast(modal?.mode === 'edit' ? 'Category updated' : 'Category created', 'success');
      setModal(null);
    },
    onError: (err) => showToast(err.response?.data?.message || 'Failed', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/api/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      showToast('Category deleted', 'success');
      setDeleteTarget(null);
    },
    onError: (err) => showToast(err.response?.data?.message || 'Cannot delete', 'error'),
  });

  const openAdd = () => {
    setFormName(''); setFormParent(''); setFormImage(null);
    setModal({ mode: 'add' });
  };

  const openEdit = (cat) => {
    setFormName(cat.name);
    setFormParent(cat.parentCategory || '');
    setFormImage(cat.image || null);
    setModal({ mode: 'edit', data: cat });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('images', file);
      const { data } = await axiosInstance.post('/api/admin/upload', fd);
      if (data[0]) setFormImage(data[0]);
    } catch { showToast('Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    const body = { name: formName, parentCategory: formParent || null, image: formImage };
    saveMutation.mutate({ id: modal?.data?._id, body });
  };

  const parentName = (id) => categories?.find((c) => c._id === id)?.name || '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm">
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                </tr>
              ))
            ) : categories?.length ? (
              categories.map((cat) => (
                <tr key={cat._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {cat.image?.url ? (
                      <img src={cat.image.url} alt="" className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                        <FolderOpen size={16} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-600">{cat.parentCategory ? parentName(cat.parentCategory) : '—'}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{cat.productCount}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cat.displayOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(cat)} className="text-gray-400 hover:text-indigo-600"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteTarget(cat)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No categories yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">{modal.mode === 'edit' ? 'Edit' : 'Add'} Category</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                <p className="text-xs text-gray-400 mt-1">
                  Slug: {formName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select value={formParent} onChange={(e) => setFormParent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">None</option>
                  {categories?.filter((c) => c._id !== modal?.data?._id).map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {formImage?.url ? (
                  <div className="relative inline-block">
                    <img src={formImage.url} alt="" className="w-20 h-20 rounded object-cover" />
                    <button onClick={() => setFormImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-indigo-400 text-sm text-gray-500">
                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={!formName.trim() || saveMutation.isPending}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-50">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This cannot be undone."
        confirmLabel="Delete"
        dangerous
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CategoriesPage;
