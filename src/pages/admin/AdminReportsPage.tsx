import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  Download,
  IndianRupee,
  Layers,
  ShoppingBag,
  TrendingUp,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { success } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [st, allOrders] = await Promise.all([
          api.getDashboardStats(),
          api.getAllOrders(),
        ]);
        setStats(st);
        setOrders(allOrders);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleExportCSV = () => {
    // Generate CSV content from verified orders
    const validOrders = orders.filter(
      (o) => o.order_status !== 'Cancelled' && o.order_status !== 'Rejected'
    );

    const headers = [
      'Order Token',
      'Date',
      'Time',
      'Student Name',
      'Student Email',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Items Summary',
      'Subtotal (INR)',
      'Tax (INR)',
      'Total Amount (INR)',
    ];

    const rows = validOrders.map((o) => {
      const dateObj = new Date(o.created_at);
      const itemsSummary = o.items
        ?.map((i) => `${i.quantity}x ${i.item_name_snapshot.replace(/,/g, '')}`)
        .join('; ');

      return [
        o.order_number,
        dateObj.toLocaleDateString(),
        dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        `"${o.profile?.full_name || 'Student'}"`,
        o.profile?.email || '',
        o.payment_method,
        o.payment_status,
        o.order_status,
        `"${itemsSummary}"`,
        o.subtotal.toFixed(2),
        o.tax_amount.toFixed(2),
        o.total_amount.toFixed(2),
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `canteen_sales_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('CSV Exported', 'Canteen sales report downloaded successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Title & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sales & Revenue Analytics
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Audit daily kitchen turnover, dish popularities, and export financial summaries.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Sales CSV Report</span>
        </button>
      </div>

      {/* Revenue High-level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold block">Total Verified Revenue</span>
            <span className="text-2xl font-black text-emerald-700">
              ₹{(stats?.verifiedRevenue ?? 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold block">Successful Orders</span>
            <span className="text-2xl font-black text-gray-900">
              {orders.filter((o) => o.order_status === 'Completed').length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold block">Total Dish Portions Sold</span>
            <span className="text-2xl font-black text-gray-900">
              {stats?.totalItemsSold ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Sales by Date Bar Representation */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-gray-900">Last 7 Days Sales Trend</h3>
        <p className="text-xs text-gray-400">Verified transaction volume in Indian Rupees (INR)</p>

        <div className="pt-4 grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 border-b pb-2">
          {stats?.salesByDay?.map((day: any, idx: number) => {
            const maxVal = Math.max(...stats.salesByDay.map((d: any) => d.revenue), 200);
            const heightPercent = Math.min(100, Math.max(10, Math.round((day.revenue / maxVal) * 100)));

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition">
                  ₹{day.revenue}
                </span>
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-emerald-600 to-green-500 rounded-t-xl transition-all duration-500 shadow-xs group-hover:from-emerald-700 group-hover:to-green-600"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[11px] text-gray-600 font-semibold mt-2 truncate w-full text-center">
                  {day.date.split(',')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Items Breakdown Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-gray-900">Item-wise Revenue Ranking</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase font-bold text-[11px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Dish Name</th>
                <th className="py-2.5 px-3">Quantity Sold</th>
                <th className="py-2.5 px-3">Gross Turnover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.popularItems?.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-bold text-amber-600 font-mono">#{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-gray-900">{item.name}</td>
                  <td className="py-3 px-3 font-bold text-gray-700">{item.count} portions</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">₹{item.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
