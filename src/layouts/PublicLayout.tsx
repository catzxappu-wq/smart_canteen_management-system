import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { api } from '../services/api';
import { CanteenSettings } from '../types';
import { Bell, Clock, AlertCircle } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const [settings, setSettings] = useState<CanteenSettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />

      {/* Canteen Closed Warning Banner if closed */}
      {settings && !settings.is_canteen_open && (
        <div className="bg-rose-600 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            The canteen is currently closed for new orders. Kitchen opens tomorrow at{' '}
            {settings.opening_time}. You may still browse the menu.
          </span>
        </div>
      )}

      {/* Canteen Announcement Notice */}
      {settings?.announcement_banner && settings.is_canteen_open && (
        <div className="bg-emerald-50 border-b border-emerald-100 text-emerald-900 text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
          <Bell className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{settings.announcement_banner}</span>
        </div>
      )}

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
