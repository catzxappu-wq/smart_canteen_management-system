import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { razorpayService } from '../../services/razorpay';
import { PaymentMethod, CanteenSettings } from '../../types';
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  FileText,
  User,
  ShoppingBag,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, taxAmount, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error: toastError, warning } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online_razorpay');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<CanteenSettings | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
    api.getSettings().then(setSettings);
  }, [items.length, navigate]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Please log in to checkout</h2>
        <Link to="/login" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl inline-block">
          Log In
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!settings?.is_canteen_open) {
      toastError('Canteen Closed', 'The canteen is currently not accepting orders.');
      return;
    }

    if (paymentMethod === 'cash_at_counter' && !settings.cash_on_counter_enabled) {
      toastError('Payment Method Disabled', 'Cash on counter is currently disabled by administrator.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order through trusted backend / state calculation
      const order = await api.createOrder(
        {
          payment_method: paymentMethod,
          notes: notes.trim(),
          items: items.map((i) => ({
            food_item_id: i.foodItem.id,
            quantity: i.quantity,
          })),
        },
        user
      );

      // 2. If online payment selected, trigger Razorpay workflow
      if (paymentMethod === 'online_razorpay') {
        await razorpayService.processPayment(
          order,
          (result) => {
            setIsSubmitting(false);
            if (result.success) {
              clearCart();
              success(
                'Payment Verified!',
                `Order ${order.order_number} confirmed. Cooking will begin shortly.`
              );
              navigate(`/order-confirmation/${order.id}`);
            } else {
              toastError('Payment Incomplete', result.error || 'Payment failed.');
              navigate(`/track-order/${order.id}`);
            }
          },
          () => {
            // Dismissed callback
            setIsSubmitting(false);
            warning('Payment Pending', `Order ${order.order_number} created as pending payment.`);
            navigate(`/track-order/${order.id}`);
          }
        );
      } else {
        // Cash at Counter workflow
        clearCart();
        setIsSubmitting(false);
        success(
          'Order Placed!',
          `Order ${order.order_number} placed. Please pay cash at the canteen counter.`
        );
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      toastError('Order Creation Failed', err.message || 'Please check menu availability.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          Final Step
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
          Express Checkout
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review your items and choose your preferred payment option.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Student Profile Verification */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Student Details for Pickup</span>
            </h3>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Name:</span>
                <span className="font-bold text-gray-800 text-sm">{user.full_name}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Email:</span>
                <span className="font-mono text-gray-800">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Phone:</span>
                <span className="text-gray-800">{user.phone || '+91 98765 43210'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Pickup Spot:</span>
                <span className="font-semibold text-emerald-700">Express Counter #1</span>
              </div>
            </div>
          </div>

          {/* Kitchen / Chef Notes */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Special Preparation Notes (Optional)</span>
            </h3>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Less spicy, extra coconut chutney, sugar separate..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Choose Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* Razorpay Online */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'online_razorpay'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online_razorpay"
                  checked={paymentMethod === 'online_razorpay'}
                  onChange={() => setPaymentMethod('online_razorpay')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">
                      Razorpay Online Payment
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay instantly via UPI (Google Pay, PhonePe, Paytm), NetBanking, or Credit/Debit Cards.
                  </p>
                </div>
              </label>

              {/* Cash at Counter */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition ${
                  !settings?.cash_on_counter_enabled
                    ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                    : paymentMethod === 'cash_at_counter'
                    ? 'border-emerald-600 bg-emerald-50/50 cursor-pointer'
                    : 'border-gray-200 hover:border-gray-300 bg-white cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_at_counter"
                  disabled={!settings?.cash_on_counter_enabled}
                  checked={paymentMethod === 'cash_at_counter'}
                  onChange={() => setPaymentMethod('cash_at_counter')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-gray-600" />
                      <span>Cash at Counter</span>
                    </span>
                    {!settings?.cash_on_counter_enabled && (
                      <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Disabled by Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay cash in Indian Rupees directly at the canteen counter when collecting your meal tray.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h2 className="font-bold text-lg text-gray-900 border-b pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span>Order Summary ({items.length} items)</span>
          </h2>

          {/* Items breakdown */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.foodItem.id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {item.quantity}x
                  </span>
                  <span className="font-medium text-gray-800 line-clamp-1">
                    {item.foodItem.name}
                  </span>
                </div>
                <span className="font-bold text-gray-900">
                  ₹{(item.foodItem.price * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Canteen GST</span>
              <span className="font-semibold text-gray-900">₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
              <span className="font-bold text-base text-gray-900">Total Amount</span>
              <span className="text-2xl font-black text-emerald-700">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Order...</span>
              </span>
            ) : (
              <>
                <span>
                  {paymentMethod === 'online_razorpay'
                    ? `Pay ₹${totalAmount.toFixed(2)} via Razorpay`
                    : 'Place Order (Cash at Counter)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official college dining order with digital pickup verification</span>
          </div>
        </div>
      </form>
    </div>
  );
};
