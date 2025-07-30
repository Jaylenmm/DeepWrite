"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export default function AccountSettings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>('profile');
  
  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
    email_notifications: true,
    ai_suggestions: true,
    weekly_digest: false
  });

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.replace("/signin");
        return;
      }
      setUser(data.session.user);
      await fetchProfile(data.session.user.id);
      setLoading(false);
    };
    getSession();
  }, [router]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching profile:', error);
      return;
    }
    
    if (data) {
      setProfile(data);
      setFormData(prev => ({
        ...prev,
        full_name: data.full_name || '',
        email: data.email || user?.email || ''
      }));
    } else {
      // Create profile if it doesn't exist
      await createProfile(userId);
    }
  };

  const createProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email: user?.email,
          full_name: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      return;
    }
    
    setProfile(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (activeTab === 'profile') {
        // Update profile
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        
        if (error) throw error;
      } else if (activeTab === 'security') {
        // Update password
        if (formData.new_password !== formData.confirm_password) {
          setError('New passwords do not match');
          setSaving(false);
          return;
        }
        
        const { error } = await supabase.auth.updateUser({
          password: formData.new_password
        });
        
        if (error) throw error;
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
      } else if (activeTab === 'notifications') {
        // Update notification preferences
        const { error } = await supabase
          .from('profiles')
          .update({
            email_notifications: formData.email_notifications,
            ai_suggestions: formData.ai_suggestions,
            weekly_digest: formData.weekly_digest,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        
        if (error) throw error;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <span className="text-slate-600">Loading account settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-medium text-black">Account Settings</h1>
            <p className="text-slate-600 mt-1">Manage your profile, security, and preferences</p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'security', label: 'Security', icon: '🔒' },
                { id: 'notifications', label: 'Notifications', icon: '🔔' },
                { id: 'billing', label: 'Billing', icon: '💳' }
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
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      id="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base text-black"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-base text-slate-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Account Information</label>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Member since:</span>
                      <span className="text-sm text-black">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Last updated:</span>
                      <span className="text-sm text-black">{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-lg bg-black text-white font-medium text-lg shadow hover:bg-slate-800 transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  {saved && <div className="text-green-600 font-medium">✓ Saved successfully!</div>}
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="new_password" className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input
                      id="new_password"
                      type="password"
                      value={formData.new_password}
                      onChange={e => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base text-black"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <input
                      id="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={e => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base text-black"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Security Tips</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use a strong password with at least 8 characters</li>
                    <li>• Include a mix of letters, numbers, and symbols</li>
                    <li>• Never share your password with anyone</li>
                    <li>• Consider using a password manager</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="submit"
                    disabled={saving || !formData.new_password || !formData.confirm_password}
                    className="px-6 py-3 rounded-lg bg-black text-white font-medium text-lg shadow hover:bg-slate-800 transition-colors disabled:opacity-60"
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                  {saved && <div className="text-green-600 font-medium">✓ Password updated successfully!</div>}
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-black">Email Notifications</h3>
                      <p className="text-sm text-slate-600">Receive important updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.email_notifications}
                        onChange={e => setFormData(prev => ({ ...prev, email_notifications: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-black">AI Writing Suggestions</h3>
                      <p className="text-sm text-slate-600">Get real-time AI suggestions while writing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.ai_suggestions}
                        onChange={e => setFormData(prev => ({ ...prev, ai_suggestions: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-black">Weekly Digest</h3>
                      <p className="text-sm text-slate-600">Receive a weekly summary of your writing activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.weekly_digest}
                        onChange={e => setFormData(prev => ({ ...prev, weekly_digest: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-lg bg-black text-white font-medium text-lg shadow hover:bg-slate-800 transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                  {saved && <div className="text-green-600 font-medium">✓ Preferences saved successfully!</div>}
                </div>
              </form>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="font-medium text-black mb-4">Current Plan</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-black">Pro Plan</div>
                      <div className="text-sm text-slate-600">Unlimited AI writing assistance</div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-black mb-2">Billing Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Next billing:</span>
                        <span className="text-black">July 1, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Amount:</span>
                        <span className="text-black">$19.99/month</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-black mb-2">Payment Method</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-5 bg-slate-200 rounded"></div>
                      <span className="text-sm text-black">Visa ending in 4242</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Expires 12/25</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Link href="/billing" className="px-6 py-3 rounded-lg bg-black text-white font-medium text-lg shadow hover:bg-slate-800 transition-colors">
                    Manage Billing
                  </Link>
                  <button className="px-6 py-3 rounded-lg border border-slate-200 text-black font-medium text-lg hover:bg-slate-50 transition-colors">
                    Download Invoice
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                Need help? <Link href="/contact" className="text-black hover:underline">Contact support</Link>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 