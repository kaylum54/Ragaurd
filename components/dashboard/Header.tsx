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

  const planStyles = {
    free: 'bg-midnight-100 text-midnight-700 border-midnight-200',
    pro: 'bg-accent-50 text-accent-700 border-accent-200',
    business: 'bg-secure-50 text-secure-700 border-secure-200',
    enterprise: 'bg-midnight-800 text-white border-midnight-700',
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-14 bg-white border-b border-midnight-200 transition-all duration-200',
        sidebarCollapsed ? 'left-14' : 'left-60'
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* Left side - Mobile menu + Search */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded text-midnight-500 hover:text-midnight-700 hover:bg-midnight-100 transition-colors"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
            <input
              placeholder="Search..."
              className={cn(
                'pl-8 pr-10 py-1.5 text-sm rounded border border-midnight-200 bg-midnight-50 text-midnight-900 placeholder:text-midnight-400',
                'focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:bg-white',
                'transition-all duration-150',
                searchFocused ? 'w-72' : 'w-56'
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-midnight-400 bg-white px-1 py-0.5 rounded border border-midnight-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side - Actions + User */}
        <div className="flex items-center gap-2">
          {/* Plan Badge */}
          <span className={cn(
            'hidden sm:inline-flex items-center text-xs font-medium px-2 py-1 rounded border',
            planStyles[user.plan]
          )}>
            {user.plan.toUpperCase()}
          </span>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-1.5 rounded text-midnight-500 hover:text-midnight-700 hover:bg-midnight-100 transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-critical-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white border-midnight-200">
              <DropdownMenuLabel className="text-midnight-900 text-sm">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-midnight-100" />
              <div className="p-4 text-center">
                <Bell className="h-6 w-6 mx-auto mb-2 text-midnight-300" />
                <p className="text-xs text-midnight-500">No new notifications</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-midnight-100 transition-colors">
                <Avatar className="h-7 w-7 border border-midnight-200">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-midnight-100 text-midnight-700 text-xs font-medium">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-midnight-900">{user.name}</div>
                  <div className="text-xs text-midnight-500">{user.orgName}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-midnight-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-white border-midnight-200">
              <DropdownMenuLabel>
                <div className="text-xs text-midnight-500">
                  Signed in as
                </div>
                <div className="text-sm font-medium text-midnight-900">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-midnight-100" />
              <DropdownMenuItem asChild className="text-midnight-600 hover:text-midnight-900 hover:bg-midnight-50 cursor-pointer text-sm">
                <Link href="/dashboard/settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-midnight-600 hover:text-midnight-900 hover:bg-midnight-50 cursor-pointer text-sm">
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-midnight-100" />
              <DropdownMenuItem className="text-critical-700 hover:text-critical-800 hover:bg-critical-50 cursor-pointer text-sm">
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
