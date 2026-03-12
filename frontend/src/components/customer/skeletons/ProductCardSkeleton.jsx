import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-lg bg-white p-4 shadow-sm">
      {/* Image area */}
      <div className="aspect-square w-full animate-pulse rounded bg-gray-200" />
      
      {/* Content lines */}
      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Button area */}
      <div className="mt-4 h-8 w-full animate-pulse rounded bg-gray-200" />
    </div>
  );
};

export default ProductCardSkeleton;
