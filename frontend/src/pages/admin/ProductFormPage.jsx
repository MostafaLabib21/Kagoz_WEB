import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import ImageUploader from '../../components/admin/ImageUploader';
import TagInput from '../../components/admin/TagInput';
import VariantBuilder from '../../components/admin/VariantBuilder';
import { useToast } from '../../context/ToastContext';

const ProductFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('0');
  const [tags, setTags] = useState([]);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [productId, setProductId] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => { const { data } = await axiosInstance.get('/api/admin/categories'); return data; },
  });

  // Fetch product for edit
  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => { const { data } = await axiosInstance.get(`/api/admin/products/${id}`); return data; },
    enabled: isEditMode,
  });

  // Prefill on edit
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setSlug(product.slug || '');
      setShortDescription(product.shortDescription || '');
      setDescription(product.description || '');
      setPrice(product.price?.toString() || '');
      setCompareAtPrice(product.compareAtPrice?.toString() || '');
      setSku(product.sku || '');
      setStock(product.stock?.toString() || '0');
      setTags(product.tags || []);
      setVariants(product.variants || []);
      setImages(product.images || []);
      setCategoryId(product.category?._id || product.category || '');
      setIsFeatured(product.isFeatured || false);
      setIsActive(product.isActive ?? true);
      setProductId(product.productId || '');
    }
  }, [product]);

  // Auto-generate slug from name
  const handleNameChange = (val) => {
    setName(val);
    if (!isEditMode || !product) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
    }
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Required';
    if (!description.trim()) e.description = 'Required';
    if (!price || parseFloat(price) < 0) e.price = 'Required';
    if (!categoryId) e.category = 'Required';
    if (!images.length) e.images = 'At least 1 image required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (activeOverride) => {
    if (!validate()) return;
    setSaving(true);
    try {
      const body = {
        name, slug, shortDescription, description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        sku: sku || undefined,
        stock: parseInt(stock) || 0,
        tags, variants, images,
        category: categoryId,
        isFeatured,
        isActive: activeOverride !== undefined ? activeOverride : isActive,
      };

      if (isEditMode) {
        await axiosInstance.put(`/api/admin/products/${id}`, body);
        showToast('Product updated', 'success');
      } else {
        await axiosInstance.post('/api/admin/products', body);
        showToast('Product created', 'success');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  // New category modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatParent, setNewCatParent] = useState('');

  const createCategoryMutation = useMutation({
    mutationFn: (body) => axiosInstance.post('/api/admin/categories', body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setCategoryId(res.data._id);
      setShowCatModal(false);
      setNewCatName('');
      setNewCatParent('');
    },
    onError: (err) => showToast(err.response?.data?.message || 'Failed', 'error'),
  });

  if (isEditMode && loadingProduct) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
  }

  const priceNum = parseFloat(price) || 0;
  const compareNum = parseFloat(compareAtPrice) || 0;
  const stockNum = parseInt(stock) || 0;

  return (
    <div className="pb-20">
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input value={name} onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${errors.name ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                  <span>Slug:</span>
                  <input value={slug} onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs" />
                </div>
                {isEditMode && productId && (
                  <p className="text-xs text-gray-400 mt-1">Product ID: {productId}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea rows={2} maxLength={160} value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                <p className={`text-xs text-right mt-0.5 ${shortDescription.length > 140 ? 'text-red-500' : 'text-gray-400'}`}>
                  {shortDescription.length} / 160 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${errors.description ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳) *</label>
                <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${errors.price ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare At Price (৳)</label>
                <input type="number" step="0.01" min="0" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
            </div>
            {compareNum > 0 && priceNum > 0 && compareNum > priceNum && (
              <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm px-3 py-1.5 rounded-full">
                Was ৳{compareNum.toFixed(2)} → Now ৳{priceNum.toFixed(2)} · Save {Math.round((compareNum - priceNum) / compareNum * 100)}%
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input value={sku} onChange={(e) => setSku(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              {stockNum === 0 ? (
                <><span className="w-2 h-2 rounded-full bg-red-500" /><span className="text-red-600">Out of Stock</span></>
              ) : stockNum <= 5 ? (
                <><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-amber-600">Low Stock — will show warning to customers</span></>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-green-500" /><span className="text-green-600">In Stock</span></>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
            <p className="text-xs text-gray-500 mb-3">Press Enter or comma to add a tag</p>
            <TagInput tags={tags} onChange={setTags} />
          </div>

          {/* Variants */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Variants</h3>
            <VariantBuilder variants={variants} onChange={setVariants} />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Product Images *</h3>
            {errors.images && <p className="text-xs text-red-500 mb-2">{errors.images}</p>}
            <ImageUploader
              images={images}
              onUpload={(img) => setImages((prev) => [...prev, img])}
              onDelete={(publicId) => setImages((prev) => prev.filter((i) => i.publicId !== publicId))}
              onReorder={setImages}
              maxImages={6}
            />
          </div>

          {/* Organisation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Organisation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${errors.category ? 'border-red-300' : 'border-gray-300'}`}>
                  <option value="">Select category</option>
                  {categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                <button onClick={() => setShowCatModal(true)} className="text-xs text-indigo-600 hover:underline mt-1">
                  + New Category
                </button>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Featured Product</p>
                  <p className="text-xs text-gray-400">Show in featured section on homepage</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Active — visible to customers</p>
                </div>
              </label>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Pricing Summary</h3>
            <div className="text-center">
              {compareNum > 0 && compareNum > priceNum && (
                <p className="text-gray-400 line-through text-sm">৳{compareNum.toFixed(2)}</p>
              )}
              <p className="text-2xl font-bold text-gray-900">৳{priceNum.toFixed(2)}</p>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                {stockNum === 0 ? (
                  <><span className="w-2 h-2 rounded-full bg-red-500" /><span className="text-red-600">Out of Stock</span></>
                ) : stockNum <= 5 ? (
                  <><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-amber-600">Low Stock</span></>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-green-500" /><span className="text-green-600">In Stock ({stockNum})</span></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t shadow-lg px-6 py-3 flex items-center justify-between z-10">
        <Link to="/admin/products" className="text-sm text-gray-500 hover:text-gray-700">← Back to Products</Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />} Save as Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />} Save & Publish
          </button>
        </div>
      </div>

      {/* New Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">New Category</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
                <p className="text-xs text-gray-400 mt-1">
                  Slug: {newCatName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (optional)</label>
                <select value={newCatParent} onChange={(e) => setNewCatParent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">None</option>
                  {categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowCatModal(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg">Cancel</button>
              <button
                onClick={() => createCategoryMutation.mutate({ name: newCatName, parentCategory: newCatParent || undefined })}
                disabled={!newCatName.trim()}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFormPage;
