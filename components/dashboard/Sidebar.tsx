'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Target,
  Key,
  BarChart3,
  CreditCard,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Defense',
    href: '/dashboard/defense',
    icon: Shield,
    children: [
      { title: 'Text Defense', href: '/dashboard/defense/text' },
      { title: 'Audio Defense', href: '/dashboard/defense/audio', badge: 'Pro' },
    ],
  },
  {
    title: 'Red Team',
    href: '/dashboard/redteam',
    icon: Target,
    badge: 'Pro',
  },
  {
    title: 'API Keys',
    href: '/dashboard/api-keys',
    icon: Key,
  },
  {
    title: 'Usage',
    href: '/dashboard/usage',
    icon: BarChart3,
  },
];

const bottomNavItems = [
  {
    title: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
  {
    title: 'Team',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">RAGuard</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}
          <button
            className={cn(
              'p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150',
              collapsed && 'mx-auto mt-2'
            )}
            onClick={onToggle}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {!collapsed && (
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3">
              Main
            </div>
          )}
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <div key={item.href}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <item.icon className={cn(
                      'h-5 w-5 shrink-0',
                      isActive ? 'text-violet-600' : 'text-slate-400'
                    )} />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="text-xs font-medium px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </Link>
                {!collapsed && item.children && isActive && (
                  <div className="mt-1 ml-8 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link key={child.href} href={child.href}>
                          <div
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                              isChildActive
                                ? 'text-violet-700 font-medium bg-violet-50/50'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            )}
                          >
                            <span className="flex-1">{child.title}</span>
                            {child.badge && (
                              <span className="text-xs font-medium px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded">
                                {child.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          {!collapsed && (
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3">
              Account
            </div>
          )}
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <item.icon className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'text-violet-600' : 'text-slate-400'
                  )} />
                  {!collapsed && <span className="flex-1">{item.title}</span>}
                </div>
              </Link>
            );
          })}

          {!collapsed && (
            <>
              <div className="h-px bg-slate-100 my-3" />
              <Link href="/docs" target="_blank">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150">
                  <HelpCircle className="h-5 w-5 text-slate-400" />
                  <span className="flex-1">Documentation</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
