import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../services/api';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentBadge } from '../../components/common/PaymentBadge';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Printer,
  User,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle,
  Banknote,
  UtensilsCrossed,
} from 'lucide-react';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const loadOrder = async () => {
    if (!id) return;
    try {
      const data = await api.getOrderById(id);
      setOrder(data);
    } catch (e: any) {
      toastError('Failed to load order', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    try {
      const updated = await api.updateOrderStatus(order.id, newStatus);
      setOrder(updated);
      success('Status Updated', `Order status changed to ${newStatus}`);
    } catch (e: any) {
      toastError('Update Failed', e.message);
    }
  };

  const handlePaymentChange = async (newPayment: PaymentStatus) => {
    if (!order) return;
    try {
      const updated = await api.updatePaymentStatus(order.id, newPayment);
      setOrder(updated);
      success('Payment Updated', `Payment marked as ${newPayment}`);
    } catch (e: any) {
      toastError('Update Failed', e.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading order ticket...</div>;
  }

  if (!order) {
    return (
      <div className="p-8 text-center space-y-3">
        <h3 className="font-bold">Order Not Found</h3>
        <Link to="/admin/orders" className="text-amber-600 font-bold text-xs">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 print:p-0 print:max-w-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs text-gray-400 font-mono font-bold">KITCHEN ORDER TICKET</span>
            <h1 className="text-2xl font-black text-gray-900 font-mono">{order.order_number}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print KOT Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none">
        {/* Ticket Header */}
        <div className="flex justify-between items-start pb-6 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-amber-600 font-mono block">CAMPUS SMART CANTEEN</span>
            <h2 className="text-2xl font-black font-mono text-gray-900">{order.order_number}</h2>
            <p className="text-xs text-gray-400 mt-1">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50 border border-gray-100">
            <QRCodeSVG
              value={`SMARTCANTEEN:${order.order_number}:${order.pickup_token}`}
              size={80}
              level="H"
            />
            <span className="text-[9px] font-mono font-bold text-gray-500 mt-1">Token Verified</span>
          </div>
        </div>

        {/* Student & Payment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 font-semibold uppercase tracking-wider block">Customer Details</span>
            <span className="font-bold text-gray-900 text-sm block">{order.profile?.full_name || 'Student'}</span>
            <span className="text-gray-600 block">{order.profile?.email}</span>
            <span className="text-gray-600 block">{order.profile?.phone || 'No phone provided'}</span>
          </div>

          <div className="space-y-2">
            <span className="text-gray-400 font-semibold uppercase tracking-wider block">Status & Payment</span>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={order.order_status} />
              <PaymentBadge status={order.payment_status} method={order.payment_method} />
            </div>

            {/* Quick Change Controls for Admin */}
            <div className="pt-2 flex flex-wrap gap-2 print:hidden">
              <select
                value={order.order_status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className="px-2.5 py-1 rounded-lg border text-xs font-bold bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rejected">Rejected</option>
              </select>

              {order.payment_status === 'pending' && (
                <button
                  onClick={() => handlePaymentChange('paid')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
            Cook Items Breakdown
          </h3>
          <div className="divide-y divide-gray-100">
            {order.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-gray-900 text-base">
                    {item.quantity}x {item.item_name_snapshot}
                  </span>
                  <span className="text-xs text-gray-400 block font-mono">
                    ₹{item.unit_price} each
                  </span>
                </div>
                <span className="font-bold text-gray-900">₹{item.line_total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {order.notes && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900">
            <strong>Kitchen Instructions:</strong> {order.notes}
          </div>
        )}

        {/* Totals */}
        <div className="border-t border-gray-100 pt-4 space-y-1.5 text-xs text-right">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Taxes</span>
            <span>₹{order.tax_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t">
            <span>Total Payable</span>
            <span className="text-xl font-black text-emerald-700">₹{order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
