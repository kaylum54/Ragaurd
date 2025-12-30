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
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  {
    title: 'Defense',
    href: '/dashboard/defense',
    icon: Shield,
    children: [
      { title: 'Text Defense', href: '/dashboard/defense/text' },
      { title: 'Audio Defense', href: '/dashboard/defense/audio', badge: 'PRO' },
    ],
  },
  { title: 'Red Team', href: '/dashboard/redteam', icon: Target, badge: 'PRO' },
  { title: 'API Keys', href: '/dashboard/api-keys', icon: Key },
  { title: 'Usage', href: '/dashboard/usage', icon: BarChart3 },
];

const bottomNavItems = [
  { title: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { title: 'Team', href: '/dashboard/team', icon: Users },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
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
        'fixed left-0 top-0 z-40 h-screen bg-midnight-900 border-r border-midnight-800 transition-all duration-150',
        collapsed ? 'w-12' : 'w-52'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="h-11 flex items-center justify-between px-3 border-b border-midnight-800">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent-600 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm text-white tracking-tight">RAGuard</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <div className="w-6 h-6 rounded bg-accent-600 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
          )}
          {!collapsed && (
            <button
              className="p-1 rounded text-midnight-500 hover:text-midnight-300 hover:bg-midnight-800 transition-colors"
              onClick={onToggle}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            className="mx-auto mt-2 p-1 rounded text-midnight-500 hover:text-midnight-300 hover:bg-midnight-800 transition-colors"
            onClick={onToggle}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-1.5">
          {!collapsed && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-midnight-500 px-2.5 py-1.5 mt-1">
              Main
            </div>
          )}
          <div className="space-y-0.5">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <div key={item.href}>
                  <Link href={item.href}>
                    <div
                      className={cn(
                        'flex items-center gap-2 px-2.5 py-1.5 rounded text-[13px] font-medium transition-colors',
                        isActive
                          ? 'bg-midnight-800 text-white'
                          : 'text-midnight-400 hover:bg-midnight-800/50 hover:text-midnight-200'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          isActive ? 'text-accent-400' : 'text-midnight-500'
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-accent-900/60 text-accent-400 border border-accent-700/50">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </Link>
                  {!collapsed && item.children && isActive && (
                    <div className="mt-0.5 ml-6 border-l border-midnight-700 pl-2 space-y-0.5">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link key={child.href} href={child.href}>
                            <div
                              className={cn(
                                'flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors',
                                isChildActive
                                  ? 'text-white font-medium'
                                  : 'text-midnight-500 hover:text-midnight-300'
                              )}
                            >
                              <span className="flex-1">{child.title}</span>
                              {child.badge && (
                                <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-accent-900/60 text-accent-400 border border-accent-700/50">
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
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-1.5 border-t border-midnight-800">
          {!collapsed && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-midnight-500 px-2.5 py-1.5">
              Account
            </div>
          )}
          <div className="space-y-0.5">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-1.5 rounded text-[13px] font-medium transition-colors',
                      isActive
                        ? 'bg-midnight-800 text-white'
                        : 'text-midnight-400 hover:bg-midnight-800/50 hover:text-midnight-200'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-accent-400' : 'text-midnight-500'
                      )}
                    />
                    {!collapsed && <span className="flex-1">{item.title}</span>}
                  </div>
                </Link>
              );
            })}

            {!collapsed && (
              <>
                <div className="h-px bg-midnight-800 my-1" />
                <Link href="/docs" target="_blank">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[13px] font-medium text-midnight-500 hover:bg-midnight-800/50 hover:text-midnight-300 transition-colors">
                    <HelpCircle className="h-4 w-4 text-midnight-600" />
                    <span className="flex-1">Docs</span>
                    <ExternalLink className="h-3 w-3 text-midnight-600" />
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
