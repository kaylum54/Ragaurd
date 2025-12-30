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
    <div className="bg-white rounded border border-midnight-200 p-5">
      <div className="mb-5">
        <h2 className="text-base font-medium text-midnight-950">Quick Actions</h2>
        <p className="text-xs text-midnight-500 mt-0.5">Common tasks</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group p-3 rounded border border-midnight-200 bg-midnight-50 hover:border-midnight-300 transition-colors"
          >
            <div className="h-8 w-8 rounded bg-midnight-200 flex items-center justify-center mb-2 group-hover:bg-midnight-300 transition-colors">
              <action.icon className="h-4 w-4 text-midnight-700" />
            </div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-medium text-xs text-midnight-900">{action.title}</span>
              {action.badge && (
                <span className="text-[10px] px-1 py-0 bg-accent-50 text-accent-700 border border-accent-200 rounded">
                  {action.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-midnight-500">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
