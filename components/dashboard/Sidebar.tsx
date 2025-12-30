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
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-midnight-200 transition-all duration-200',
        collapsed ? 'w-14' : 'w-60'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-3 border-b border-midnight-200">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-midnight-800 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-midnight-950">RAGuard</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <div className="w-7 h-7 rounded bg-midnight-800 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </Link>
          )}
          {!collapsed && (
            <button
              className="p-1 rounded text-midnight-400 hover:text-midnight-600 hover:bg-midnight-100 transition-colors"
              onClick={onToggle}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            className="mx-auto mt-3 p-1 rounded text-midnight-400 hover:text-midnight-600 hover:bg-midnight-100 transition-colors"
            onClick={onToggle}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {!collapsed && (
            <div className="text-xs font-medium uppercase tracking-wide text-midnight-400 px-3 mb-2 mt-2">
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
                      'flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-midnight-100 text-midnight-900'
                        : 'text-midnight-600 hover:bg-midnight-50 hover:text-midnight-900'
                    )}
                  >
                    <item.icon className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-midnight-700' : 'text-midnight-400'
                    )} />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="text-xs font-medium px-1.5 py-0.5 bg-accent-50 text-accent-700 border border-accent-200 rounded">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </Link>
                {!collapsed && item.children && isActive && (
                  <div className="mt-0.5 ml-7 space-y-0.5">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link key={child.href} href={child.href}>
                          <div
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors',
                              isChildActive
                                ? 'text-midnight-900 font-medium bg-midnight-50'
                                : 'text-midnight-500 hover:text-midnight-900 hover:bg-midnight-50'
                            )}
                          >
                            <span className="flex-1">{child.title}</span>
                            {child.badge && (
                              <span className="text-xs font-medium px-1.5 py-0.5 bg-accent-50 text-accent-700 border border-accent-200 rounded">
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
        <div className="p-2 border-t border-midnight-200 space-y-0.5">
          {!collapsed && (
            <div className="text-xs font-medium uppercase tracking-wide text-midnight-400 px-3 mb-2">
              Account
            </div>
          )}
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-midnight-100 text-midnight-900'
                      : 'text-midnight-600 hover:bg-midnight-50 hover:text-midnight-900'
                  )}
                >
                  <item.icon className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-midnight-700' : 'text-midnight-400'
                  )} />
                  {!collapsed && <span className="flex-1">{item.title}</span>}
                </div>
              </Link>
            );
          })}

          {!collapsed && (
            <>
              <div className="h-px bg-midnight-100 my-2" />
              <Link href="/docs" target="_blank">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium text-midnight-600 hover:bg-midnight-50 hover:text-midnight-900 transition-colors">
                  <HelpCircle className="h-4 w-4 text-midnight-400" />
                  <span className="flex-1">Docs</span>
                  <ExternalLink className="h-3 w-3 text-midnight-400" />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
