import Link from 'next/link';
import { Key, Target, FileText, Settings } from 'lucide-react';

const actions = [
  {
    title: 'Create API Key',
    description: 'Generate a new key',
    icon: Key,
    href: '/dashboard/api-keys',
  },
  {
    title: 'Run Red Team',
    description: 'Start security scan',
    icon: Target,
    href: '/dashboard/redteam/new',
    badge: 'Pro',
  },
  {
    title: 'View Reports',
    description: 'Download reports',
    icon: FileText,
    href: '/dashboard/usage',
  },
  {
    title: 'Settings',
    description: 'Configure account',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60">
        <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Quick Actions</h2>
      </div>
      {/* Body */}
      <div className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group p-2.5 rounded border border-midnight-200 bg-midnight-50/50 hover:bg-midnight-100/50 hover:border-midnight-300 transition-colors"
            >
              <div className="h-7 w-7 rounded bg-midnight-200 flex items-center justify-center mb-1.5 group-hover:bg-midnight-300 transition-colors">
                <action.icon className="h-3.5 w-3.5 text-midnight-700" />
              </div>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="font-semibold text-[11px] text-midnight-900">{action.title}</span>
                {action.badge && (
                  <span className="text-[9px] font-bold px-1 py-0 bg-accent-600 text-white rounded">
                    {action.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-midnight-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
