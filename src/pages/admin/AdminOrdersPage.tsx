import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentBadge } from '../../components/common/PaymentBadge';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Flame,
  BellRing,
  RotateCw,
  ExternalLink,
  Banknote,
  Eye,
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { success, error: toastError } = useToast();

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllOrders({
        search,
        status: statusFilter,
        paymentMethod: methodFilter,
        date: dateFilter,
      });
      setOrders(data);
    } catch (e: any) {
      toastError('Failed to load orders', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, methodFilter, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      success('Order Updated', `Status changed to ${newStatus}`);
      loadOrders();
    } catch (e: any) {
      toastError('Update Failed', e.message);
    }
  };

  const handleRecordCashPaid = async (orderId: string) => {
    try {
      await api.updatePaymentStatus(orderId, 'paid');
      success('Cash Recorded', 'Payment status marked as paid.');
      loadOrders();
    } catch (e: any) {
      toastError('Update Failed', e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Kitchen & Counter Orders
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Accept orders, progress cooking stages, and verify cash payments.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs self-start sm:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5 text-gray-500" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search token #, student name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:outline-none"
            >
              <option value="all">All Methods</option>
              <option value="online_razorpay">Razorpay Online</option>
              <option value="cash_at_counter">Cash at Counter</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:outline-none"
            />
          </div>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Order Token</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Dishes</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {orders.map((order) => {
                  const needsCashCollection =
                    order.payment_method === 'cash_at_counter' && order.payment_status === 'pending';

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition">
                      {/* Order Number */}
                      <td className="py-4 px-4 font-mono font-bold text-gray-900">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="hover:text-amber-600 underline font-black"
                        >
                          {order.order_number}
                        </Link>
                        <span className="text-[10px] text-gray-400 block font-sans">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900 block">
                          {order.profile?.full_name || 'Student User'}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {order.profile?.phone || order.profile?.email}
                        </span>
                      </td>

                      {/* Dishes summary */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <div className="font-medium text-gray-800 line-clamp-2">
                          {order.items?.map((item, idx) => (
                            <span key={item.id}>
                              <strong>{item.quantity}x</strong> {item.item_name_snapshot}
                              {idx < (order.items?.length || 0) - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                        {order.notes && (
                          <span className="text-[10px] text-amber-700 italic block mt-0.5">
                            Note: {order.notes}
                          </span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 font-black text-gray-900 text-sm">
                        ₹{order.total_amount.toFixed(2)}
                      </td>

                      {/* Payment Status & Method */}
                      <td className="py-4 px-4">
                        <PaymentBadge status={order.payment_status} method={order.payment_method} size="sm" />
                        {needsCashCollection && (
                          <button
                            onClick={() => handleRecordCashPaid(order.id)}
                            className="mt-1.5 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center gap-1 shadow-xs"
                          >
                            <Banknote className="w-3 h-3" />
                            <span>Mark Cash Received</span>
                          </button>
                        )}
                      </td>

                      {/* Order Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={order.order_status} size="sm" />
                      </td>

                      {/* Action Progression Buttons */}
                      <td className="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                        {order.order_status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'Confirmed')}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] shadow-xs"
                            >
                              Accept Order
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'Rejected')}
                              className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-[11px]"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {order.order_status === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'Preparing')}
                            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-[11px] shadow-xs flex items-center gap-1 inline-flex"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Start Cooking</span>
                          </button>
                        )}

                        {order.order_status === 'Preparing' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'Ready for Pickup')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs flex items-center gap-1 inline-flex"
                          >
                            <BellRing className="w-3.5 h-3.5" />
                            <span>Ready for Counter</span>
                          </button>
                        )}

                        {order.order_status === 'Ready for Pickup' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'Completed')}
                            className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded-lg font-bold text-[11px] shadow-xs flex items-center gap-1 inline-flex"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Mark Collected</span>
                          </button>
                        )}

                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg inline-block align-middle ml-1"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-gray-500">
            No orders found matching the filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
