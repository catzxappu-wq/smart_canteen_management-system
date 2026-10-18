import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const { success } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success('Message Dispatched', 'Your feedback has been delivered to the canteen manager.');
    setIsSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          We're Here to Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
          Contact Canteen & Student Support
        </h1>
        <p className="text-gray-500 text-sm">
          Have feedback on today's meal, a special dietary requirement, or need help with a payment?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-gray-900 border-b pb-4">
              Canteen Help Desk
            </h3>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Campus Location</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Ground Floor, Academic Block B, Next to Central Library, Main Campus
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Kitchen Desk Phone</h4>
                <p className="text-xs text-gray-500 mt-0.5">+91 98765 43210 / Ext 402</p>
                <span className="text-[10px] text-gray-400">Available during operating hours</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Email Inquiries</h4>
                <p className="text-xs text-gray-500 mt-0.5">canteen@campus.edu</p>
                <p className="text-xs text-gray-500">support.food@campus.edu</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Operating Hours</h4>
                <p className="text-xs text-gray-500 mt-0.5">Monday to Saturday: 8:00 AM – 8:30 PM</p>
                <p className="text-xs text-gray-500">Sunday: Closed for deep sanitation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback / Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-xl text-gray-900 mb-1">Send a Message</h3>
          <p className="text-xs text-gray-500 mb-6">
            Leave suggestions, refund inquiries, or feedback. We reply within 24 hours.
          </p>

          {isSent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-950">Thank You!</h4>
              <p className="text-xs text-emerald-800">
                Your message has been recorded. Our food manager will review your submission promptly.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="pt-2 text-xs font-bold text-emerald-700 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order Inquiry / Feedback / Suggestion"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
