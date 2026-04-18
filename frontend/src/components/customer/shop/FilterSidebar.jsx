import React, { useEffect, useMemo, useState } from 'react';

const FilterSidebar = ({
  categories,
  filters,
  onFilterChange,
  onClearAll,
}) => {
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    setLocalMinPrice(filters.minPrice || '');
    setLocalMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  const hasActiveFilters = useMemo(
    () => Boolean(filters.category || filters.minPrice || filters.maxPrice || filters.inStock),
    [filters.category, filters.minPrice, filters.maxPrice, filters.inStock]
  );

  const handleCategoryChange = (slug) => {
    onFilterChange({
      ...filters,
      category: slug,
    });
  };

  const handleApplyPrice = () => {
    onFilterChange({
      ...filters,
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
    });
  };

  const handleToggleStock = () => {
    onFilterChange({
      ...filters,
      inStock: !filters.inStock,
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Categories</h3>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleCategoryChange('')}
              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                filters.category === ''
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>All Products</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                  filters.category === cat.slug
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    filters.category === cat.slug
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {cat.productCount || 0}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Price Range</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={localMinPrice}
              onChange={(event) => setLocalMinPrice(event.target.value)}
              placeholder="Min"
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
            />
            <span className="text-xs text-gray-500">to</span>
            <input
              type="number"
              min="0"
              value={localMaxPrice}
              onChange={(event) => setLocalMaxPrice(event.target.value)}
              placeholder="Max"
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyPrice}
            className="mt-2 w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Apply Price
          </button>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-gray-900">Availability</h3>
          <button
            type="button"
            onClick={handleToggleStock}
            className="flex w-full items-center justify-between rounded-md border border-gray-200 px-2 py-2"
          >
            <span className="text-sm text-gray-700">In Stock Only</span>
            <span
              className={`relative h-5 w-10 rounded-full transition-colors ${
                filters.inStock ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  filters.inStock ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </span>
          </button>
        </section>
      </div>
    </div>
  );
};

export default FilterSidebar;
