import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, ShieldCheck, CheckCircle2, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateProfile({ full_name: fullName, phone });
    setIsSaving(false);

    if (res.success) {
      success('Profile Updated', 'Your profile details have been saved.');
    } else {
      toastError('Update Failed', res.error || 'Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Student Profile
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Manage your verified college account and contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Digital Student Canteen ID Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-emerald-800 to-green-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-700/50 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block">
                  Campus Food Pass
                </span>
                <span className="font-bold text-lg text-white">Smart Canteen</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-sm">
                🎓
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-medium">
                  Student Name
                </span>
                <span className="font-extrabold text-xl text-white block">
                  {user.full_name}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-medium">
                  College Email
                </span>
                <span className="font-mono text-xs text-emerald-100 block truncate">
                  {user.email}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs border-t border-emerald-700/60">
                <div>
                  <span className="text-[9px] text-emerald-300 uppercase block">Account Role</span>
                  <span className="font-semibold text-emerald-200 capitalize">{user.role}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-emerald-300 uppercase block">Status</span>
                  <span className="font-bold text-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Verified Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Student Portal</span>
          </button>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
          <h3 className="font-bold text-lg text-gray-900 mb-1">Account Information</h3>
          <p className="text-xs text-gray-500 mb-6">
            Keep your contact details up to date for order pickup alerts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                College Email (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 text-sm cursor-not-allowed font-mono"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                College email is locked to verify student identity.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
