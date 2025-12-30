import Link from 'next/link';
import { Key, Target, FileText, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const actions = [
  {
    title: 'Create API Key',
    description: 'Generate a new API key',
    icon: Key,
    href: '/dashboard/api-keys',
  },
  {
    title: 'Run Red Team',
    description: 'Start a security scan',
    icon: Target,
    href: '/dashboard/redteam/new',
    badge: 'Pro+',
  },
  {
    title: 'View Reports',
    description: 'Download security reports',
    icon: FileText,
    href: '/dashboard/usage',
  },
  {
    title: 'Settings',
    description: 'Configure your account',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Quick Actions</h2>
        <p className="text-sm text-slate-500">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group p-4 rounded-lg border border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50 transition-all duration-150"
          >
            <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center mb-3 group-hover:bg-violet-200 transition-colors">
              <action.icon className="h-5 w-5 text-violet-600" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-slate-900">{action.title}</span>
              {action.badge && (
                <Badge className="text-[10px] px-1.5 py-0 bg-violet-100 text-violet-700 hover:bg-violet-100">
                  {action.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
