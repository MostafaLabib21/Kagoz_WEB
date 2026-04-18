import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ShopPagination = ({ page, pages, onPageChange }) => {
  const pageItems = useMemo(() => {
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, index) => index + 1);
    }

    const items = [1];

    if (page > 3) {
      items.push('...');
    }

    [page - 1, page, page + 1].forEach((num) => {
      if (num > 1 && num < pages) {
        items.push(num);
      }
    });

    if (page < pages - 2) {
      items.push('...');
    }

    items.push(pages);

    const deduped = [];
    const seen = new Set();

    items.forEach((item) => {
      const key = `${typeof item}-${item}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(item);
      }
    });

    return deduped;
  }, [page, pages]);

  if (pages <= 1) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {pageItems.map((item, index) => {
          if (item === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-sm text-gray-500">
                ...
              </span>
            );
          }

          const isActive = item === page;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`min-w-9 rounded-md px-3 py-2 text-sm ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-gray-500">Page {page} of {pages}</p>
    </div>
  );
};

export default ShopPagination;
