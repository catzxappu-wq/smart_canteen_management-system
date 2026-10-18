import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Order } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentBadge } from '../../components/common/PaymentBadge';
import {
  Clock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Utensils,
} from 'lucide-react';

export const StudentOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getUserOrders(user.id).then((data) => {
        setOrders(data);
        setIsLoading(false);
      });
    }
  }, [user]);

  const filteredOrders = orders.filter((o) => {
    const isOngoing = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup'].includes(o.order_status);
    if (activeTab === 'active') return isOngoing;
    if (activeTab === 'completed') return !isOngoing;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            My Order History
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            View active kitchen tokens and past meals.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'completed'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Past Orders
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isOngoing = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup'].includes(
              order.order_status
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Order Information */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-base text-gray-900">
                      {order.order_number}
                    </span>
                    <StatusBadge status={order.order_status} size="sm" />
                    <PaymentBadge status={order.payment_status} method={order.payment_method} size="sm" />
                  </div>

                  <p className="text-xs text-gray-500">
                    Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {/* Items snapshot summary */}
                  <div className="text-xs font-medium text-gray-700 flex flex-wrap gap-1 items-center">
                    {order.items?.map((item, idx) => (
                      <span key={item.id}>
                        {item.quantity}x {item.item_name_snapshot}
                        {idx < (order.items?.length || 0) - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-gray-400 block">Total</span>
                    <span className="text-lg font-black text-emerald-700">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/track-order/${order.id}`}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                        isOngoing
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      <span>{isOngoing ? 'Track Live' : 'View Receipt'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Orders in this View</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            You don't have any orders matching this category. Feel free to explore the menu and place a meal order.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
          >
            <span>Browse Food Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
