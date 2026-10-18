import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Clock, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Smart<span className="text-emerald-500">Canteen</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering students and faculty with contactless meal pre-ordering, digital payments, and queue-free express pickups.
            </p>
            <div className="pt-2 text-xs text-gray-400">
              <span className="inline-block px-2.5 py-1 rounded bg-gray-800 border border-gray-700 text-emerald-400 font-mono">
                College Capstone Engineering Project
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/menu" className="hover:text-emerald-400 transition">
                  Browse Food Menu
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-emerald-400 transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/student/orders" className="hover:text-emerald-400 transition">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition">
                  About Our Kitchen
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition">
                  Help & Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Canteen Hours & Location */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Canteen Hours
            </h4>
            <div className="space-y-2.5 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-white block font-medium">Mon - Sat: 8:00 AM - 8:30 PM</span>
                  <span className="text-xs">Breakfast, Lunch & Evening Snacks</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Main Campus Food Court, Ground Floor, Academic Block B</span>
              </div>
            </div>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Administration & Safety
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Protected by PostgreSQL Row Level Security (RLS) and authenticated HMAC payment verification.
            </p>
            <div className="space-y-2 text-sm">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl transition border border-gray-700"
              >
                <ShieldCheck className="w-4 h-4" />
                Administrator Portal Login
              </Link>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> +91 98765 43210
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" /> canteen@campus.edu
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© 2026 Smart Canteen Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-400">Razorpay Test Mode</span>
            <span>•</span>
            <span className="hover:text-gray-400">Supabase PostgreSQL RLS</span>
            <span>•</span>
            <span className="hover:text-gray-400">Vercel Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
