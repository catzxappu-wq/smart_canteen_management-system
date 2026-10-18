import React from 'react';
import { OrderStatus } from '../../types';
import { Clock, CheckCircle2, Flame, BellRing, PackageCheck, XCircle, Ban } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<
    OrderStatus,
    { bg: string; text: string; border: string; icon: React.ReactNode; label: string }
  > = {
    Pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />,
      label: 'Pending',
    },
    Confirmed: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />,
      label: 'Confirmed',
    },
    Preparing: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: <Flame className="w-3.5 h-3.5 text-orange-600 animate-bounce" />,
      label: 'Preparing',
    },
    'Ready for Pickup': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: <BellRing className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />,
      label: 'Ready for Pickup',
    },
    Completed: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: <PackageCheck className="w-3.5 h-3.5 text-green-600" />,
      label: 'Completed',
    },
    Cancelled: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
      icon: <XCircle className="w-3.5 h-3.5 text-gray-500" />,
      label: 'Cancelled',
    },
    Rejected: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: <Ban className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Rejected',
    },
  };

  const config = configs[status] || configs.Pending;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
