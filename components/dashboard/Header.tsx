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
  HelpCircle,
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

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-base border-b border-[rgba(59,130,246,0.1)] transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-[260px]'
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side - Mobile menu + Search */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-md text-steel-500 hover:text-steel-100 hover:bg-[rgba(59,130,246,0.1)] transition-all duration-150"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-steel-500" />
            <input
              placeholder="Search..."
              className={cn(
                'input-field pl-9 pr-12 transition-all duration-200',
                searchFocused ? 'w-80' : 'w-64'
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel-500 bg-[rgba(59,130,246,0.1)] px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side - Actions + User */}
        <div className="flex items-center gap-3">
          {/* Plan Badge */}
          <span className="hidden sm:inline-flex gradient-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {user.plan.toUpperCase()}
          </span>

          {/* Help */}
          <Link
            href="/docs"
            className="p-2 rounded-md text-steel-500 hover:text-steel-100 hover:bg-[rgba(59,130,246,0.1)] transition-all duration-150"
          >
            <HelpCircle className="h-5 w-5" />
          </Link>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-md text-steel-500 hover:text-steel-100 hover:bg-[rgba(59,130,246,0.1)] transition-all duration-150">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger animate-pulse" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-card border-[rgba(59,130,246,0.1)]">
              <DropdownMenuLabel className="text-steel-100">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[rgba(59,130,246,0.1)]" />
              <div className="p-4 text-center text-sm text-steel-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No new notifications</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[rgba(59,130,246,0.1)] transition-all duration-150">
                <Avatar className="h-8 w-8 border border-[rgba(59,130,246,0.2)]">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-[rgba(59,130,246,0.2)] text-electric-400 text-sm">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-steel-100">{user.name}</div>
                  <div className="text-xs text-steel-500">{user.orgName}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-steel-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-[rgba(59,130,246,0.1)]">
              <DropdownMenuLabel>
                <div className="font-normal text-steel-500 text-xs">
                  Signed in as
                </div>
                <div className="font-medium text-steel-100">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[rgba(59,130,246,0.1)]" />
              <DropdownMenuItem asChild className="text-steel-400 hover:text-steel-100 hover:bg-[rgba(59,130,246,0.1)] focus:bg-[rgba(59,130,246,0.1)] cursor-pointer">
                <Link href="/dashboard/settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-steel-400 hover:text-steel-100 hover:bg-[rgba(59,130,246,0.1)] focus:bg-[rgba(59,130,246,0.1)] cursor-pointer">
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[rgba(59,130,246,0.1)]" />
              <DropdownMenuItem className="text-danger hover:bg-[rgba(239,68,68,0.1)] focus:bg-[rgba(239,68,68,0.1)] cursor-pointer">
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
