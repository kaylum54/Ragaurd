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
    <div className="min-h-screen bg-[#EBEEF2]">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-midnight-900 border-r border-midnight-800 transition-all duration-150',
          collapsed ? 'w-12' : 'w-52'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-11 items-center justify-between px-3 border-b border-midnight-800">
            {!collapsed && (
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-critical-600 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white tracking-tight">RAGuard</span>
                  <span className="text-[9px] font-bold px-1 py-0.5 bg-critical-600 text-white rounded">
                    ADMIN
                  </span>
                </div>
              </Link>
            )}
            {collapsed && (
              <Link href="/admin" className="mx-auto">
                <div className="w-6 h-6 rounded bg-critical-600 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
              </Link>
            )}
            {!collapsed && (
              <button
                className="p-1 rounded text-midnight-500 hover:text-midnight-300 hover:bg-midnight-800 transition-colors"
                onClick={() => setCollapsed(!collapsed)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Expand button when collapsed */}
          {collapsed && (
            <button
              className="mx-auto mt-2 p-1 rounded text-midnight-500 hover:text-midnight-300 hover:bg-midnight-800 transition-colors"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {!collapsed && (
              <div className="text-[10px] font-semibold uppercase tracking-wider text-midnight-500 px-2.5 py-1.5 mt-1">
                Admin
              </div>
            )}
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-1.5 rounded text-[13px] font-medium transition-colors',
                      isActive
                        ? 'bg-critical-600 text-white'
                        : 'text-midnight-400 hover:bg-midnight-800/50 hover:text-midnight-200'
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
          <div className="p-1.5 border-t border-midnight-800 space-y-0.5">
            {!collapsed && (
              <Link href="/dashboard">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[13px] font-medium text-midnight-400 hover:bg-midnight-800/50 hover:text-midnight-200 transition-colors">
                  <ArrowLeft className="h-4 w-4 text-midnight-500" />
                  <span className="flex-1">Back to Dashboard</span>
                </div>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-2 px-2.5 py-1.5 rounded text-[13px] font-medium w-full text-critical-400 hover:bg-critical-900/50 hover:text-critical-300 transition-colors',
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
          'fixed top-0 right-0 z-30 h-11 bg-white border-b border-midnight-300/60 transition-all duration-150',
          collapsed ? 'left-12' : 'left-52'
        )}
      >
        <div className="flex h-full items-center justify-between px-3">
          <div className="text-xs font-semibold text-midnight-900">Admin Dashboard</div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-critical-600 rounded text-[10px] font-bold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            ADMIN MODE
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          'pt-11 min-h-screen transition-all duration-150',
          collapsed ? 'pl-12' : 'pl-52'
        )}
      >
        <div className="p-4 max-w-[1600px]">{children}</div>
      </main>
    </div>
  );
}
