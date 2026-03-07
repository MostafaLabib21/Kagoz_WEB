import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, total, limit, onChange }) => {
  if (pages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const nums = [];
    let startP = Math.max(1, page - 2);
    let endP = Math.min(pages, startP + 4);
    if (endP - startP < 4) startP = Math.max(1, endP - 4);
    for (let i = startP; i <= endP; i++) nums.push(i);
    return nums;
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-600">
        Showing {start}-{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {getPageNumbers().map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded-lg text-sm ${
              n === page ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
