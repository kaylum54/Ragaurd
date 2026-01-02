'use client';

import Link from 'next/link';
import { Key, Target, FileText, Settings, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  {
    title: 'Create API Key',
    description: 'Generate a new key for your application',
    icon: Key,
    href: '/dashboard/api-keys',
    color: 'dash-accent',
  },
  {
    title: 'Run Red Team',
    description: 'Start an automated security scan',
    icon: Target,
    href: '/dashboard/redteam/new',
    badge: 'Pro',
    color: 'dash-danger',
  },
  {
    title: 'View Reports',
    description: 'Download security reports',
    icon: FileText,
    href: '/dashboard/usage',
    color: 'dash-success',
  },
  {
    title: 'Settings',
    description: 'Configure your account',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'dash-info',
  },
];

const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
  'dash-accent': {
    bg: 'bg-dash-accent/10',
    text: 'text-dash-accent',
    hover: 'group-hover:bg-dash-accent/20',
  },
  'dash-danger': {
    bg: 'bg-dash-danger/10',
    text: 'text-dash-danger',
    hover: 'group-hover:bg-dash-danger/20',
  },
  'dash-success': {
    bg: 'bg-dash-success/10',
    text: 'text-dash-success',
    hover: 'group-hover:bg-dash-success/20',
  },
  'dash-info': {
    bg: 'bg-dash-info/10',
    text: 'text-dash-info',
    hover: 'group-hover:bg-dash-info/20',
  },
};

export function QuickActions() {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <span className="dash-card-title">Quick Actions</span>
      </div>
      <div className="dash-card-body">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const colors = colorMap[action.color];
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative p-4 border-2 border-dash-border bg-dash-bg-secondary hover:bg-dash-bg-hover hover:border-dash-border-hover transition-all duration-200"
              >
                {/* Icon */}
                <div
                  className={cn(
                    'h-11 w-11 flex items-center justify-center mb-3 transition-all duration-200 border-2',
                    colors.bg,
                    colors.hover,
                    action.color === 'dash-accent' && 'border-dash-accent/30',
                    action.color === 'dash-danger' && 'border-dash-danger/30',
                    action.color === 'dash-success' && 'border-dash-success/30',
                    action.color === 'dash-info' && 'border-dash-info/30'
                  )}
                >
                  <action.icon className={cn('h-5 w-5', colors.text)} />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-dash-text-primary group-hover:text-white transition-colors">
                        {action.title}
                      </span>
                      {action.badge && (
                        <span className="dash-badge dash-badge-accent text-[9px]">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-dash-text-muted leading-relaxed font-medium">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4 text-dash-text-muted" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
