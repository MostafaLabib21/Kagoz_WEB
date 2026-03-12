import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const FeaturedProducts = ({ title = 'Featured Products', subtitle, products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-gray-600">{subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-block rounded-lg border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
