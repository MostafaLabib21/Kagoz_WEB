import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import MobileDrawer from './MobileDrawer';

const navLinkClassName = ({ isActive }) =>
  [
    'text-sm font-medium transition-colors hover:text-gray-900',
    isActive ? 'text-gray-900 underline underline-offset-8' : 'text-gray-600',
  ].join(' ');

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    const trimmedQuery = searchQuery.trim();
    navigate(trimmedQuery ? `/shop?search=${encodeURIComponent(trimmedQuery)}` : '/shop');
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto hidden max-w-7xl items-center justify-between px-4 py-4 md:flex sm:px-6 lg:px-8">
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-2xl font-bold text-gray-900">Kagoj</span>
          <span className="mt-1 text-xs text-gray-500">natural stationery</span>
        </Link>

        <nav className="flex items-center gap-8">
          <NavLink to="/shop" className={navLinkClassName}>
            Shop
          </NavLink>
          <NavLink to="/about" className={navLinkClassName}>
            About
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen((current) => !current)}
            className="text-gray-600 transition-colors hover:text-gray-900"
            aria-label="Open search"
          >
            <Search size={20} />
          </button>

          {user?.role !== 'admin' && (
            <Link to="/cart" className="relative text-gray-600 transition-colors hover:text-gray-900" aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          )}

          {!user ? (
            <Link to="/login" className="text-gray-600 transition-colors hover:text-gray-900" aria-label="Login">
              <User size={20} />
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((current) => !current)}
                className="text-gray-600 transition-colors hover:text-gray-900"
                aria-label="Account menu"
              >
                <User size={20} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{user.email}</p>
                  </div>

                  <div className="border-t border-gray-200" />

                  <div className="py-2">
                    {user?.role === 'admin' ? (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/my-orders"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        >
                          My Profile
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-gray-200" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-4 md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="text-gray-600 transition-colors hover:text-gray-900"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="text-xl font-bold text-gray-900">
          Kagoj
        </Link>
        {user?.role !== 'admin' ? (
          <Link to="/cart" className="relative text-gray-600 transition-colors hover:text-gray-900" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        ) : (
          <div className="w-5" />
        )}
      </div>

      <div
        className={`overflow-hidden border-t border-gray-200 transition-all duration-300 ${
          searchOpen ? 'max-h-24' : 'max-h-0 border-t-0'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search for products..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 text-sm text-gray-900 outline-none transition focus:border-gray-400"
            />
            <button
              type="button"
              onClick={handleSearchClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-900"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
};

export default Navbar;