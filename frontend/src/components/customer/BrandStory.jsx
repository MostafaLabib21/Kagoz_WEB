import React from 'react';
import { Link } from 'react-router-dom';

const BrandStory = () => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Left Column: Image placeholder */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 md:aspect-[4/3]">
            {/* If we had a real image, it would go here. For now, a styled placeholder. */}
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
               <span className="text-gray-400">Our Story Image</span>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col justify-center">
            <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Our Story
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Crafted with care, inspired by nature
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                At Kagoj, we believe that the tools you use to create should be as inspiring as the ideas they hold. 
                Our handmade stationery is crafted using sustainable materials and traditional techniques that have 
                been passed down through generations.
              </p>
              <p>
                Every notebook, journal, and sheet of paper tells a story of craftsmanship and dedication. 
                We are committed to preserving the environment while providing you with the finest quality 
                products for your creative journey.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/about"
                className="font-medium text-gray-900 hover:text-gray-700 hover:underline hover:underline-offset-4"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
