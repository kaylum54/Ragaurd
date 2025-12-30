'use client';

import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaywallGateProps {
  feature: 'audio' | 'redteam' | 'team' | 'advancedReports';
  requiredPlan: string;
  children: React.ReactNode;
  currentPlan?: string;
}

const featureNames: Record<string, string> = {
  audio: 'Audio Defense',
  redteam: 'Red Team Testing',
  team: 'Team Management',
  advancedReports: 'Advanced Reports',
};

const planAccess: Record<string, string[]> = {
  audio: ['pro', 'business', 'enterprise'],
  redteam: ['pro', 'business', 'enterprise'],
  team: ['starter', 'pro', 'business', 'enterprise'],
  advancedReports: ['business', 'enterprise'],
};

export function PaywallGate({
  feature,
  requiredPlan,
  children,
  currentPlan = 'free',
}: PaywallGateProps) {
  const hasAccess = planAccess[feature]?.includes(currentPlan);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Upgrade to {requiredPlan}
        </h3>
        <p className="text-slate-600 mb-6">
          {featureNames[feature]} requires the {requiredPlan} plan or higher.
          Upgrade to unlock this feature and more.
        </p>
        <Button asChild>
          <Link href="/dashboard/billing">
            Upgrade Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
