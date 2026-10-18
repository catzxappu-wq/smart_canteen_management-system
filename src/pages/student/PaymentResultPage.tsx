import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Home } from 'lucide-react';

export const PaymentResultPage: React.FC = () => {
  const [params] = useSearchParams();
  const status = params.get('status') || 'success';
  const orderId = params.get('order_id');

  const isSuccess = status === 'success';

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      <div
        className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg ${
          isSuccess
            ? 'bg-emerald-100 text-emerald-600 shadow-emerald-500/20'
            : 'bg-rose-100 text-rose-600 shadow-rose-500/20'
        }`}
      >
        {isSuccess ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900">
          {isSuccess ? 'Payment Successful!' : 'Payment Unsuccessful'}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          {isSuccess
            ? 'Your transaction has been authenticated by Razorpay and your order is confirmed with the canteen kitchen.'
            : 'We were unable to complete this transaction. If amount was debited, it will be refunded within 48 hours.'}
        </p>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        {orderId ? (
          <Link
            to={`/track-order/${orderId}`}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to="/student/orders"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        <Link
          to="/"
          className="w-full py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};
