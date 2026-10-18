import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { OrderProgress } from '../../components/common/OrderProgress';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentBadge } from '../../components/common/PaymentBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  Printer,
  ArrowLeft,
  XCircle,
  BellRing,
  MapPin,
  UtensilsCrossed,
  CheckCircle,
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { success, error: toastError, info } = useToast();
  const { user } = useAuth();

  const loadOrder = async () => {
    if (!id) return;
    try {
      const data = await api.getOrderById(id);
      setOrder(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();

    // Setup Supabase Realtime subscription if available
    let channel: any = null;
    if (isSupabaseConfigured && id) {
      channel = supabase
        .channel(`order-tracking-${id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${id}`,
          },
          (payload) => {
            const updated = payload.new as Order;
            setOrder((prev) => (prev ? { ...prev, ...updated } : null));
            if (updated.order_status === 'Ready for Pickup') {
              info('Food Ready!', 'Your meal tray is waiting at Express Counter #1.');
            }
          }
        )
        .subscribe();
    }

    // Polling fallback every 6 seconds to ensure live updates
    const interval = setInterval(() => {
      loadOrder();
    }, 6000);

    return () => {
      clearInterval(interval);
      if (channel) supabase.removeChannel(channel);
    };
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order || !user) return;
    setIsCancelling(true);
    try {
      const updated = await api.cancelOrder(order.id, user.id);
      setOrder(updated);
      setIsCancelModalOpen(false);
      success('Order Cancelled', 'Your order was successfully cancelled.');
    } catch (e: any) {
      toastError('Cancellation Failed', e.message);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500 mt-3 font-medium">Connecting to kitchen queue...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link to="/menu" className="text-emerald-600 font-bold text-sm">
          Return to Menu
        </Link>
      </div>
    );
  }

  const isPending = order.order_status === 'Pending';
  const isReady = order.order_status === 'Ready for Pickup';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top back button & heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/student/orders"
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-600"
            aria-label="Back to order history"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Live Kitchen Queue
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 font-mono">
              {order.order_number}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={order.order_status} size="lg" />
          <PaymentBadge status={order.payment_status} method={order.payment_method} />
        </div>
      </div>

      {/* Ready for Pickup Attention Callout */}
      {isReady && (
        <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-subtle">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <BellRing className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl">Your Meal Tray is Hot & Ready!</h3>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                Head to Express Counter #1. Present your QR code to receive your food.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Stepper */}
      <OrderProgress status={order.order_status} updatedAt={order.updated_at} />

      {/* Main Grid: QR Code & Detailed Receipt */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: QR Pickup Card */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs text-center space-y-4">
          <h3 className="font-bold text-base text-gray-900">Digital Pickup Token</h3>
          <p className="text-xs text-gray-500">
            Show this verification code to the counter attendant when collecting.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center">
            <QRCodeSVG
              value={`SMARTCANTEEN:${order.order_number}:${order.pickup_token}`}
              size={160}
              level="H"
              className="rounded-xl shadow-xs"
            />
            <span className="font-mono font-bold text-sm text-gray-800 mt-3">
              {order.order_number}
            </span>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3 text-left text-xs text-emerald-900 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Counter #1 • Main Dining Hall, Ground Floor</span>
          </div>

          {/* Cancel button if pending */}
          {isPending && (
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Order</span>
              </button>
              <span className="text-[10px] text-gray-400 block mt-1">
                Orders can only be cancelled while in 'Pending' status.
              </span>
            </div>
          )}
        </div>

        {/* Right: Order Summary Details */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-base text-gray-900">Order Items</h3>
            <span className="text-xs text-gray-400">
              Placed {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
            {order.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-gray-900">{item.item_name_snapshot}</span>
                  <span className="text-xs text-gray-500 block">
                    {item.quantity} x ₹{item.unit_price}
                  </span>
                </div>
                <span className="font-bold text-gray-900">₹{item.line_total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (GST)</span>
              <span className="font-semibold">₹{order.tax_amount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-bold text-gray-900">
              <span>Total Amount</span>
              <span className="text-xl font-black text-emerald-700">₹{order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-semibold p-2 rounded-lg border hover:bg-gray-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Order Receipt</span>
            </button>

            <Link
              to="/menu"
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Order more food →
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Cancel */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        title="Cancel This Order?"
        message="Are you sure you want to cancel your order? This will discard the kitchen token."
        confirmLabel={isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
        isDestructive={true}
        onConfirm={handleCancelOrder}
        onCancel={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};
