import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { FoodItem, Category } from '../../types';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodModal } from '../../components/common/FoodModal';
import { useCart } from '../../context/CartContext';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ShoppingBag,
  Leaf,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState<Category[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [vegOnly, setVegOnly] = useState(false);
  const [popularOnly, setPopularOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewItem, setQuickViewItem] = useState<FoodItem | null>(null);

  const { itemCount, totalAmount } = useCart();

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [cats, items] = await Promise.all([
          api.getCategories(),
          api.getFoodItems(),
        ]);
        setCategories(cats);
        setFoodItems(items);
      } catch (err) {
        console.error('Error loading menu', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSearchParams(catId === 'all' ? {} : { category: catId });
  };

  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      // Category check
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }
      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      // Veg filter
      if (vegOnly && !item.is_veg) {
        return false;
      }
      // Popular filter
      if (popularOnly && !item.is_popular) {
        return false;
      }
      return true;
    });
  }, [foodItems, selectedCategory, searchQuery, vegOnly, popularOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setVegOnly(false);
    setPopularOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Fresh Canteen Menu
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            Campus Daily Menu
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Choose from freshly prepared breakfast, traditional thalis, and quick snacks.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search dosa, thali, coffee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories & Filter Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Items ({foodItems.length})
          </button>
          {categories.map((cat) => {
            const count = foodItems.filter((i) => i.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-xs ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Dietary and Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                vegOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Leaf className={`w-3.5 h-3.5 ${vegOnly ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span>Pure Veg Only</span>
            </button>

            <button
              onClick={() => setPopularOnly(!popularOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                popularOnly
                  ? 'bg-amber-50 border-amber-500 text-amber-800'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${popularOnly ? 'text-amber-500' : 'text-gray-400'}`} />
              <span>Popular Sellers</span>
            </button>

            {(vegOnly || popularOnly || searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          <span className="text-xs text-gray-500">
            Showing <strong className="text-gray-800">{filteredItems.length}</strong> items
          </span>
        </div>
      </div>

      {/* Food Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse">
              <div className="bg-gray-200 rounded-xl aspect-video w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="pt-2 flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-8 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onQuickView={(i) => setQuickViewItem(i)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Food Items Found</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            We couldn't find any items matching your selected criteria. Try adjusting your search term or clearing active filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Floating Tray Sticky Banner if cart has items */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-30 max-w-lg mx-auto animate-bounce-subtle">
          <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-2xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in Tray
                </span>
                <span className="text-base font-bold text-white">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/cart"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
            >
              <span>View Tray</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <FoodModal item={quickViewItem} onClose={() => setQuickViewItem(null)} />
    </div>
  );
};
