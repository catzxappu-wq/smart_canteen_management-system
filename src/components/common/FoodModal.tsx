import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { X, Clock, Flame, Plus, Minus, ShoppingBag, Check } from 'lucide-react';

interface FoodModalProps {
  item: FoodItem | null;
  onClose: () => void;
}

export const FoodModal: React.FC<FoodModalProps> = ({ item, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { success } = useToast();

  if (!item) return null;

  const handleAddToCart = () => {
    addItem(item, quantity);
    success('Added to Cart', `${quantity}x ${item.name} added to your tray.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 transform transition-all relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Food Header Image */}
        <div className="relative aspect-video w-full bg-gray-100">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${
                  item.is_veg ? 'border-emerald-400 bg-white' : 'border-rose-400 bg-white'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.is_veg ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                {item.is_veg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
              </span>
              {item.is_popular && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Best Seller
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-sm leading-tight">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500 border-b pb-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                <Clock className="w-4 h-4 text-emerald-600" />
                {item.preparation_time} mins prep
              </span>
              {item.calories && (
                <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                  <Flame className="w-4 h-4 text-amber-500" />
                  {item.calories} Calories
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block">Unit Price</span>
              <span className="text-xl font-extrabold text-emerald-700">₹{item.price}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-900">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cooked fresh to order in the college central kitchen with hygienic standards.</span>
          </div>

          {/* Quantity and Actions */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-gray-700 hover:bg-gray-100 shadow-xs transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-base w-10 text-center text-gray-800">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!item.is_available}
              className={`flex-1 py-3 px-5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition ${
                item.is_available
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>
                {item.is_available
                  ? `Add to Tray • ₹${(item.price * quantity).toFixed(0)}`
                  : 'Currently Sold Out'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
