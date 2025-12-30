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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { Badge } from '@/components/ui/badge';

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
    <div className="min-h-screen bg-base">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-[rgba(59,130,246,0.1)] transition-all duration-200',
          collapsed ? 'w-16' : 'w-[260px]'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-[rgba(59,130,246,0.1)]">
            {!collapsed && (
              <div className="flex items-center gap-2 animate-pulse-glow rounded-lg p-1">
                <Logo variant="light" size="sm" />
                <Badge variant="destructive" className="text-[10px]">ADMIN</Badge>
              </div>
            )}
            {collapsed && (
              <div className="mx-auto animate-pulse-glow rounded-lg p-1">
                <Logo showText={false} variant="light" size="sm" />
              </div>
            )}
            <button
              className={cn('p-1.5 rounded-md text-steel-500 hover:text-steel-100 hover:bg-[rgba(59,130,246,0.1)] transition-all duration-150', collapsed && 'mx-auto')}
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="nav-divider">Admin</div>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'nav-item',
                      isActive && 'active'
                    )}
                  >
                    <item.icon className="nav-icon" />
                    {!collapsed && <span className="text-sm">{item.title}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-[rgba(59,130,246,0.1)] space-y-1">
            {!collapsed && (
              <Link href="/dashboard">
                <div className="nav-item">
                  <ChevronLeft className="nav-icon" />
                  <span className="text-sm">Dashboard</span>
                </div>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                'nav-item w-full text-danger hover:text-danger hover:bg-[rgba(239,68,68,0.1)]',
                collapsed && 'justify-center'
              )}
            >
              <LogOut className="nav-icon" />
              {!collapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header
        className={cn(
          'fixed top-0 right-0 z-30 h-16 bg-base border-b border-[rgba(59,130,246,0.1)] transition-all duration-200',
          collapsed ? 'left-16' : 'left-[260px]'
        )}
      >
        <div className="flex h-full items-center justify-between px-6">
          <div className="text-sm text-steel-100 font-medium">Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive">ADMIN MODE</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-200',
          collapsed ? 'pl-16' : 'pl-[260px]'
        )}
      >
        <div className="p-6 max-w-[1440px] mx-auto animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
