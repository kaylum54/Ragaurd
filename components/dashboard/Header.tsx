'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Menu,
  Shield,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  onMenuClick?: () => void;
}

export function Header({ sidebarCollapsed, onMenuClick }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    plan: 'pro' as const,
    orgName: 'Acme Inc.',
  };

  const planColors = {
    free: 'bg-slate-100 text-slate-700',
    pro: 'bg-violet-100 text-violet-700',
    business: 'bg-emerald-100 text-emerald-700',
    enterprise: 'bg-amber-100 text-amber-700',
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-white border-b border-slate-200 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side - Mobile menu + Search */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search..."
              className={cn(
                'pl-10 pr-12 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400',
                'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:bg-white',
                'transition-all duration-200',
                searchFocused ? 'w-80' : 'w-64'
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side - Actions + User */}
        <div className="flex items-center gap-3">
          {/* Plan Badge */}
          <span className={cn(
            'hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
            planColors[user.plan]
          )}>
            <Shield className="w-3 h-3" />
            {user.plan.toUpperCase()}
          </span>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white border-slate-200 shadow-lg">
              <DropdownMenuLabel className="text-slate-900">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <div className="p-6 text-center">
                <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm text-slate-500">No new notifications</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-150">
                <Avatar className="h-8 w-8 border-2 border-slate-200">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-violet-100 text-violet-700 text-sm font-medium">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.orgName}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 shadow-lg">
              <DropdownMenuLabel>
                <div className="text-xs text-slate-500">
                  Signed in as
                </div>
                <div className="font-medium text-slate-900">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem asChild className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer">
                <Link href="/dashboard/settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer">
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
