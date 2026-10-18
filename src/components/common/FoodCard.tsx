import React from 'react';
import { FoodItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Minus, Clock, Flame, Eye } from 'lucide-react';

interface FoodCardProps {
  item: FoodItem;
  onQuickView?: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onQuickView }) => {
  const { items, addItem, updateQuantity } = useCart();
  const { success } = useToast();

  const cartEntry = items.find((i) => i.foodItem.id === item.id);
  const qtyInCart = cartEntry ? cartEntry.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.is_available) return;
    addItem(item, 1);
    success('Added to Tray', `${item.name} added to your cart.`);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, qtyInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, qtyInCart - 1);
  };

  return (
    <div
      onClick={() => onQuickView && onQuickView(item)}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1"
    >
      {/* Food Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !item.is_available ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Veg/Non-veg marker */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-1 rounded-md shadow-xs flex items-center justify-center">
          <span
            className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${
              item.is_veg ? 'border-emerald-600' : 'border-rose-600'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                item.is_veg ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </span>
        </div>

        {/* Badges: Popular / Out of Stock */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {item.is_popular && item.is_available && (
            <span className="bg-amber-500 text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
              Popular
            </span>
          )}
          {!item.is_available && (
            <span className="bg-rose-600 text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick view hover button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" />
              {item.preparation_time}m prep
            </span>
            {item.calories && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" />
                  {item.calories} kcal
                </span>
              </>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition line-clamp-1">
            {item.name}
          </h3>

          <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Cart Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block -mb-0.5">Price</span>
            <span className="text-lg font-bold text-gray-900">
              ₹{item.price.toFixed(0)}
            </span>
          </div>

          {item.is_available ? (
            qtyInCart > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-emerald-50 border border-emerald-300 rounded-xl p-1 gap-2 shadow-xs"
              >
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white transition shadow-xs"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-emerald-900 min-w-[1.2rem] text-center">
                  {qtyInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            )
          ) : (
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
