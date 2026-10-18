import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  ShieldCheck,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, logout, login } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top Campus Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-medium">
              Smart Canteen Management System • Campus Food Made Effortless
            </span>
          </div>
          <div className="text-[11px] text-emerald-200 hidden sm:block">
            Main Campus Food Court • Hours: 8:00 AM - 8:30 PM
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-1">
                Smart<span className="text-emerald-600">Canteen</span>
              </span>
              <span className="text-[10px] text-gray-400 block -mt-1 font-medium tracking-wider">
                CAMPUS FOOD HUB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/menu') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Food Menu
            </Link>

            {role === 'student' && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                    isActive('/student/dashboard')
                      ? 'text-emerald-700 bg-emerald-50 font-semibold'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  My Dashboard
                </Link>
                <Link
                  to="/student/orders"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                    isActive('/student/orders')
                      ? 'text-emerald-700 bg-emerald-50 font-semibold'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  My Orders
                </Link>
              </>
            )}

            {role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-amber-800 bg-amber-50 font-bold'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Admin Portal
              </Link>
            )}

            <Link
              to="/about"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/about') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/contact') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons: Cart & Profile */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition flex items-center"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={role === 'admin' ? '/admin/dashboard' : '/student/profile'}
                  className="hidden sm:flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-gray-50 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-gray-800 block leading-tight">
                      {user.full_name?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize block leading-none">
                      {user.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-slide-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50"
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50"
          >
            Food Menu
          </Link>
          {role === 'student' && (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50"
              >
                My Dashboard
              </Link>
              <Link
                to="/student/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50"
              >
                My Orders
              </Link>
              <Link
                to="/student/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50"
              >
                Student Profile
              </Link>
            </>
          )}

          {role === 'admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-amber-800 bg-amber-50"
            >
              Admin Dashboard
            </Link>
          )}

          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50"
          >
            My Cart ({itemCount} items)
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50"
          >
            About Canteen
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-emerald-50"
          >
            Contact & Support
          </Link>

          {user ? (
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Logged in as <strong className="text-gray-800">{user.full_name}</strong>
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs text-rose-600 font-semibold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-semibold border rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
