'use client';

import { useState } from 'react';
import { User, Building, Bell, Shield, Trash2, Camera, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="dash-page-title">Settings</h1>
        <p className="dash-page-subtitle">
          Manage your account and organization
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-0.5 p-1 bg-dash-bg-secondary w-fit border-2 border-dash-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all',
              activeTab === tab.id
                ? 'bg-dash-accent text-white'
                : 'text-dash-text-secondary hover:text-dash-text-primary hover:bg-dash-bg-hover'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Profile Information</span>
          </div>
          <div className="dash-card-body space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-white/[0.1]">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-xl bg-dash-accent/20 text-dash-accent font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 h-7 w-7 bg-dash-accent text-white rounded-full flex items-center justify-center hover:bg-dash-accent-hover transition-colors shadow-glow-accent">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <p className="text-lg font-semibold text-dash-text-primary">{user.name}</p>
                <p className="text-sm text-dash-text-muted">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="dash-card-title block mb-2">Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="dash-input"
                />
              </div>
              <div>
                <label className="dash-card-title block mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="dash-input"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <button className="dash-btn dash-btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organization Tab */}
      {activeTab === 'organization' && (
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Organization Settings</span>
          </div>
          <div className="dash-card-body space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="dash-card-title block mb-2">Organization Name</label>
                <input
                  type="text"
                  value={org.name}
                  onChange={(e) => setOrg({ ...org, name: e.target.value })}
                  className="dash-input"
                />
              </div>
              <div>
                <label className="dash-card-title block mb-2">URL Slug</label>
                <input
                  type="text"
                  value={org.slug}
                  onChange={(e) => setOrg({ ...org, slug: e.target.value })}
                  className="dash-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="dash-card-title block mb-2">Billing Email</label>
                <input
                  type="email"
                  value={org.billingEmail}
                  onChange={(e) => setOrg({ ...org, billingEmail: e.target.value })}
                  className="dash-input"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <button className="dash-btn dash-btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Notification Preferences</span>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {[
              { key: 'email', title: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'attacks', title: 'Attack Alerts', desc: 'Get notified when attacks are blocked' },
              { key: 'usage', title: 'Usage Alerts', desc: 'Get notified when approaching limits' },
              { key: 'marketing', title: 'Marketing Emails', desc: 'Receive product updates and news' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-dash-text-primary">{item.title}</p>
                  <p className="text-xs text-dash-text-muted mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors',
                    notifications[item.key as keyof typeof notifications]
                      ? 'bg-dash-accent'
                      : 'bg-white/[0.1]'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                      notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'
                    )}
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
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Change Password</span>
            </div>
            <div className="dash-card-body space-y-4">
              <div>
                <label className="dash-card-title block mb-2">Current Password</label>
                <input
                  type="password"
                  className="dash-input"
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="dash-card-title block mb-2">New Password</label>
                  <input
                    type="password"
                    className="dash-input"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="dash-card-title block mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="dash-input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <button className="dash-btn dash-btn-primary">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Two-Factor Authentication</span>
              <span className="dash-badge dash-badge-success">
                <Check className="h-3 w-3 mr-1" />
                Enabled
              </span>
            </div>
            <div className="dash-card-body">
              <p className="text-sm text-dash-text-secondary mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <button className="dash-btn dash-btn-secondary">
                Manage 2FA
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-dash-danger/30 overflow-hidden">
            <div className="px-4 py-3 bg-dash-danger/10 border-b border-dash-danger/20">
              <span className="text-xs font-semibold text-dash-danger uppercase tracking-wider">Danger Zone</span>
            </div>
            <div className="p-4 bg-dash-bg-secondary">
              <p className="text-sm text-dash-text-secondary mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-dash-danger text-white hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Delete Dialog */}
          {deleteDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="bg-dash-bg-tertiary rounded-lg border border-white/[0.1] w-full max-w-md mx-4 shadow-dash-lg">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <h3 className="text-lg font-semibold text-dash-text-primary">Delete Account</h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm text-dash-text-secondary">
                    This action cannot be undone. This will permanently delete your account and remove all data from our servers.
                  </p>
                </div>
                <div className="flex gap-3 justify-end px-6 py-4 bg-white/[0.02] border-t border-white/[0.06]">
                  <button
                    onClick={() => setDeleteDialogOpen(false)}
                    className="dash-btn dash-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button className="dash-btn bg-dash-danger text-white hover:bg-red-600">
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
