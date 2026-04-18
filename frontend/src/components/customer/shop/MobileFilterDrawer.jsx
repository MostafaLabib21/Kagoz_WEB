import React from 'react';
import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

const MobileFilterDrawer = ({
  isOpen,
  onClose,
  categories,
  filters,
  onFilterChange,
  onClearAll,
}) => {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close filters"
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-white transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
          />
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterDrawer;
