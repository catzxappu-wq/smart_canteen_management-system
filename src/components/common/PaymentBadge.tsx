import React from 'react';
import { PaymentStatus, PaymentMethod } from '../../types';
import { Check, Clock, AlertTriangle, CreditCard, Banknote } from 'lucide-react';

interface PaymentBadgeProps {
  status: PaymentStatus;
  method?: PaymentMethod;
  size?: 'sm' | 'md';
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({ status, method, size = 'md' }) => {
  const configs: Record<
    PaymentStatus,
    { bg: string; text: string; icon: React.ReactNode; label: string }
  > = {
    paid: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      text: 'text-emerald-800',
      icon: <Check className="w-3 h-3 text-emerald-700" />,
      label: 'Paid',
    },
    pending: {
      bg: 'bg-amber-100 text-amber-800 border-amber-200',
      text: 'text-amber-800',
      icon: <Clock className="w-3 h-3 text-amber-700" />,
      label: method === 'cash_at_counter' ? 'Pay at Counter' : 'Payment Pending',
    },
    failed: {
      bg: 'bg-rose-100 text-rose-800 border-rose-200',
      text: 'text-rose-800',
      icon: <AlertTriangle className="w-3 h-3 text-rose-700" />,
      label: 'Payment Failed',
    },
    refunded: {
      bg: 'bg-purple-100 text-purple-800 border-purple-200',
      text: 'text-purple-800',
      icon: <Clock className="w-3 h-3 text-purple-700" />,
      label: 'Refunded',
    },
  };

  const current = configs[status] || configs.pending;

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center rounded-md border font-medium ${
          size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs'
        } ${current.bg}`}
      >
        {current.icon}
        <span className="ml-1">{current.label}</span>
      </span>

      {method && (
        <span className="inline-flex items-center text-xs text-gray-500 gap-1">
          {method === 'online_razorpay' ? (
            <>
              <CreditCard className="w-3 h-3" />
              <span>Razorpay</span>
            </>
          ) : (
            <>
              <Banknote className="w-3 h-3" />
              <span>Cash</span>
            </>
          )}
        </span>
      )}
    </div>
  );
};
