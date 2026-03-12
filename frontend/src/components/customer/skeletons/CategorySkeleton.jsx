import React from 'react';

const CategorySkeleton = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Image area */}
      <div className="aspect-square w-full animate-pulse rounded bg-gray-200" />
      
      {/* Text line */}
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-200" />
    </div>
  );
};

export default CategorySkeleton;
