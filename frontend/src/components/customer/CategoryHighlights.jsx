import React from 'react';
import { Link } from 'react-router-dom';

const CategoryHighlights = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category._id || category.id}
              to={`/shop?category=${category.slug}`}
              className="group flex flex-col items-center"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                    <span className="text-4xl font-light opacity-50">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <span className="mt-3 text-sm font-medium text-gray-900 group-hover:text-gray-700 md:text-base">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlights;
