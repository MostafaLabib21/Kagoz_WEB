import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
            <span className="text-xl font-bold text-gray-900">Kagoj</span>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/shop"
                onClick={onClose}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                Shop
              </NavLink>
              <NavLink
                to="/about"
                onClick={onClose}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                About
              </NavLink>
            </nav>
          </div>

          <div className="border-t border-gray-100 px-4 py-4">
            {user ? (
              <div className="flex flex-col space-y-4">
                <div className="px-2">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <div className="space-y-1">
                  {user?.role === 'admin' ? (
                    <Link
                      to="/admin/dashboard"
                      onClick={onClose}
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/my-orders"
                        onClick={onClose}
                        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/profile"
                        onClick={onClose}
                        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        My Profile
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
