'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Prompt Injection', value: 45, color: '#3b82f6' },
  { name: 'Jailbreak', value: 25, color: '#06b6d4' },
  { name: 'Data Exfiltration', value: 15, color: '#8b5cf6' },
  { name: 'Role Manipulation', value: 10, color: '#10b981' },
  { name: 'Other', value: 5, color: '#64748b' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-elevated border border-[rgba(59,130,246,0.2)] rounded-lg p-3 shadow-card">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <span className="text-sm text-steel-100">{payload[0].name}</span>
        </div>
        <p className="text-lg font-bold text-steel-100 mt-1">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function AttackChart() {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="dashboard-card">
      <div className="mb-6">
        <h2 className="section-header mb-1">Attack Categories</h2>
        <p className="text-sm text-steel-500">Breakdown of blocked threats by type</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative h-[250px] w-[250px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-steel-100">{total}</span>
            <span className="text-xs text-steel-500">Total %</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-steel-300">{entry.name}</span>
              </div>
              <span className="text-sm font-medium text-steel-100 tabular-nums">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
