import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { CanteenSettings } from '../types';
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  FolderTree,
  BarChart3,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  ExternalLink,
  ShieldAlert,
  Power,
  Banknote,
  UtensilsCrossed,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, role, logout, isLoading } = useAuth();
  const { success, error: toastError } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<CanteenSettings | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-mono">Authenticating canteen admin...</p>
        </div>
      </div>
    );
  }

  // Strict Admin Role Enforcement
  if (!user || role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleToggleCanteenOpen = async () => {
    if (!settings) return;
    setIsUpdating(true);
    try {
      const nextState = !settings.is_canteen_open;
      const updated = await api.updateSettings({
        id: settings.id,
        is_canteen_open: nextState,
      });
      setSettings(updated);
      success(
        nextState ? 'Canteen Opened' : 'Canteen Closed',
        nextState
          ? 'Students can now place orders.'
          : 'Ordering is paused for students.'
      );
    } catch (e: any) {
      toastError('Update failed', e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleCashCounter = async () => {
    if (!settings) return;
    setIsUpdating(true);
    try {
      const nextState = !settings.cash_on_counter_enabled;
      const updated = await api.updateSettings({
        id: settings.id,
        cash_on_counter_enabled: nextState,
      });
      setSettings(updated);
      success(
        nextState ? 'Cash Counter Enabled' : 'Cash Counter Disabled',
        nextState
          ? 'Students can select Pay at Counter.'
          : 'Students must pay online via Razorpay.'
      );
    } catch (e: any) {
      toastError('Update failed', e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Live Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Food Items', path: '/admin/food-items', icon: Utensils },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Sales & Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Canteen Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-100/80">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 border-r border-gray-800 text-gray-300">
        {/* Brand */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-gray-950 font-bold shadow-md shadow-amber-500/20">
              <UtensilsCrossed className="w-5 h-5 text-gray-950" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">Admin Portal</h2>
              <span className="text-[10px] text-amber-400 font-mono tracking-wider uppercase">
                Campus Canteen
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-amber-500 text-gray-950 font-bold shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-gray-950' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Store Link */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/menu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 hover:bg-emerald-900/40 transition"
          >
            <span>View Student Menu</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Admin Profile */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                {user.full_name?.charAt(0) || 'A'}
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[100px]">
                  {user.full_name}
                </span>
                <span className="text-[10px] text-gray-400 block">Chef / Admin</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
                aria-label="Open sidebar menu"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
              <div className="hidden sm:block">
                <span className="text-xs text-gray-400 font-medium">Administration Control</span>
                <h1 className="text-sm font-bold text-gray-800">
                  {settings?.canteen_name || 'Smart Canteen'}
                </h1>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-3">
              {/* Canteen Open/Close Switch */}
              {settings && (
                <button
                  onClick={handleToggleCanteenOpen}
                  disabled={isUpdating}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    settings.is_canteen_open
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                  }`}
                  title="Toggle whether canteen accepts orders right now"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{settings.is_canteen_open ? 'Kitchen Open' : 'Kitchen Closed'}</span>
                </button>
              )}

              {/* Cash On Counter Switch */}
              {settings && (
                <button
                  onClick={handleToggleCashCounter}
                  disabled={isUpdating}
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    settings.cash_on_counter_enabled
                      ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                  }`}
                  title="Enable or disable cash payment at counter"
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>{settings.cash_on_counter_enabled ? 'Cash Allowed' : 'Online Only'}</span>
                </button>
              )}

              <Link
                to="/"
                className="text-xs font-semibold text-gray-600 hover:text-emerald-700 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition hidden md:block"
              >
                Public Site →
              </Link>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-[80%] h-full bg-gray-900 text-gray-300 shadow-2xl p-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <span className="font-bold text-white">Admin Navigation</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                        active
                          ? 'bg-amber-500 text-gray-950 font-bold'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-900"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
