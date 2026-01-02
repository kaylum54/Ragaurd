'use client';

import Link from 'next/link';
import { Key, Target, FileText, Settings, ChevronRight } from 'lucide-react';

const actions = [
  {
    title: 'Create API Key',
    description: 'Generate new credentials',
    icon: Key,
    href: '/dashboard/api-keys',
  },
  {
    title: 'Run Red Team',
    description: 'Automated security scan',
    icon: Target,
    href: '/dashboard/redteam/new',
    badge: 'Pro',
  },
  {
    title: 'View Reports',
    description: 'Download analytics',
    icon: FileText,
    href: '/dashboard/usage',
  },
  {
    title: 'Settings',
    description: 'Account configuration',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export function QuickActions() {
  return (
    <div className="divide-y divide-slate-100">
      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <action.icon className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">{action.title}</span>
                {action.badge && (
                  <span className="text-[9px] font-bold px-1 py-0.5 bg-slate-700 text-white uppercase">
                    {action.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">{action.description}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </Link>
      ))}
    </div>
  );
}
