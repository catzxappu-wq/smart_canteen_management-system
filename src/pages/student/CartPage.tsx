import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    taxAmount,
    totalAmount,
    taxRate,
    itemCount,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Your Food Tray is Empty</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            You haven't added any delicious meals or snacks yet. Browse today's canteen menu and pick your favorites.
          </p>
        </div>
        <div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Selected Meal Items
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            Your Food Tray ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold self-start sm:self-auto hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Tray
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((cartItem) => {
            const { foodItem, quantity } = cartItem;
            const lineTotal = foodItem.price * quantity;

            return (
              <div
                key={foodItem.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={foodItem.image_url}
                    alt={foodItem.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-gray-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${
                          foodItem.is_veg ? 'border-emerald-600' : 'border-rose-600'
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            foodItem.is_veg ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                        {foodItem.name}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      ₹{foodItem.price} each
                    </span>
                    <span className="text-[11px] text-emerald-700 inline-flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> ~{foodItem.preparation_time}m prep
                    </span>
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
                    <button
                      onClick={() => updateQuantity(foodItem.id, quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-gray-700 hover:bg-gray-100 shadow-xs transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-8 text-center text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(foodItem.id, quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-base font-extrabold text-gray-900">
                      ₹{lineTotal.toFixed(0)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(foodItem.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Add more items from menu
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h2 className="font-bold text-lg text-gray-900 border-b pb-3">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tray Subtotal</span>
              <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1">
                <span>Canteen Tax ({taxRate}%)</span>
              </span>
              <span className="font-semibold text-gray-900">₹{taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Packaging & Queue Token</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
              <div>
                <span className="font-bold text-base text-gray-900 block">Total Payable</span>
                <span className="text-[11px] text-gray-400">Inclusive of all taxes</span>
              </div>
              <span className="text-2xl font-black text-emerald-700">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center gap-2.5 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted Razorpay checkout & official kitchen token generation.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
