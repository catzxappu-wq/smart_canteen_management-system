import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import { Order } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentBadge } from '../../components/common/PaymentBadge';
import {
  CheckCircle2,
  Clock,
  Printer,
  ArrowRight,
  QrCode,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getOrderById(id).then((ord) => {
        setOrder(ord);
        setIsLoading(false);

        // Fire celebratory confetti on mount
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#22c55e', '#86efac', '#eab308'],
        });
      });
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500 mt-3">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <Link to="/menu" className="text-emerald-600 font-semibold text-sm">
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 print:p-0 print:max-w-none">
      {/* Success Banner */}
      <div className="bg-emerald-600 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl print:hidden">
        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto text-white">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Thank you, {order.profile?.full_name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Your order has been transmitted directly to the campus central kitchen.
          </p>
        </div>
      </div>

      {/* Main Order Receipt Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none">
        {/* Header with Order Number & QR Code */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
              <span className="font-extrabold text-base text-gray-900">
                Campus Hub Smart Canteen
              </span>
            </div>
            <span className="text-xs text-gray-400 block font-medium">Unique Order Token</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight font-mono">
              {order.order_number}
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge status={order.order_status} size="sm" />
              <PaymentBadge status={order.payment_status} method={order.payment_method} size="sm" />
            </div>
          </div>

          {/* Safe Pickup QR Code */}
          <div className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 border border-gray-100 self-start sm:self-auto">
            <QRCodeSVG
              value={`SMARTCANTEEN:${order.order_number}:${order.pickup_token}`}
              size={96}
              level="H"
              className="rounded-lg"
            />
            <span className="text-[10px] font-mono text-gray-500 mt-1.5 font-semibold">
              Scan at Counter
            </span>
          </div>
        </div>

        {/* Pickup Instructions */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-950">
          <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-sm">Pickup Instructions:</strong>
            <p className="mt-0.5 leading-relaxed">
              Please wait until your order status updates to <strong>'Ready for Pickup'</strong>. Then proceed to <strong>Express Counter #1</strong> and present this QR code or token <strong>{order.order_number}</strong> to claim your tray.
            </p>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider text-xs">
            Items Ordered
          </h3>
          <div className="divide-y divide-gray-100">
            {order.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-gray-900">{item.item_name_snapshot}</span>
                  <span className="text-xs text-gray-500 block">
                    {item.quantity} x ₹{item.unit_price}
                  </span>
                </div>
                <span className="font-bold text-gray-900">₹{item.line_total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="border-t border-gray-200 pt-4 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (GST)</span>
            <span>₹{order.tax_amount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-bold text-gray-900">
            <span>Total Amount</span>
            <span className="text-xl font-black text-emerald-700">₹{order.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {order.notes && (
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <strong>Notes for kitchen:</strong> {order.notes}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
        <Link
          to={`/track-order/${order.id}`}
          className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <Clock className="w-4 h-4" />
          <span>Track Live Order Status</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm transition flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <Link
          to="/menu"
          className="w-full sm:w-auto py-3.5 px-5 text-gray-500 hover:text-gray-800 font-semibold text-sm transition text-center"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
};
