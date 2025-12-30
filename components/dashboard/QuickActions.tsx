import Link from 'next/link';
import { Key, Target, FileText, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start text-left"
              asChild
            >
              <Link href={action.href}>
                <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center mb-2">
                  <action.icon className="h-4 w-4 text-primary-600" />
                </div>
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {action.description}
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
