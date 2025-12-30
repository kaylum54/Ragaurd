'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useThreatCategories } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';

const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#64748b'];

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
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <span className="text-sm text-slate-900">{payload[0].name}</span>
        </div>
        <p className="text-lg font-bold text-slate-900 mt-1">{payload[0].value} blocked</p>
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
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Attack Categories</h2>
          <p className="text-sm text-slate-500">Breakdown of blocked threats by type</p>
        </div>
        <div className="h-[250px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Attack Categories</h2>
        <p className="text-sm text-slate-500">Breakdown of blocked threats by type</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative h-[250px] w-[250px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
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
            <span className="text-3xl font-bold text-slate-900">{total}</span>
            <span className="text-xs text-slate-500">Blocked</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-slate-600">{entry.name}</span>
              </div>
              <span className="text-sm font-medium text-slate-900 tabular-nums">
                {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
