import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CanteenSettings } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  Settings,
  Save,
  Power,
  Banknote,
  Percent,
  Clock,
  Phone,
  Mail,
  Bell,
  UtensilsCrossed,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<CanteenSettings | null>(null);
  const [canteenName, setCanteenName] = useState('');
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('20:30');
  const [isOpen, setIsOpen] = useState(true);
  const [cashEnabled, setCashEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState<number>(5.0);
  const [supportPhone, setSupportPhone] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [banner, setBanner] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    api.getSettings().then((s) => {
      setSettings(s);
      setCanteenName(s.canteen_name);
      setOpeningTime(s.opening_time);
      setClosingTime(s.closing_time);
      setIsOpen(s.is_canteen_open);
      setCashEnabled(s.cash_on_counter_enabled);
      setTaxRate(s.tax_rate_percent);
      setSupportPhone(s.support_phone);
      setSupportEmail(s.support_email);
      setBanner(s.announcement_banner);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const updated = await api.updateSettings({
        id: settings.id,
        canteen_name: canteenName.trim(),
        opening_time: openingTime,
        closing_time: closingTime,
        is_canteen_open: isOpen,
        cash_on_counter_enabled: cashEnabled,
        tax_rate_percent: Number(taxRate),
        support_phone: supportPhone.trim(),
        support_email: supportEmail.trim(),
        announcement_banner: banner.trim(),
      });
      setSettings(updated);
      success('Settings Saved', 'Canteen configurations updated successfully.');
    } catch (e: any) {
      toastError('Save Failed', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Canteen Operations & System Settings
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Configure operating hours, cash policy, tax computation, and campus banner notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Switches Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <Power className="w-5 h-5 text-amber-600" />
            <span>Master Ordering Controls</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Open/Close Master */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between ${
                isOpen
                  ? 'border-emerald-600 bg-emerald-50/50'
                  : 'border-rose-300 bg-rose-50/50'
              }`}
            >
              <div>
                <span className="font-bold text-sm text-gray-900 block">
                  Canteen Kitchen Status
                </span>
                <span className="text-xs text-gray-500 mt-1 block">
                  {isOpen
                    ? 'Accepting live student meal orders.'
                    : 'Ordering disabled. Students see closed notice.'}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                  isOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {isOpen ? 'Open' : 'Closed'}
              </span>
            </div>

            {/* Cash at counter toggle */}
            <div
              onClick={() => setCashEnabled(!cashEnabled)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between ${
                cashEnabled
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div>
                <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-blue-700" />
                  <span>Cash on Counter</span>
                </span>
                <span className="text-xs text-gray-500 mt-1 block">
                  {cashEnabled
                    ? 'Students can choose to pay cash at pickup.'
                    : 'Only online Razorpay payments permitted.'}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                  cashEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {cashEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Operating Hours and Tax */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Operating Schedule & Tax Calculation</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Opening Time
              </label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Closing Time
              </label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Tax / GST Rate (%)
              </label>
              <div className="relative">
                <Percent className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  max="28"
                  step="0.5"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Campus Information & Announcement Banner */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <span>Campus Identity & Announcement Banner</span>
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Canteen Display Name
            </label>
            <input
              type="text"
              required
              value={canteenName}
              onChange={(e) => setCanteenName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Support Helpline Phone
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Announcement Banner (Visible to all students across site)
            </label>
            <input
              type="text"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="e.g. Special festive lunch served today! Combo offers available."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-gray-950 font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Configurations...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
