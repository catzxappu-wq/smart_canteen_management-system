import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UtensilsCrossed, Mail, Lock, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/student/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your campus email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login(email, password, 'student');
    setIsSubmitting(false);

    if (res.success) {
      success('Welcome Back!', 'Logged into student portal.');
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || 'Invalid credentials.');
      toastError('Login Failed', res.error || 'Check email or password.');
    }
  };

  const handleQuickFillStudent = () => {
    setEmail('student@campus.edu');
    setPassword('student123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 mb-4">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Student Login
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Sign in to track orders, manage payments, and browse fresh food.
          </p>
        </div>

        {/* Demo Fast-Fill Pill */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              Demo Student Account
            </span>
            <button
              type="button"
              onClick={handleQuickFillStudent}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
            >
              Click to Auto-fill
            </button>
          </div>
          <p className="text-[11px] text-emerald-800 font-mono">
            student@campus.edu • pass: student123
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Campus Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-emerald-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-gray-100 pt-6 flex flex-col gap-3 text-center text-xs text-gray-500">
          <p>
            Don't have a student account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:underline">
              Register now
            </Link>
          </p>
          <div className="pt-2">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-amber-700 font-semibold transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Are you a canteen administrator? Log in here →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
