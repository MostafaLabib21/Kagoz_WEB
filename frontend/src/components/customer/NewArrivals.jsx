import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const NewArrivals = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">New Arrivals</h2>
          <p className="mt-2 text-gray-600">Fresh additions to our collection</p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop?sort=newest"
            className="inline-block rounded-lg border border-gray-900 bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            See All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
