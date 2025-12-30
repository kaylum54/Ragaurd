'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building,
  DollarSign,
  BarChart3,
  Server,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { title: 'Overview', href: '/admin', icon: LayoutDashboard },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'Organizations', href: '/admin/organizations', icon: Building },
  { title: 'Revenue', href: '/admin/revenue', icon: DollarSign },
  { title: 'Usage', href: '/admin/usage', icon: BarChart3 },
  { title: 'System', href: '/admin/system', icon: Server },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-slate-900 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
            {!collapsed && (
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white">RAGuard</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-600 text-white rounded">
                    ADMIN
                  </span>
                </div>
              </Link>
            )}
            {collapsed && (
              <Link href="/admin" className="mx-auto">
                <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </Link>
            )}
            <button
              className={cn(
                'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150',
                collapsed && 'mx-auto mt-2'
              )}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {!collapsed && (
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-3">
                Admin
              </div>
            )}
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 shrink-0',
                        isActive ? 'text-white' : 'text-slate-500'
                      )}
                    />
                    {!collapsed && <span className="flex-1">{item.title}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-slate-800 space-y-1">
            {!collapsed && (
              <Link href="/dashboard">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-150">
                  <ArrowLeft className="h-5 w-5 text-slate-500" />
                  <span className="flex-1">Back to Dashboard</span>
                </div>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-rose-400 hover:bg-rose-950 hover:text-rose-300 transition-all duration-150',
                collapsed && 'justify-center'
              )}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="flex-1 text-left">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header
        className={cn(
          'fixed top-0 right-0 z-30 h-16 bg-white border-b border-slate-200 transition-all duration-300',
          collapsed ? 'left-16' : 'left-64'
        )}
      >
        <div className="flex h-full items-center justify-between px-6">
          <div className="text-sm font-medium text-slate-900">Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full">
              ADMIN MODE
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          collapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
