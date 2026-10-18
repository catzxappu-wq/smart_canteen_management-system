import React from 'react';
import { OrderStatus } from '../../types';
import { Check, Clock, Flame, BellRing, PackageCheck, XCircle } from 'lucide-react';

interface OrderProgressProps {
  status: OrderStatus;
  updatedAt?: string;
}

export const OrderProgress: React.FC<OrderProgressProps> = ({ status, updatedAt }) => {
  const steps: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'Pending', label: 'Order Placed', icon: <Clock className="w-4 h-4" /> },
    { key: 'Confirmed', label: 'Confirmed', icon: <Check className="w-4 h-4" /> },
    { key: 'Preparing', label: 'Cooking', icon: <Flame className="w-4 h-4" /> },
    { key: 'Ready for Pickup', label: 'Ready for Pickup', icon: <BellRing className="w-4 h-4" /> },
    { key: 'Completed', label: 'Collected', icon: <PackageCheck className="w-4 h-4" /> },
  ];

  const isTerminalNegative = status === 'Cancelled' || status === 'Rejected';

  if (isTerminalNegative) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <XCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-rose-900">
          Order {status === 'Cancelled' ? 'Cancelled' : 'Declined by Canteen'}
        </h4>
        <p className="text-xs text-rose-700 mt-1">
          {status === 'Cancelled'
            ? 'You cancelled this order. Any online payment will be refunded to your account within 2-3 working days.'
            : 'The canteen was unable to fulfill this order due to kitchen load or item unavailability.'}
        </p>
      </div>
    );
  }

  const statusOrder: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready for Pickup',
    'Completed',
  ];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-bold text-gray-900 text-base">Live Order Progress</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Realtime updates directly from the campus kitchen
          </p>
        </div>
        {status === 'Ready for Pickup' && (
          <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-full animate-bounce shadow-md">
            🔔 Please collect your tray!
          </span>
        )}
      </div>

      <div className="relative">
        {/* Progress Bar Line */}
        <div className="absolute top-5 left-4 right-4 h-1 bg-gray-100 -z-0">
          <div
            className="h-full bg-emerald-600 transition-all duration-700 ease-out"
            style={{
              width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between items-start relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;

            return (
              <div key={step.key} className="flex flex-col items-center text-center max-w-[80px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isCurrent
                      ? 'text-emerald-700 font-bold'
                      : isCompleted
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
