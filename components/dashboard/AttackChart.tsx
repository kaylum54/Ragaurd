'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useThreatCategories } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';

const COLORS = ['#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

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
      <div className="bg-slate-800 border border-slate-700 px-3 py-2 text-white">
        <p className="text-xs font-medium">{payload[0].name}</p>
        <p className="text-[10px] text-slate-300 tabular-nums">
          {payload[0].value} blocked ({payload[0].payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export function AttackChart() {
  const { data: threatData, loading } = useThreatCategories();

  const total = threatData.reduce((sum, item) => sum + item.count, 0);

  const chartData = threatData.slice(0, 5).map((item, index) => ({
    name: categoryLabels[item.category] || item.category.replace(/_/g, ' '),
    value: item.count,
    color: COLORS[index % COLORS.length],
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
  }));

  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-[180px] w-[180px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={1}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xl font-bold text-slate-900 tabular-nums">{total}</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">Total</span>
        </div>
      </div>

      <div className="flex-1 space-y-0.5 pt-2">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-slate-600">{entry.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-800 tabular-nums">{entry.value}</span>
              <span className="text-[10px] text-slate-400 tabular-nums w-8 text-right">{entry.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
