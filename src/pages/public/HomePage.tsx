import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FoodItem, Category } from '../../types';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodModal } from '../../components/common/FoodModal';
import {
  UtensilsCrossed,
  Clock,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [popularItems, setPopularItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [items, cats] = await Promise.all([
          api.getFoodItems(),
          api.getCategories(),
        ]);
        setPopularItems(items.filter((i) => i.is_popular).slice(0, 4));
        setCategories(cats.slice(0, 6));
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-gray-50/50 pt-12 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Next-Gen Smart Campus Food Ordering</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
                Skip the lines. <br />
                <span className="text-emerald-600">Savor hot meals</span> <br />
                on your schedule.
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                Order your favorite breakfast, lunch, and snacks directly from your phone. Receive a live queue order token, pay seamlessly via UPI or Cash, and pick up your hot tray in minutes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/menu"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition flex items-center gap-2 group"
                >
                  <span>Explore Food Menu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/student/orders"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-base shadow-xs transition flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Track Active Order</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200/60 max-w-md">
                <div>
                  <span className="text-2xl font-black text-gray-900 block">10-15m</span>
                  <span className="text-xs text-gray-500">Average prep time</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-emerald-600 block">100%</span>
                  <span className="text-xs text-gray-500">Contactless pickup</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-gray-900 block">₹0</span>
                  <span className="text-xs text-gray-500">Zero queue time</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious campus food platter"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-black/20 to-transparent" />

                {/* Floating Live Status Card */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-emerald-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium block">Express Kitchen</span>
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Live & Accepting Orders
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Campus Special
                  </span>
                  <h3 className="text-lg font-bold mt-1">Deluxe Campus Veg Thali</h3>
                  <p className="text-xs text-gray-200 mt-0.5">
                    Steamed Basmati, Dal Tadka, Paneer Butter Masala, Rotis & Dessert
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xl font-extrabold text-emerald-300">₹120</span>
                    <Link
                      to="/menu"
                      className="text-xs bg-white text-gray-950 font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition"
                    >
                      Order Tray
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS 3-STEP PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Frictionless Ordering
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
            How Smart Canteen Works
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Designed specifically for break intervals and busy lecture schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition text-center relative group">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold font-mono text-emerald-600 block mb-1">
              STEP 01
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Select Your Meal</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Browse today's live menu, view prep times and calories, and customize your meal tray right from your phone.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition text-center relative group">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold font-mono text-blue-600 block mb-1">
              STEP 02
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Safe Checkout</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Pay in seconds with Razorpay UPI/cards, or choose cash at the counter. Receive an authoritative unique token number.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition text-center relative group">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
              <QrCode className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold font-mono text-amber-600 block mb-1">
              STEP 03
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Collect with QR Token</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Track live kitchen status. Once your screen shows 'Ready for Pickup', show your QR token at the counter and collect!
            </p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR PICKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Campus Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Most Loved Today
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Popular breakfast and lunch specials fresh from the central canteen oven.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onQuickView={(i) => setSelectedItem(i)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. CATEGORIES OVERVIEW */}
      <section className="bg-emerald-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-8 sm:p-12 overflow-hidden relative">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/60">
            Hygienic & Fresh
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Craving something delicious between lectures?
          </h2>
          <p className="text-emerald-200 text-sm leading-relaxed">
            From crispy Mysore Masala Dosa in the morning to hot Chole Bhature and chilled Mango Lassi in the afternoon, we have you covered.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/menu?category=${c.id}`}
                className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-xs font-medium text-emerald-100 border border-emerald-700/60 transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-emerald-800/30 blur-3xl pointer-events-none" />
      </section>

      {/* Quick View Modal */}
      <FoodModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};
