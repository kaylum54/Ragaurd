'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useThreatCategories } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';

// Muted, enterprise colors
const COLORS = ['#1E293B', '#475569', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0'];

const categoryLabels: Record<string, string> = {
  prompt_injection: 'Prompt Injection',
  jailbreak: 'Jailbreak',
  data_exfiltration: 'Data Exfiltration',
  role_manipulation: 'Role Manipulation',
  code_injection: 'Code Injection',
  security_bypass: 'Security Bypass',
  privilege_escalation: 'Privilege Escalation',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-midnight-200 rounded p-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <span className="text-xs text-midnight-900">{payload[0].name}</span>
        </div>
        <p className="text-sm font-semibold text-midnight-900 mt-1">{payload[0].value} blocked</p>
      </div>
    );
  }
  return null;
};

export function AttackChart() {
  const { data: threatData, loading } = useThreatCategories();

  // Transform data for the chart
  const chartData = threatData.slice(0, 5).map((item, index) => ({
    name: categoryLabels[item.category] || item.category.replace(/_/g, ' '),
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  // Add "Other" category if there are more than 5 categories
  if (threatData.length > 5) {
    const otherCount = threatData.slice(5).reduce((sum, item) => sum + item.count, 0);
    chartData.push({
      name: 'Other',
      value: otherCount,
      color: COLORS[5],
    });
  }

  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  if (loading) {
    return (
      <div className="bg-white rounded border border-midnight-200 p-5">
        <div className="mb-5">
          <h2 className="text-base font-medium text-midnight-950">Threat Categories</h2>
          <p className="text-xs text-midnight-500 mt-0.5">Blocked threats by type</p>
        </div>
        <div className="h-[230px] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-midnight-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded border border-midnight-200 p-5">
      <div className="mb-5">
        <h2 className="text-base font-medium text-midnight-950">Threat Categories</h2>
        <p className="text-xs text-midnight-500 mt-0.5">Blocked threats by type</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative h-[200px] w-[200px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={1}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-semibold text-midnight-950 tabular-nums">{total}</span>
            <span className="text-xs text-midnight-500 uppercase tracking-wide">Blocked</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-midnight-600">{entry.name}</span>
              </div>
              <span className="text-xs font-medium text-midnight-900 tabular-nums">
                {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
