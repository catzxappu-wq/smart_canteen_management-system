import React from 'react';
import { Utensils, Award, ShieldCheck, Heart, Users, Clock, Leaf } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          Campus Food Excellence
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
          About Campus Hub Smart Canteen
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Serving over 2,500 students, researchers, and faculty members daily with fresh, hygienic, and affordable meals without the hassle of long queues.
        </p>
      </div>

      {/* Hero Image & Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
            alt="Modern kitchen team"
            className="w-full h-80 sm:h-96 object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            Our Vision: A Smart, Digital, and Zero-Waste Campus Dining Experience
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Prior to the Smart Canteen system, students routinely lost 20 to 30 minutes of their short 45-minute lecture breaks standing in congested order lines and counter queues.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            By shifting order placement, price calculation, and digital payments online, orders flow straight into the kitchen display system (KDS). Food is prepared just-in-time, keeping meals hot and queues non-existent.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <Leaf className="w-5 h-5 text-emerald-600 mb-2" />
              <h4 className="font-bold text-gray-900 text-sm">Fresh Ingredients</h4>
              <p className="text-xs text-gray-500 mt-1">Locally sourced produce delivered daily at 6:00 AM.</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
              <h4 className="font-bold text-gray-900 text-sm">FSSAI Certified</h4>
              <p className="text-xs text-gray-500 mt-1">Strict sterilization and temperature safety controls.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900">Why Students Choose Smart Canteen</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Built to improve campus life everyday.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2">
            <Clock className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-base text-gray-900">Zero Wait Express Pickup</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Order during lecture intervals and arrive at the pickup counter exactly when your status flashes Ready.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-base text-gray-900">Transparent Subsidized Pricing</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Wholesome vegetarian thalis and quick breakfast items priced specifically for student budgets.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <h4 className="font-bold text-base text-gray-900">Nutritional Awareness</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Calorie count, preparation times, and allergen notices listed transparently for every menu item.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
