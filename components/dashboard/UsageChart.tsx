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
  Legend,
} from 'recharts';
import { useUsageChart } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dash-bg-tertiary border-2 border-dash-border px-4 py-3 shadow-dash-lg">
        <p className="text-xs font-bold text-dash-text-secondary mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-dash-text-muted font-medium">{entry.name}:</span>
            <span className="text-dash-text-primary tabular-nums font-bold">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex items-center justify-center gap-6 pt-3">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

function ChartContent({ days }: { days: number }) {
  const { data, loading } = useUsageChart(days);

  // Transform data for the chart
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    passed: d.requests - d.blocked,
    blocked: d.blocked,
    requests: d.requests,
  }));

  if (loading) {
    return (
      <div className="h-[260px] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
      </div>
    );
  }

  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="passedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tick={{ fill: '#64748b' }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={40}
            tick={{ fill: '#64748b' }}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Area
            type="monotone"
            dataKey="passed"
            name="Passed"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#passedGradient)"
          />
          <Area
            type="monotone"
            dataKey="blocked"
            name="Blocked"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#blockedGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UsageChart() {
  const [activeTab, setActiveTab] = useState('7d');

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <span className="dash-card-title">Request Volume</span>
        <div className="flex overflow-hidden border-2 border-dash-border">
          <button
            className={cn(
              'px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors',
              activeTab === '7d'
                ? 'bg-dash-accent text-white'
                : 'bg-transparent text-dash-text-muted hover:text-dash-text-secondary hover:bg-dash-bg-hover'
            )}
            onClick={() => setActiveTab('7d')}
          >
            7D
          </button>
          <button
            className={cn(
              'px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border-l-2 border-dash-border',
              activeTab === '30d'
                ? 'bg-dash-accent text-white'
                : 'bg-transparent text-dash-text-muted hover:text-dash-text-secondary hover:bg-dash-bg-hover'
            )}
            onClick={() => setActiveTab('30d')}
          >
            30D
          </button>
        </div>
      </div>
      <div className="dash-card-body">
        {activeTab === '7d' && <ChartContent days={7} />}
        {activeTab === '30d' && <ChartContent days={30} />}
      </div>
    </div>
  );
}
