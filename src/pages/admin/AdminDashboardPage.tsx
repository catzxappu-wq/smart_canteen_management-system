import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentBadge } from '../../components/common/PaymentBadge';
import { useToast } from '../../context/ToastContext';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  Flame,
  BellRing,
  PackageCheck,
  IndianRupee,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const loadData = async () => {
    try {
      const [dStats, orders] = await Promise.all([
        api.getDashboardStats(),
        api.getAllOrders(),
      ]);
      setStats(dStats);
      setRecentOrders(orders.slice(0, 6));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      success('Order Updated', `Status changed to ${newStatus}`);
      loadData();
    } catch (e: any) {
      toastError('Update Failed', e.message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Orders",
      value: stats?.todayOrders ?? 0,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Awaiting Acceptance',
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      badge: stats?.pendingOrders > 0 ? 'Action Needed' : undefined,
    },
    {
      title: 'Cooking in Kitchen',
      value: stats?.preparingOrders ?? 0,
      icon: Flame,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'Ready for Counter',
      value: stats?.readyOrders ?? 0,
      icon: BellRing,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Verified Revenue',
      value: `₹${(stats?.verifiedRevenue ?? 0).toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-emerald-700',
      bg: 'bg-emerald-100/60',
      subtitle: 'Paid online & confirmed cash',
    },
    {
      title: 'Meals Completed',
      value: stats?.completedOrders ?? 0,
      icon: PackageCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Items Sold',
      value: stats?.totalItemsSold ?? 0,
      icon: Layers,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Total Lifetime Orders',
      value: stats?.totalOrders ?? 0,
      icon: TrendingUp,
      color: 'text-gray-700',
      bg: 'bg-gray-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Canteen Operations Overview
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Realtime monitoring of live kitchen tickets, counter queues, and sales revenue.
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-gray-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Open Live Kitchen Screen</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-2xl font-black text-gray-900 tracking-tight block">
                  {stat.value}
                </span>
                {stat.subtitle && (
                  <span className="text-[10px] text-gray-400 block mt-0.5">{stat.subtitle}</span>
                )}
                {stat.badge && (
                  <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {stat.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Live Incoming Orders + Top Selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Kitchen Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h2 className="font-bold text-base text-gray-900">Recent Kitchen Orders</h2>
              <span className="text-xs text-gray-400">Auto-refreshing every 8s</span>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>Manage All Orders</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-2.5 px-3">Token #</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-3 font-mono font-bold text-gray-900">
                      <Link to={`/admin/orders/${ord.id}`} className="hover:text-amber-600 underline">
                        {ord.order_number}
                      </Link>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-800">
                      {ord.profile?.full_name || 'Student'}
                    </td>
                    <td className="py-3 px-3 text-gray-600 max-w-[180px] truncate">
                      {ord.items?.map((i) => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')}
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-900">
                      ₹{ord.total_amount.toFixed(0)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={ord.order_status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      {ord.order_status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Confirmed')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] shadow-xs"
                        >
                          Confirm
                        </button>
                      )}
                      {ord.order_status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Preparing')}
                          className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-[11px] shadow-xs"
                        >
                          Start Cooking
                        </button>
                      )}
                      {ord.order_status === 'Preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Ready for Pickup')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs"
                        >
                          Mark Ready
                        </button>
                      )}
                      {ord.order_status === 'Ready for Pickup' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Completed')}
                          className="px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white rounded-lg font-bold text-[11px] shadow-xs"
                        >
                          Hand Over
                        </button>
                      )}
                      {(ord.order_status === 'Completed' || ord.order_status === 'Cancelled') && (
                        <span className="text-gray-400 text-[11px]">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Popular Items Ranking */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-base text-gray-900">Popular Dishes</h2>
            <span className="text-xs text-gray-400">By quantity sold</span>
          </div>

          <div className="space-y-3">
            {stats?.popularItems?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                    <span className="text-gray-400 text-[10px]">
                      Revenue: ₹{item.revenue.toFixed(0)}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-emerald-700 bg-white px-2 py-1 rounded-lg border border-gray-200">
                  {item.count} sold
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Link
              to="/admin/reports"
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition block text-center"
            >
              Export CSV & Full Sales Report →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
