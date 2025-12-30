'use client';

import { useState } from 'react';
import { User, Building, Bell, Shield, Trash2, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
};

const mockOrg = {
  name: 'Acme Inc.',
  slug: 'acme-inc',
  billingEmail: 'billing@acme.com',
};

export default function SettingsPage() {
  const [user, setUser] = useState(mockUser);
  const [org, setOrg] = useState(mockOrg);
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    attacks: true,
    usage: true,
    marketing: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-midnight-950">Settings</h1>
        <p className="text-xs text-midnight-500 mt-0.5">
          Manage your account and organization
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-midnight-100 rounded w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-midnight-900 shadow-sm'
                : 'text-midnight-600 hover:text-midnight-800'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
          <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60">
            <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Profile Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-midnight-200">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-lg bg-midnight-100 text-midnight-700 font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 h-6 w-6 bg-midnight-800 text-white rounded-full flex items-center justify-center hover:bg-midnight-700 transition-colors">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div>
                <p className="text-sm font-semibold text-midnight-900">{user.name}</p>
                <p className="text-xs text-midnight-500">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="mt-1 w-full px-2.5 py-1.5 text-sm rounded border border-midnight-200 bg-white text-midnight-900 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="mt-1 w-full px-2.5 py-1.5 text-sm rounded border border-midnight-200 bg-white text-midnight-900 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-midnight-100">
              <button className="px-3 py-1.5 text-xs font-semibold rounded bg-midnight-800 text-white hover:bg-midnight-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organization Tab */}
      {activeTab === 'organization' && (
        <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
          <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60">
            <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Organization Settings</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Organization Name</label>
                <input
                  type="text"
                  value={org.name}
                  onChange={(e) => setOrg({ ...org, name: e.target.value })}
                  className="mt-1 w-full px-2.5 py-1.5 text-sm rounded border border-midnight-200 bg-white text-midnight-900 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">URL Slug</label>
                <input
                  type="text"
                  value={org.slug}
                  onChange={(e) => setOrg({ ...org, slug: e.target.value })}
                  className="mt-1 w-full px-2.5 py-1.5 text-sm rounded border border-midnight-200 bg-white text-midnight-900 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Billing Email</label>
                <input
                  type="email"
                  value={org.billingEmail}
                  onChange={(e) => setOrg({ ...org, billingEmail: e.target.value })}
                  className="mt-1 w-full px-2.5 py-1.5 text-sm rounded border border-midnight-200 bg-white text-midnight-900 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-midnight-100">
              <button className="px-3 py-1.5 text-xs font-semibold rounded bg-midnight-800 text-white hover:bg-midnight-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
          <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60">
            <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Notification Preferences</h2>
          </div>
          <div className="divide-y divide-midnight-100">
            {[
              { key: 'email', title: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'attacks', title: 'Attack Alerts', desc: 'Get notified when attacks are blocked' },
              { key: 'usage', title: 'Usage Alerts', desc: 'Get notified when approaching limits' },
              { key: 'marketing', title: 'Marketing Emails', desc: 'Receive product updates and news' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-midnight-900">{item.title}</p>
                  <p className="text-xs text-midnight-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-accent-600' : 'bg-midnight-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          {/* Password Change */}
          <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
            <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60">
              <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Change Password</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  className="mt-1 w-full px-2.5 py-1.5 text-sm rounded border border-midnight-200 bg-white text-midnight-900 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">New Password</label>
                  <input
                    type="password"
                    className="mt-1 w-full px-2.5 py-1.5 text-sm rounded border border-midnight-200 bg-white text-midnight-900 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Confirm Password</label>
                  <input
                    type="password"
                    className="mt-1 w-full px-2.5 py-1.5 text-sm rounded border border-midnight-200 bg-white text-midnight-900 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-midnight-100">
                <button className="px-3 py-1.5 text-xs font-semibold rounded bg-midnight-800 text-white hover:bg-midnight-700 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded border border-critical-300 overflow-hidden">
            <div className="px-3 py-2 bg-critical-50 border-b border-critical-200">
              <h2 className="text-[10px] font-semibold text-critical-700 uppercase tracking-wide">Danger Zone</h2>
            </div>
            <div className="p-4">
              <p className="text-xs text-midnight-600 mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-critical-600 text-white hover:bg-critical-700 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Delete Dialog */}
          {deleteDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded border border-midnight-200 w-full max-w-md mx-4 overflow-hidden">
                <div className="px-4 py-3 border-b border-midnight-100">
                  <h3 className="text-sm font-semibold text-midnight-900">Delete Account</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-midnight-600">
                    This action cannot be undone. This will permanently delete your account and remove all data from our servers.
                  </p>
                </div>
                <div className="flex gap-2 justify-end px-4 py-3 bg-midnight-50 border-t border-midnight-100">
                  <button
                    onClick={() => setDeleteDialogOpen(false)}
                    className="px-3 py-1.5 text-xs font-medium rounded border border-midnight-200 text-midnight-700 hover:bg-midnight-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-3 py-1.5 text-xs font-semibold rounded bg-critical-600 text-white hover:bg-critical-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
