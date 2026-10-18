import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Clock,
  User,
  ChevronRight,
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Verifying student session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const tabs = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Browse Menu', path: '/menu', icon: Utensils },
    { name: 'My Orders', path: '/student/orders', icon: Clock },
    { name: 'My Profile', path: '/student/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/60">
      <Navbar />

      {/* Student Sub-header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Student Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-emerald-800">
                {user.full_name} ({user.email})
              </span>
            </div>

            {/* Sub-nav tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                      active
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
