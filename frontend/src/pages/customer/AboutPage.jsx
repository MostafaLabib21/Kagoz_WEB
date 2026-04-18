import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Leaf, Package } from 'lucide-react';

const AboutPage = () => {
  return (
    <div>
      <section className="bg-gray-50 py-20 px-4 text-center">
        <p className="text-gray-500 tracking-widest uppercase text-xs">About Kagoj</p>
        <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mt-3 max-w-2xl mx-auto">
          Crafted with care, inspired by nature
        </h1>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto leading-relaxed">
          Kagoj began with a simple belief that stationery should feel personal, warm, and meaningful.
          We celebrate the joy of putting pen to paper through thoughtfully curated products made to
          inspire daily rituals, heartfelt notes, and creative expression.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-200 aspect-square rounded-sm flex items-center justify-center">
            <span className="text-gray-500 font-medium">Our Story</span>
          </div>

          <div>
            <p className="text-gray-500 tracking-widest uppercase text-xs">Our Story</p>
            <h2 className="font-bold text-2xl text-gray-900 mt-2">Where it all began</h2>
            <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Kagoj was founded from a deep love for paper goods and the quiet moments they create.
                What started as a small search for beautiful, natural stationery quickly grew into a brand
                dedicated to timeless craftsmanship.
              </p>
              <p>
                We believe writing by hand slows life down in the best way. From journals to gift wraps,
                every item in our collection is chosen to bring intention and delight to everyday use.
              </p>
              <p>
                Our mission is to keep the spirit of meaningful correspondence alive while supporting
                mindful choices for both people and the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-center mb-10 text-2xl font-bold text-gray-900">What we stand for</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div>
            <Leaf className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2 text-center">Eco Friendly</h3>
            <p className="text-sm text-gray-600 text-center">
              We choose products made from natural, recycled materials.
            </p>
          </div>

          <div>
            <Heart className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2 text-center">Made with Love</h3>
            <p className="text-sm text-gray-600 text-center">
              Every product is handpicked for its quality and story.
            </p>
          </div>

          <div>
            <Package className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2 text-center">Quality First</h3>
            <p className="text-sm text-gray-600 text-center">
              We only stock what we would use ourselves.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Ready to explore?</h2>
        <p className="text-gray-600 mt-2">Browse our full collection of natural stationery</p>
        <div className="mt-6">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-sm bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
        <div className="mt-3">
          <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
