import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, PlusCircle, FolderOpen,
  ShoppingBag, Layout, Settings, LogOut
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'MAIN',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'PRODUCTS',
    items: [
      { to: '/admin/products', label: 'All Products', icon: Package, end: true },
      { to: '/admin/products/new', label: 'Add Product', icon: PlusCircle },
      { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
    ],
  },
  {
    label: 'ORDERS',
    items: [
      { to: '/admin/orders', label: 'All Orders', icon: ShoppingBag },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { to: '/admin/settings', label: 'Store Config', icon: Settings },
    ],
  },
  {
    label: 'STORE',
    items: [
      { to: '/admin/homepage', label: 'Homepage Manager', icon: Layout },
    ],
  },
];

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/homepage': 'Homepage Manager',
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Determine page title
  let pageTitle = 'Admin';
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (location.pathname.startsWith(path)) {
      pageTitle = title;
    }
  }
  if (location.pathname.match(/\/admin\/products\/.+\/edit/)) pageTitle = 'Edit Product';
  if (location.pathname.match(/\/admin\/orders\/.+/) && !location.pathname.endsWith('/orders')) pageTitle = 'Order Details';

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col overflow-y-auto z-20">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex flex-col leading-none">
            <img
              src="/kagoj_small_logo.png"
              alt="Kagoj"
              className="h-8 w-auto"
            />
            <span className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">Admin Portal</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-3">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-gray-900 text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 h-16 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{pageTitle}</h2>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold text-sm group-hover:bg-gray-200 transition-colors">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900">{user?.name}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''} group-hover:text-gray-600`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                <Link
                  to="/"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Back to Store
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
