'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useThreatCategories } from '@/hooks/useDashboard';
import { Loader2, Shield } from 'lucide-react';

// Dark theme colors - vibrant against dark background
const COLORS = [
  '#ef4444', // Red - most critical
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
];

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
    const percentage = payload[0].payload.percentage;
    return (
      <div className="bg-dash-bg-tertiary border-2 border-dash-border px-4 py-3 shadow-dash-lg">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3"
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <span className="text-sm font-bold text-dash-text-primary">{payload[0].name}</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-dash-text-muted font-medium">
            <span className="font-bold text-dash-text-primary tabular-nums">{payload[0].value}</span> blocked
          </span>
          <span className="text-dash-text-muted font-medium">
            <span className="font-bold text-dash-text-primary tabular-nums">{percentage}%</span> of total
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function AttackChart() {
  const { data: threatData, loading } = useThreatCategories();

  // Transform data for the chart
  const total = threatData.reduce((sum, item) => sum + item.count, 0);

  const chartData = threatData.slice(0, 5).map((item, index) => ({
    name: categoryLabels[item.category] || item.category.replace(/_/g, ' '),
    value: item.count,
    color: COLORS[index % COLORS.length],
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
  }));

  // Add "Other" category if there are more than 5 categories
  if (threatData.length > 5) {
    const otherCount = threatData.slice(5).reduce((sum, item) => sum + item.count, 0);
    chartData.push({
      name: 'Other',
      value: otherCount,
      color: COLORS[5],
      percentage: total > 0 ? Math.round((otherCount / total) * 100) : 0,
    });
  }

  if (loading) {
    return (
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Threat Categories</span>
        </div>
        <div className="h-[260px] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <span className="dash-card-title">Threat Categories</span>
        <span className="dash-badge dash-badge-danger">
          {total} blocked
        </span>
      </div>
      <div className="dash-card-body">
        <div className="flex items-center gap-6">
          {/* Pie Chart */}
          <div className="relative h-[220px] w-[220px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-opacity hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="p-2 bg-dash-danger/10 border-2 border-dash-danger/30 mb-1">
                <Shield className="h-5 w-5 text-dash-danger" />
              </div>
              <span className="text-2xl font-extrabold text-dash-text-primary tabular-nums">{total}</span>
              <span className="text-[10px] text-dash-text-muted uppercase tracking-[0.15em] font-bold">Blocked</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1">
            {chartData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between p-2 hover:bg-dash-bg-hover transition-colors group border-l-2 border-transparent hover:border-dash-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-dash-text-secondary group-hover:text-dash-text-primary transition-colors">
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-dash-text-primary tabular-nums">
                    {entry.value}
                  </span>
                  <span className="text-xs font-bold text-dash-text-muted tabular-nums w-10 text-right">
                    {entry.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
