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
    free: 'bg-midnight-100 text-midnight-600 border-midnight-300',
    pro: 'bg-accent-600 text-white border-accent-700',
    business: 'bg-secure-600 text-white border-secure-700',
    enterprise: 'bg-midnight-900 text-white border-midnight-800',
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-11 bg-white border-b border-midnight-300/60 transition-all duration-150',
        sidebarCollapsed ? 'left-12' : 'left-52'
      )}
    >
      <div className="flex h-full items-center justify-between px-3">
        {/* Left side - Mobile menu + Search */}
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden p-1 rounded text-midnight-500 hover:text-midnight-700 hover:bg-midnight-100 transition-colors"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-midnight-400" />
            <input
              placeholder="Search..."
              className={cn(
                'pl-7 pr-8 py-1 text-xs rounded border border-midnight-200 bg-midnight-50 text-midnight-900 placeholder:text-midnight-400',
                'focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 focus:bg-white',
                'transition-all duration-150',
                searchFocused ? 'w-64' : 'w-48'
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-midnight-400 bg-white px-1 py-0.5 rounded border border-midnight-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side - Actions + User */}
        <div className="flex items-center gap-1.5">
          {/* Plan Badge */}
          <span className={cn(
            'hidden sm:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border',
            planStyles[user.plan]
          )}>
            {user.plan.toUpperCase()}
          </span>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-1 rounded text-midnight-500 hover:text-midnight-700 hover:bg-midnight-100 transition-colors">
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-critical-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border-midnight-200">
              <DropdownMenuLabel className="text-midnight-900 text-xs font-medium">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-midnight-100" />
              <div className="p-3 text-center">
                <Bell className="h-5 w-5 mx-auto mb-1.5 text-midnight-300" />
                <p className="text-xs text-midnight-500">No new notifications</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-midnight-100 transition-colors">
                <Avatar className="h-6 w-6 border border-midnight-200">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-midnight-100 text-midnight-700 text-[10px] font-medium">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium text-midnight-900 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-midnight-500 leading-tight">{user.orgName}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-midnight-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-midnight-200">
              <DropdownMenuLabel className="py-1.5">
                <div className="text-[10px] text-midnight-500">
                  Signed in as
                </div>
                <div className="text-xs font-medium text-midnight-900">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-midnight-100" />
              <DropdownMenuItem asChild className="text-midnight-600 hover:text-midnight-900 hover:bg-midnight-50 cursor-pointer text-xs py-1.5">
                <Link href="/dashboard/settings">
                  <User className="mr-2 h-3.5 w-3.5" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-midnight-600 hover:text-midnight-900 hover:bg-midnight-50 cursor-pointer text-xs py-1.5">
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-midnight-100" />
              <DropdownMenuItem className="text-critical-700 hover:text-critical-800 hover:bg-critical-50 cursor-pointer text-xs py-1.5">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
