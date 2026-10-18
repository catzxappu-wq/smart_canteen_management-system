import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FoodItem, Category } from '../../types';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Check,
  X,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminFoodItemsPage: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<FoodItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(50);
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [prepTime, setPrepTime] = useState<number>(10);
  const [calories, setCalories] = useState<number>(300);
  const [isVeg, setIsVeg] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { success, error: toastError } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allCats, allItems] = await Promise.all([
        api.getCategories(),
        api.getFoodItems(),
      ]);
      setCategories(allCats);
      setItems(allItems);
      if (allCats.length > 0 && !categoryId) {
        setCategoryId(allCats[0].id);
      }
    } catch (e: any) {
      toastError('Error', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice(60);
    setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setIsAvailable(true);
    setPrepTime(10);
    setCalories(350);
    setIsVeg(true);
    setIsPopular(false);
    if (categories.length > 0) setCategoryId(categories[0].id);
    setIsModalOpen(true);
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategoryId(item.category_id);
    setDescription(item.description);
    setPrice(item.price);
    setImageUrl(item.image_url);
    setIsAvailable(item.is_available);
    setPrepTime(item.preparation_time);
    setCalories(item.calories || 300);
    setIsVeg(item.is_veg);
    setIsPopular(item.is_popular);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await api.uploadFoodImage(file);
        setImageUrl(url);
        success('Image Uploaded', 'New food image processed successfully.');
      } catch (err: any) {
        toastError('Upload Failed', err.message);
      }
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || price < 0) {
      toastError('Validation Error', 'Please complete all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await api.updateFoodItem(editingItem.id, {
          name,
          category_id: categoryId,
          description,
          price: Number(price),
          image_url: imageUrl,
          is_available: isAvailable,
          preparation_time: Number(prepTime),
          calories: Number(calories),
          is_veg: isVeg,
          is_popular: isPopular,
        });
        success('Item Updated', `${name} updated in canteen menu.`);
      } else {
        await api.createFoodItem({
          name,
          category_id: categoryId,
          description,
          price: Number(price),
          image_url: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
          is_available: isAvailable,
          preparation_time: Number(prepTime),
          calories: Number(calories),
          is_veg: isVeg,
          is_popular: isPopular,
        });
        success('Item Created', `${name} added to canteen menu.`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (e: any) {
      toastError('Save Failed', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAvailability = async (item: FoodItem) => {
    try {
      const updated = await api.toggleFoodAvailability(item.id, !item.is_available);
      success(
        updated.is_available ? 'Item Available' : 'Item Sold Out',
        `${item.name} is now ${updated.is_available ? 'available' : 'marked sold out'}.`
      );
      loadData();
    } catch (e: any) {
      toastError('Toggle Failed', e.message);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteConfirmItem) return;
    try {
      await api.deleteFoodItem(deleteConfirmItem.id);
      success('Item Removed', `${deleteConfirmItem.name} removed from menu.`);
      setDeleteConfirmItem(null);
      loadData();
    } catch (e: any) {
      toastError('Delete Failed', e.message);
    }
  };

  const filteredItems = items.filter((item) => {
    if (categoryFilter !== 'all' && item.category_id !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Manage Food Items
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Add new dishes, set prices in INR, update photos, and toggle sold-out status.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-gray-950 font-bold text-xs sm:text-sm shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white"
          >
            <option value="all">All Categories ({items.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Food Items Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading food inventory...</div>
        ) : filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Dish Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (INR)</th>
                  <th className="py-3 px-4">Prep Time</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${
                                item.is_veg ? 'border-emerald-600' : 'border-rose-600'
                              }`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full ${
                                  item.is_veg ? 'bg-emerald-600' : 'bg-rose-600'
                                }`}
                              />
                            </span>
                            <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                            {item.is_popular && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                Popular
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {item.category?.name || categories.find((c) => c.id === item.category_id)?.name || 'General'}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-black text-gray-900 text-sm">
                      ₹{item.price.toFixed(0)}
                    </td>

                    {/* Prep Time */}
                    <td className="py-3 px-4 text-gray-500">
                      {item.preparation_time} mins
                    </td>

                    {/* Availability Switch */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                          item.is_available
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.is_available ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                        <span>{item.is_available ? 'Available' : 'Sold Out'}</span>
                      </button>
                    </td>

                    {/* Edit & Delete actions */}
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-gray-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                        title="Edit dish details"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-gray-500">
            No food items match the search filter.
          </div>
        )}
      </div>

      {/* Add / Edit Food Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-gray-900">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Masala Dosa"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Crispy crepe served with coconut chutney & sambar..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              {/* Image Input and Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Food Photo
                </label>
                <div className="flex items-center gap-3">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border"
                    />
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Paste Image URL or select file below"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg cursor-pointer border border-amber-200 font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Prep Time (Mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={prepTime}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border text-sm"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium border-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Mark as Popular / Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Item is in Stock</span>
                </label>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-xs shadow-xs"
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Food Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteConfirmItem)}
        title="Delete Food Item?"
        message={`Are you sure you want to permanently remove "${deleteConfirmItem?.name}" from the canteen menu?`}
        confirmLabel="Delete Food"
        isDestructive={true}
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteConfirmItem(null)}
      />
    </div>
  );
};
