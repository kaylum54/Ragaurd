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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';

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
      { title: 'Audio Defense', href: '/dashboard/defense/audio', badge: 'Pro+' },
    ],
  },
  {
    title: 'Red Team',
    href: '/dashboard/redteam',
    icon: Target,
    badge: 'Pro+',
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
    badge: 'Starter+',
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
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-[rgba(59,130,246,0.1)] transition-all duration-300',
        collapsed ? 'w-16' : 'w-[260px]'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo with glow effect */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[rgba(59,130,246,0.1)]">
          {!collapsed && (
            <div className="animate-pulse-glow rounded-lg p-1">
              <Logo variant="light" />
            </div>
          )}
          {collapsed && (
            <div className="mx-auto animate-pulse-glow rounded-lg p-1">
              <Logo showText={false} variant="light" />
            </div>
          )}
          <button
            className={cn(
              'p-1.5 rounded-md text-steel-500 hover:text-steel-100 hover:bg-[rgba(59,130,246,0.1)] transition-all duration-150',
              collapsed && 'mx-auto'
            )}
            onClick={onToggle}
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
            />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="nav-divider">Main</div>
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <div key={item.href}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      'nav-item',
                      isActive && 'active'
                    )}
                  >
                    <item.icon className="nav-icon" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-sm">{item.title}</span>
                        {item.badge && (
                          <span className="badge-info text-[10px] px-1.5 py-0.5">
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
                              'flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-all duration-150',
                              isChildActive
                                ? 'text-electric-500 font-medium'
                                : 'text-steel-500 hover:text-steel-100'
                            )}
                          >
                            <span className="flex-1">{child.title}</span>
                            {child.badge && (
                              <span className="badge-info text-[10px] px-1.5 py-0.5">
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
        <div className="p-3 border-t border-[rgba(59,130,246,0.1)] space-y-1">
          <div className="nav-divider">Account</div>
          {bottomNavItems.map((item) => {
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
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm">{item.title}</span>
                      {item.badge && (
                        <span className="badge-info text-[10px] px-1.5 py-0.5">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </Link>
            );
          })}

          {!collapsed && (
            <>
              <div className="separator my-3" />
              <Link href="/docs">
                <div className="nav-item">
                  <HelpCircle className="nav-icon" />
                  <span className="text-sm">Documentation</span>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
