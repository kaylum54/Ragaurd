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
    <div className="dashboard-card">
      <div className="mb-6">
        <h2 className="section-header mb-1">Quick Actions</h2>
        <p className="text-sm text-steel-500">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group p-4 rounded-lg border border-[rgba(59,130,246,0.1)] bg-[rgba(59,130,246,0.02)] hover:border-[rgba(59,130,246,0.3)] hover:bg-[rgba(59,130,246,0.05)] transition-all duration-150"
          >
            <div className="h-10 w-10 rounded-lg bg-[rgba(59,130,246,0.1)] flex items-center justify-center mb-3 group-hover:bg-[rgba(59,130,246,0.2)] transition-colors">
              <action.icon className="h-5 w-5 text-electric-500" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-steel-100">{action.title}</span>
              {action.badge && (
                <Badge variant="info" className="text-[10px] px-1.5 py-0">
                  {action.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-steel-500">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
