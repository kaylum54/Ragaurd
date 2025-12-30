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
  LogOut,
  Shield,
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
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-slate-900/50 border-r border-slate-700/50 transition-all duration-200',
          collapsed ? 'w-16' : 'w-56'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-14 items-center justify-between px-4 border-b border-slate-700/50">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold text-white">Admin</span>
              </div>
            )}
            {collapsed && <Shield className="w-5 h-5 text-blue-500 mx-auto" />}
            <button
              className={cn('p-1 text-slate-500 hover:text-white', collapsed && 'mx-auto')}
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-slate-700/50 space-y-2">
            {!collapsed && (
              <Link href="/dashboard">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                  Dashboard
                </div>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white rounded-md transition-colors',
                collapsed && 'justify-center'
              )}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header
        className={cn(
          'fixed top-0 right-0 z-30 h-14 bg-slate-950 border-b border-slate-700/50 transition-all duration-200',
          collapsed ? 'left-16' : 'left-56'
        )}
      >
        <div className="flex h-full items-center justify-between px-6">
          <div className="text-sm text-white font-medium">Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
              ADMIN
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          'pt-14 min-h-screen transition-all duration-200',
          collapsed ? 'pl-16' : 'pl-56'
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
