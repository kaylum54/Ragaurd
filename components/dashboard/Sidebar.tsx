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
  Mic,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
        'fixed left-0 top-0 z-40 h-screen bg-white border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && <Logo />}
          {collapsed && <Logo showText={false} />}
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', collapsed && 'mx-auto')}
            onClick={onToggle}
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
            />
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <div key={item.href}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
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
                              'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
                              isChildActive
                                ? 'text-primary-700 font-medium'
                                : 'text-slate-500 hover:text-slate-900'
                            )}
                          >
                            <span className="flex-1">{child.title}</span>
                            {child.badge && (
                              <Badge variant="outline" className="text-xs">
                                {child.badge}
                              </Badge>
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
        <div className="p-4 border-t space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="outline" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </Link>
            );
          })}

          {!collapsed && (
            <>
              <Separator className="my-4" />
              <Link href="/docs">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50">
                  <HelpCircle className="h-5 w-5" />
                  <span>Documentation</span>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
