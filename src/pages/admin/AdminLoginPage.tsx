import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UtensilsCrossed, ShieldAlert, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter administrator email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login(email, password, 'admin');
    setIsSubmitting(false);

    if (res.success) {
      success('Admin Access Granted', 'Logged into Canteen Administration.');
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || 'Access denied: You do not have administrator permissions.');
      toastError('Login Failed', res.error || 'Invalid administrator credentials.');
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@campus.edu');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-white">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-gray-950 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 font-bold">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Canteen Administration
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Authorized kitchen managers & canteen administrators only.
          </p>
        </div>

        {/* Demo Fast-Fill Pill */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-400" />
              Demo Admin Credentials
            </span>
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="text-xs font-bold text-amber-400 hover:text-amber-200 underline"
            >
              Click to Auto-fill
            </button>
          </div>
          <p className="text-[11px] text-amber-200/80 font-mono">
            admin@campus.edu • pass: admin123
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@campus.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-gray-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-gray-800 pt-4 text-center">
          <Link
            to="/login"
            className="text-xs text-gray-400 hover:text-emerald-400 transition"
          >
            ← Return to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};
