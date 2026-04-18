import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const SortBar = ({
  total,
  sort,
  onSortChange,
  onToggleMobileFilters,
  activeFilterCount,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileFilters}
          className="relative flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-gray-900 px-1.5 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="hidden text-sm text-gray-600 md:block">{total} products found</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-gray-600 md:block">Sort:</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-900 focus:outline-none"
        >
          <option value="">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};

export default SortBar;
