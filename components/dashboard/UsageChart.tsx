'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useUsageChart } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 px-3 py-2 text-white">
        <p className="text-[10px] font-medium text-slate-400 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-300">{entry.name}:</span>
            <span className="font-semibold tabular-nums">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function ChartContent({ days }: { days: number }) {
  const { data, loading } = useUsageChart(days);

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    passed: d.requests - d.blocked,
    blocked: d.blocked,
  }));

  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="passed"
            name="Passed"
            stroke="#475569"
            strokeWidth={1.5}
            fill="#f1f5f9"
          />
          <Area
            type="monotone"
            dataKey="blocked"
            name="Blocked"
            stroke="#2563eb"
            strokeWidth={1.5}
            fill="#dbeafe"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UsageChart() {
  const [activeTab, setActiveTab] = useState('7d');

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button
          className={cn(
            'px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors',
            activeTab === '7d'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          )}
          onClick={() => setActiveTab('7d')}
        >
          7 Days
        </button>
        <button
          className={cn(
            'px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors',
            activeTab === '30d'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          )}
          onClick={() => setActiveTab('30d')}
        >
          30 Days
        </button>
      </div>
      <div className="flex items-center gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-slate-500" />
          <span className="text-slate-500">Passed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-blue-600" />
          <span className="text-slate-500">Blocked</span>
        </div>
      </div>
      {activeTab === '7d' && <ChartContent days={7} />}
      {activeTab === '30d' && <ChartContent days={30} />}
    </div>
  );
}
