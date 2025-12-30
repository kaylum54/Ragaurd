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
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-midnight-900 transition-all duration-200',
          collapsed ? 'w-14' : 'w-60'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-14 items-center justify-between px-3 border-b border-midnight-800">
            {!collapsed && (
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-critical-700 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">RAGuard</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 bg-critical-700 text-white rounded">
                    ADMIN
                  </span>
                </div>
              </Link>
            )}
            {collapsed && (
              <Link href="/admin" className="mx-auto">
                <div className="w-7 h-7 rounded bg-critical-700 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </Link>
            )}
            {!collapsed && (
              <button
                className="p-1 rounded text-midnight-400 hover:text-white hover:bg-midnight-800 transition-colors"
                onClick={() => setCollapsed(!collapsed)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Expand button when collapsed */}
          {collapsed && (
            <button
              className="mx-auto mt-3 p-1 rounded text-midnight-400 hover:text-white hover:bg-midnight-800 transition-colors"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {!collapsed && (
              <div className="text-xs font-medium uppercase tracking-wide text-midnight-500 px-3 mb-2 mt-2">
                Admin
              </div>
            )}
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-critical-700 text-white'
                        : 'text-midnight-400 hover:bg-midnight-800 hover:text-white'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-white' : 'text-midnight-500'
                      )}
                    />
                    {!collapsed && <span className="flex-1">{item.title}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-2 border-t border-midnight-800 space-y-0.5">
            {!collapsed && (
              <Link href="/dashboard">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-midnight-400 hover:bg-midnight-800 hover:text-white transition-colors">
                  <ArrowLeft className="h-4 w-4 text-midnight-500" />
                  <span className="flex-1">Back to Dashboard</span>
                </div>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium w-full text-critical-400 hover:bg-critical-900/50 hover:text-critical-300 transition-colors',
                collapsed && 'justify-center'
              )}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="flex-1 text-left">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header
        className={cn(
          'fixed top-0 right-0 z-30 h-14 bg-white border-b border-midnight-200 transition-all duration-200',
          collapsed ? 'left-14' : 'left-60'
        )}
      >
        <div className="flex h-full items-center justify-between px-4">
          <div className="text-sm font-medium text-midnight-900">Admin Dashboard</div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-critical-50 border border-critical-200 rounded text-xs font-medium text-critical-700">
            ADMIN MODE
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          'pt-14 min-h-screen transition-all duration-200',
          collapsed ? 'pl-14' : 'pl-60'
        )}
      >
        <div className="p-6 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
