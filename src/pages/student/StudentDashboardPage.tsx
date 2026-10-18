import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Order, FoodItem } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentBadge } from '../../components/common/PaymentBadge';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  BellRing,
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommended, setRecommended] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const [userOrders, items] = await Promise.all([
          api.getUserOrders(user.id),
          api.getFoodItems(),
        ]);
        setOrders(userOrders);
        setRecommended(items.filter((i) => i.is_popular).slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const activeOrders = orders.filter((o) =>
    ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup'].includes(o.order_status)
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold text-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Campus Dining Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Skip the long queue at lunch! Pre-order your favorite meal now and pick it up hot at Express Counter #1.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/menu"
            className="px-5 py-3 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 active:scale-95 shadow-md transition flex items-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Order Fresh Meal</span>
          </Link>
          <Link
            to="/student/orders"
            className="px-5 py-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm border border-emerald-500/40 transition flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Order History</span>
          </Link>
        </div>
      </div>

      {/* Active Ongoing Orders Section */}
      {activeOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Active Kitchen Tokens ({activeOrders.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrders.map((order) => {
              const isReady = order.order_status === 'Ready for Pickup';
              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between gap-4 ${
                    isReady
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-mono block font-bold">
                        Token Number
                      </span>
                      <span className="text-xl font-black font-mono text-gray-900">
                        {order.order_number}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusBadge status={order.order_status} size="sm" />
                        <PaymentBadge status={order.payment_status} method={order.payment_method} size="sm" />
                      </div>
                    </div>

                    {isReady && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 shadow-xs animate-bounce">
                        <BellRing className="w-3 h-3" /> Ready
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 line-clamp-1">
                    {order.items?.map((i) => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-extrabold text-base text-gray-900">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                    <Link
                      to={`/track-order/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      <span>Track Live Queue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid: Recommended Specials & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recommended Campus Favorites */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recommended for Today</h2>
            <Link to="/menu" className="text-xs font-bold text-emerald-700 hover:underline">
              View All Menu →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommended.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full aspect-video rounded-xl object-cover mb-3"
                  />
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h3>
                  <span className="text-xs text-emerald-700 font-medium block mt-0.5">
                    ~{item.preparation_time}m prep
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">₹{item.price}</span>
                  <Link
                    to="/menu"
                    className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-2.5 py-1 rounded-lg font-bold transition"
                  >
                    + Add
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Account Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-gray-900 border-b pb-3">Your Canteen Stats</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Total Lifetime Orders:</span>
              <span className="font-bold text-gray-900">{orders.length}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Active Kitchen Orders:</span>
              <span className="font-bold text-emerald-600">{activeOrders.length}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Campus Express Counter:</span>
              <span className="font-semibold text-gray-800">Counter #1</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Link
              to="/student/profile"
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition block text-center"
            >
              Manage Student Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
