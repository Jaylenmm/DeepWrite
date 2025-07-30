"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan: {
    name: string;
    price: number;
    interval: string;
  };
}

interface Usage {
  documents_created: number;
  words_written: number;
  ai_suggestions_used: number;
  storage_used_mb: number;
  storage_limit_mb: number;
}

interface Invoice {
  id: string;
  amount: number;
  status: string;
  created: string;
  pdf_url?: string;
}

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage>({
    documents_created: 0,
    words_written: 0,
    ai_suggestions_used: 0,
    storage_used_mb: 0,
    storage_limit_mb: 1000
  });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'invoices' | 'payment'>('overview');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.replace("/signin");
        return;
      }
      setUser(data.session.user);
      await Promise.all([
        fetchSubscription(),
        fetchUsage(),
        fetchInvoices()
      ]);
      setLoading(false);
    };
    getSession();
  }, [router]);

  const fetchSubscription = async () => {
    // Mock subscription data - in real app, this would come from Stripe
    setSubscription({
      id: 'sub_123456789',
      status: 'active',
      current_period_end: '2024-07-01T00:00:00Z',
      cancel_at_period_end: false,
      plan: {
        name: 'Pro Plan',
        price: 19.99,
        interval: 'month'
      }
    });
  };

  const fetchUsage = async () => {
    // Mock usage data - in real app, this would come from your database
    setUsage({
      documents_created: 24,
      words_written: 15420,
      ai_suggestions_used: 89,
      storage_used_mb: 45.2,
      storage_limit_mb: 1000
    });
  };

  const fetchInvoices = async () => {
    // Mock invoice data - in real app, this would come from Stripe
    setInvoices([
      {
        id: 'in_123456789',
        amount: 19.99,
        status: 'paid',
        created: '2024-06-01T00:00:00Z',
        pdf_url: '#'
      },
      {
        id: 'in_123456788',
        amount: 19.99,
        status: 'paid',
        created: '2024-05-01T00:00:00Z',
        pdf_url: '#'
      },
      {
        id: 'in_123456787',
        amount: 19.99,
        status: 'paid',
        created: '2024-04-01T00:00:00Z',
        pdf_url: '#'
      }
    ]);
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    // Mock cancellation - in real app, this would call Stripe API
    setTimeout(() => {
      setSubscription(prev => prev ? { ...prev, cancel_at_period_end: true } : null);
      setCancelling(false);
    }, 2000);
  };

  const handleReactivateSubscription = async () => {
    setCancelling(true);
    // Mock reactivation - in real app, this would call Stripe API
    setTimeout(() => {
      setSubscription(prev => prev ? { ...prev, cancel_at_period_end: false } : null);
      setCancelling(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <span className="text-slate-600">Loading billing information...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-medium text-black">Billing & Subscriptions</h1>
            <p className="text-slate-600 mt-1">Manage your subscription, view usage, and download invoices</p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'usage', label: 'Usage', icon: '📈' },
                { id: 'invoices', label: 'Invoices', icon: '🧾' },
                { id: 'payment', label: 'Payment', icon: '💳' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-black text-lg">Current Plan</h3>
                    {subscription?.cancel_at_period_end && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                        Cancelling
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-2xl font-bold text-black">{subscription?.plan.name}</div>
                      <div className="text-sm text-slate-600">${subscription?.plan.price}/{subscription?.plan.interval}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Next billing</div>
                      <div className="text-black font-medium">
                        {subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Status</div>
                      <div className="text-black font-medium capitalize">{subscription?.status}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    {subscription?.cancel_at_period_end ? (
                      <button
                        onClick={handleReactivateSubscription}
                        disabled={cancelling}
                        className="px-6 py-3 rounded-lg bg-black text-white font-medium shadow hover:bg-slate-800 transition-colors disabled:opacity-60"
                      >
                        {cancelling ? "Reactivating..." : "Reactivate Subscription"}
                      </button>
                    ) : (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={cancelling}
                        className="px-6 py-3 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors disabled:opacity-60"
                      >
                        {cancelling ? "Cancelling..." : "Cancel Subscription"}
                      </button>
                    )}
                    <Link href="/contact" className="px-6 py-3 rounded-lg border border-slate-200 text-black font-medium hover:bg-slate-50 transition-colors">
                      Contact Support
                    </Link>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-black">{usage.documents_created}</div>
                    <div className="text-sm text-slate-600">Documents Created</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-black">{usage.words_written.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">Words Written</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-black">{usage.ai_suggestions_used}</div>
                    <div className="text-sm text-slate-600">AI Suggestions</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-black">{usage.storage_used_mb}MB</div>
                    <div className="text-sm text-slate-600">Storage Used</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                {/* Storage Usage */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="font-medium text-black mb-4">Storage Usage</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Used</span>
                      <span className="text-black">{usage.storage_used_mb}MB / {usage.storage_limit_mb}MB</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(usage.storage_used_mb / usage.storage_limit_mb) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-slate-600">
                      {Math.round((usage.storage_used_mb / usage.storage_limit_mb) * 100)}% of storage used
                    </div>
                  </div>
                </div>

                {/* Usage Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="font-medium text-black mb-4">Writing Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Documents this month</span>
                        <span className="text-sm text-black font-medium">{usage.documents_created}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Total words written</span>
                        <span className="text-sm text-black font-medium">{usage.words_written.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Average words per doc</span>
                        <span className="text-sm text-black font-medium">
                          {usage.documents_created > 0 ? Math.round(usage.words_written / usage.documents_created) : 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="font-medium text-black mb-4">AI Features</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">AI suggestions used</span>
                        <span className="text-sm text-black font-medium">{usage.ai_suggestions_used}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Suggestions per doc</span>
                        <span className="text-sm text-black font-medium">
                          {usage.documents_created > 0 ? Math.round(usage.ai_suggestions_used / usage.documents_created) : 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">AI usage efficiency</span>
                        <span className="text-sm text-black font-medium">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-black text-lg">Invoice History</h3>
                  <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-black hover:bg-slate-50 transition-colors">
                    Export All
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">
                            {invoice.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {new Date(invoice.created).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                            ${invoice.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-black hover:underline">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                {/* Current Payment Method */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="font-medium text-black mb-4">Payment Method</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-slate-600">VISA</span>
                      </div>
                      <div>
                        <div className="text-black font-medium">Visa ending in 4242</div>
                        <div className="text-sm text-slate-600">Expires 12/25</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-black hover:bg-slate-50 transition-colors">
                      Update
                    </button>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="font-medium text-black mb-4">Billing Address</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-black">John Doe</div>
                    <div className="text-slate-600">123 Main Street</div>
                    <div className="text-slate-600">Apt 4B</div>
                    <div className="text-slate-600">New York, NY 10001</div>
                    <div className="text-slate-600">United States</div>
                  </div>
                  <button className="mt-4 px-4 py-2 text-sm border border-slate-200 rounded-lg text-black hover:bg-slate-50 transition-colors">
                    Update Address
                  </button>
                </div>

                {/* Tax Information */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="font-medium text-black mb-4">Tax Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Tax ID (VAT/GST)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base text-black"
                        placeholder="Enter your tax ID if applicable"
                      />
                    </div>
                    <button className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-slate-800 transition-colors">
                      Save Tax Info
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 