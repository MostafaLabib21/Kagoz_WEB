import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kagoj</h2>
            <p className="mt-1 text-sm text-gray-500">natural stationery</p>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Thoughtfully crafted paper goods and stationery made for letters, journals,
              gifting, and everyday rituals.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Shop</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Link to="/shop" className="block text-gray-600 hover:text-gray-900">
                All Products
              </Link>
              <Link to="/shop?sort=newest" className="block text-gray-600 hover:text-gray-900">
                New Arrivals
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Help</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Link to="/contact" className="block text-gray-600 hover:text-gray-900">
                Contact Us
              </Link>
              <Link to="/shipping" className="block text-gray-600 hover:text-gray-900">
                Shipping
              </Link>
              <Link to="/returns" className="block text-gray-600 hover:text-gray-900">
                Returns
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Account</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Link to="/my-orders" className="block text-gray-600 hover:text-gray-900">
                My Orders
              </Link>
              {!user && (
                <>
                  <Link to="/login" className="block text-gray-600 hover:text-gray-900">
                    Login
                  </Link>
                  <Link to="/register" className="block text-gray-600 hover:text-gray-900">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-gray-200 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Kagoj. All rights reserved.</p>
          <p>Made with care for paper lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;