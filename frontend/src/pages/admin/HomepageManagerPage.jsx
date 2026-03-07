import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GripVertical, Pencil, Trash2, Upload, X, CheckCircle, Search } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axiosInstance from '../../utils/axiosInstance';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import useDebounce from '../../hooks/useDebounce';

const TABS = ['Hero Slides', 'Featured Products', 'Category Highlights', 'Settings'];

// --- Sortable Row wrapper ---
const SortableRow = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-3 mb-2">
      <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
        <GripVertical size={16} />
      </button>
      {children}
    </div>
  );
};

const HomepageManagerPage = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);

  const { data: config, isLoading } = useQuery({
    queryKey: ['admin-homepage'],
    queryFn: async () => { const { data } = await axiosInstance.get('/api/admin/homepage'); return data; },
  });

  // --- Hero Slides ---
  const [heroSlides, setHeroSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null); // index or 'new'
  const [slideForm, setSlideForm] = useState({ title: '', subtitle: '', buttonText: '', buttonLink: '', image: null, isActive: true });
  const [heroSaving, setHeroSaving] = useState(false);
  const [deleteSlideIdx, setDeleteSlideIdx] = useState(null);

  useEffect(() => { if (config?.heroSlides) setHeroSlides(config.heroSlides); }, [config]);

  const handleSlideImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const { data } = await axiosInstance.post('/api/admin/homepage/hero/upload', fd);
      setSlideForm((p) => ({ ...p, image: data }));
    } catch { showToast('Upload failed', 'error'); }
  };

  const openSlideEdit = (idx) => {
    const s = heroSlides[idx];
    setSlideForm({ title: s.title || '', subtitle: s.subtitle || '', buttonText: s.buttonText || '', buttonLink: s.buttonLink || '', image: s.image || null, isActive: s.isActive ?? true });
    setEditingSlide(idx);
  };

  const openSlideAdd = () => {
    setSlideForm({ title: '', subtitle: '', buttonText: '', buttonLink: '', image: null, isActive: true });
    setEditingSlide('new');
  };

  const saveSlideForm = () => {
    const slide = { ...slideForm, displayOrder: editingSlide === 'new' ? heroSlides.length : editingSlide };
    if (editingSlide === 'new') {
      setHeroSlides((p) => [...p, slide]);
    } else {
      setHeroSlides((p) => p.map((s, i) => i === editingSlide ? { ...s, ...slide } : s));
    }
    setEditingSlide(null);
  };

  const saveHero = async () => {
    setHeroSaving(true);
    try {
      await axiosInstance.put('/api/admin/homepage/hero', { heroSlides: heroSlides.map((s, i) => ({ ...s, displayOrder: i })) });
      queryClient.invalidateQueries({ queryKey: ['admin-homepage'] });
      showToast('Hero slides updated', 'success');
    } catch { showToast('Save failed', 'error'); }
    finally { setHeroSaving(false); }
  };

  const handleHeroDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = parseInt(active.id);
    const newIdx = parseInt(over.id);
    setHeroSlides((p) => arrayMove(p, oldIdx, newIdx));
  };

  // --- Featured Products ---
  const [featTitle, setFeatTitle] = useState('');
  const [featSubtitle, setFeatSubtitle] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [featSaving, setFeatSaving] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const debouncedProductSearch = useDebounce(productSearch, 400);

  useEffect(() => {
    if (config?.featuredSection) {
      setFeatTitle(config.featuredSection.title || 'Featured Products');
      setFeatSubtitle(config.featuredSection.subtitle || '');
      setSelectedProducts(config.featuredSection.productIds || []);
    }
  }, [config]);

  const { data: searchResults } = useQuery({
    queryKey: ['admin-products-search', debouncedProductSearch],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/admin/products', { params: { search: debouncedProductSearch, isActive: 'true', limit: 20 } });
      return data.products;
    },
    enabled: !!debouncedProductSearch,
  });

  const addFeaturedProduct = (product) => {
    if (selectedProducts.length >= 12) return;
    if (selectedProducts.find((p) => (p._id || p) === product._id)) return;
    setSelectedProducts((p) => [...p, product]);
  };

  const removeFeaturedProduct = (id) => {
    setSelectedProducts((p) => p.filter((prod) => (prod._id || prod) !== id));
  };

  const saveFeatured = async () => {
    setFeatSaving(true);
    try {
      await axiosInstance.put('/api/admin/homepage/featured', {
        title: featTitle, subtitle: featSubtitle,
        productIds: selectedProducts.map((p) => p._id || p),
      });
      queryClient.invalidateQueries({ queryKey: ['admin-homepage'] });
      showToast('Featured products updated', 'success');
    } catch (err) { showToast(err.response?.data?.message || 'Save failed', 'error'); }
    finally { setFeatSaving(false); }
  };

  const handleFeaturedDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = selectedProducts.findIndex((p) => (p._id || p) === active.id);
    const newIdx = selectedProducts.findIndex((p) => (p._id || p) === over.id);
    setSelectedProducts((p) => arrayMove(p, oldIdx, newIdx));
  };

  // --- Category Highlights ---
  const [catHighlights, setCatHighlights] = useState([]);
  const [catSaving, setCatSaving] = useState(false);

  const { data: allCategories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => { const { data } = await axiosInstance.get('/api/admin/categories'); return data; },
  });

  useEffect(() => {
    if (config?.categoryHighlights && allCategories) {
      const highlighted = config.categoryHighlights.map((h) => h.category?._id || h.category);
      setCatHighlights(
        allCategories.map((cat) => ({
          ...cat,
          checked: highlighted.includes(cat._id),
        }))
      );
    } else if (allCategories) {
      setCatHighlights(allCategories.map((cat) => ({ ...cat, checked: false })));
    }
  }, [config, allCategories]);

  const toggleCat = (id) => {
    setCatHighlights((p) => p.map((c) => c._id === id ? { ...c, checked: !c.checked } : c));
  };

  const saveCategories = async () => {
    setCatSaving(true);
    try {
      const ids = catHighlights.filter((c) => c.checked).map((c) => c._id);
      await axiosInstance.put('/api/admin/homepage/categories', { categoryIds: ids });
      queryClient.invalidateQueries({ queryKey: ['admin-homepage'] });
      showToast('Category highlights updated', 'success');
    } catch { showToast('Save failed', 'error'); }
    finally { setCatSaving(false); }
  };

  const handleCatDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = catHighlights.findIndex((c) => c._id === active.id);
    const newIdx = catHighlights.findIndex((c) => c._id === over.id);
    setCatHighlights((p) => arrayMove(p, oldIdx, newIdx));
  };

  // --- Settings ---
  const [newArrivals, setNewArrivals] = useState(8);
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => { if (config?.newArrivalsCount) setNewArrivals(config.newArrivalsCount); }, [config]);

  const saveSettings = async () => {
    setSettingsSaving(true);
    try {
      await axiosInstance.put('/api/admin/homepage/settings', { newArrivalsCount: newArrivals });
      queryClient.invalidateQueries({ queryKey: ['admin-homepage'] });
      showToast('Settings updated', 'success');
    } catch { showToast('Save failed', 'error'); }
    finally { setSettingsSaving(false); }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Homepage Manager</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab, idx) => (
          <button key={tab} onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === idx ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: Hero Slides */}
      {activeTab === 0 && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={openSlideAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
              Add Slide
            </button>
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleHeroDragEnd}>
            <SortableContext items={heroSlides.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
              {heroSlides.map((slide, idx) => (
                <SortableRow key={idx} id={idx.toString()}>
                  <div className="flex-1 flex items-center gap-4">
                    {slide.image?.url ? (
                      <img src={slide.image.url} alt="" className="w-20 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-20 h-12 bg-gray-100 rounded" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{slide.title || 'Untitled'}</p>
                      <p className="text-xs text-gray-500 truncate">{slide.subtitle}</p>
                    </div>
                    <button
                      onClick={() => setHeroSlides((p) => p.map((s, i) => i === idx ? { ...s, isActive: !s.isActive } : s))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${slide.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition ${slide.isActive ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                    <button onClick={() => openSlideEdit(idx)} className="text-gray-400 hover:text-indigo-600"><Pencil size={16} /></button>
                    <button onClick={() => { setDeleteSlideIdx(idx); }} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </SortableRow>
              ))}
            </SortableContext>
          </DndContext>

          {/* Inline Form */}
          {editingSlide !== null && (
            <div className="bg-gray-50 border rounded-lg p-4 mt-2 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {slideForm.image?.url ? (
                  <div className="relative inline-block">
                    <img src={slideForm.image.url} alt="" className="w-32 h-20 object-cover rounded" />
                    <button onClick={() => setSlideForm((p) => ({ ...p, image: null }))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded p-3 cursor-pointer text-sm text-gray-500">
                    <Upload size={16} /> Upload image
                    <input type="file" accept="image/*" className="hidden" onChange={handleSlideImageUpload} />
                  </label>
                )}
              </div>
              <input value={slideForm.title} onChange={(e) => setSlideForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input value={slideForm.subtitle} onChange={(e) => setSlideForm((p) => ({ ...p, subtitle: e.target.value }))} placeholder="Subtitle" className="w-full px-3 py-2 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input value={slideForm.buttonText} onChange={(e) => setSlideForm((p) => ({ ...p, buttonText: e.target.value }))} placeholder="Button Text" className="px-3 py-2 border rounded-lg text-sm" />
                <input value={slideForm.buttonLink} onChange={(e) => setSlideForm((p) => ({ ...p, buttonLink: e.target.value }))} placeholder="/shop" className="px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="flex gap-3">
                <button onClick={saveSlideForm} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
                <button onClick={() => setEditingSlide(null)} className="text-sm text-gray-500">Cancel</button>
              </div>
            </div>
          )}

          <button onClick={saveHero} disabled={heroSaving}
            className="w-full mt-4 bg-indigo-600 text-white py-2.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
            {heroSaving ? 'Saving...' : 'Save Hero Slides'}
          </button>

          <ConfirmModal
            isOpen={deleteSlideIdx !== null}
            title="Delete Slide?"
            message="This cannot be undone."
            confirmLabel="Delete"
            dangerous
            onConfirm={() => { setHeroSlides((p) => p.filter((_, i) => i !== deleteSlideIdx)); setDeleteSlideIdx(null); }}
            onCancel={() => setDeleteSlideIdx(null)}
          />
        </div>
      )}

      {/* Tab 1: Featured Products */}
      {activeTab === 1 && (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input value={featTitle} onChange={(e) => setFeatTitle(e.target.value)} placeholder="Section Title" className="px-4 py-2 border rounded-lg text-sm" />
            <input value={featSubtitle} onChange={(e) => setFeatSubtitle(e.target.value)} placeholder="Section Subtitle (optional)" className="px-4 py-2 border rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Selected */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Selected Products</h4>
              <p className={`text-xs mb-2 ${selectedProducts.length >= 12 ? 'text-red-500' : 'text-gray-400'}`}>{selectedProducts.length} / 12 products selected</p>
              {selectedProducts.length ? (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleFeaturedDragEnd}>
                  <SortableContext items={selectedProducts.map((p) => p._id || p)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {selectedProducts.map((product) => {
                        const pid = product._id || product;
                        return (
                          <SortableRow key={pid} id={pid}>
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {product.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt="" className="w-10 h-10 rounded object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-100" />
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{product.name || product.productId || pid}</p>
                                <p className="text-xs text-gray-400">{product.productId}</p>
                              </div>
                              <button onClick={() => removeFeaturedProduct(pid)} className="ml-auto text-gray-400 hover:text-red-500"><X size={14} /></button>
                            </div>
                          </SortableRow>
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">Search and add products from the right panel</p>
              )}
            </div>

            {/* Search */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Add Products</h4>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..." className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="max-h-96 overflow-y-auto space-y-1">
                {searchResults?.map((product) => {
                  const isSelected = selectedProducts.some((p) => (p._id || p) === product._id);
                  return (
                    <button
                      key={product._id}
                      onClick={() => !isSelected && addFeaturedProduct(product)}
                      disabled={isSelected || selectedProducts.length >= 12}
                      className={`w-full flex items-center gap-3 p-2 rounded hover:bg-gray-50 text-left ${isSelected ? 'opacity-50' : ''}`}
                    >
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.productId}</p>
                      </div>
                      {isSelected && <CheckCircle size={16} className="ml-auto text-green-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <button onClick={saveFeatured} disabled={featSaving}
            className="w-full mt-4 bg-indigo-600 text-white py-2.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
            {featSaving ? 'Saving...' : 'Save Featured Products'}
          </button>
        </div>
      )}

      {/* Tab 2: Category Highlights */}
      {activeTab === 2 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Drag to reorder. Only highlighted categories appear on the homepage.</p>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleCatDragEnd}>
            <SortableContext items={catHighlights.map((c) => c._id)} strategy={verticalListSortingStrategy}>
              {catHighlights.map((cat) => (
                <SortableRow key={cat._id} id={cat._id}>
                  <div className={`flex items-center gap-4 flex-1 ${!cat.checked ? 'opacity-50' : ''}`}>
                    <input type="checkbox" checked={cat.checked} onChange={() => toggleCat(cat._id)}
                      className="rounded border-gray-300 text-indigo-600" />
                    {cat.image?.url ? (
                      <img src={cat.image.url} alt="" className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><span className="text-gray-400 text-xs">—</span></div>
                    )}
                    <span className="font-medium text-sm">{cat.name}</span>
                    <span className="text-xs text-gray-500">{cat.productCount} products</span>
                  </div>
                </SortableRow>
              ))}
            </SortableContext>
          </DndContext>
          <button onClick={saveCategories} disabled={catSaving}
            className="w-full mt-4 bg-indigo-600 text-white py-2.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
            {catSaving ? 'Saving...' : 'Save Category Order'}
          </button>
        </div>
      )}

      {/* Tab 3: Settings */}
      {activeTab === 3 && (
        <div className="max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">New Arrivals Section</h3>
            <p className="text-sm text-gray-500 mb-4">Number of new products to display</p>
            <p className="text-xs text-gray-400 mb-3">Best results with multiples of 4 (fits the grid layout)</p>
            <div className="flex gap-2">
              {[4, 8, 12, 16].map((n) => (
                <button key={n} onClick={() => setNewArrivals(n)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    newArrivals === n ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button onClick={saveSettings} disabled={settingsSaving}
            className="w-full mt-4 bg-indigo-600 text-white py-2.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
            {settingsSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomepageManagerPage;
