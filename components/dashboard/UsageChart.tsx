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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUsageChart } from '@/hooks/useDashboard';
import { Loader2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-midnight-900 border border-midnight-700 rounded px-2.5 py-2 shadow-lg">
        <p className="text-[10px] font-medium text-midnight-300 mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-[11px]">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-midnight-400">{entry.name}:</span>
            <span className="text-white tabular-nums font-semibold">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
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
      <div className="h-[220px] flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-midnight-400" />
      </div>
    );
  }

  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94A3B8"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '8px' }}
            formatter={(value) => (
              <span className="text-[10px] font-medium text-midnight-600">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="passed"
            name="Passed"
            stroke="#1E293B"
            strokeWidth={1.5}
            fill="#1E293B"
            fillOpacity={0.08}
          />
          <Area
            type="monotone"
            dataKey="blocked"
            name="Blocked"
            stroke="#15803D"
            strokeWidth={1.5}
            fill="#15803D"
            fillOpacity={0.08}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UsageChart() {
  const [activeTab, setActiveTab] = useState('7d');

  return (
    <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60 flex items-center justify-between">
        <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Request Volume</h2>
        <div className="flex border border-midnight-200 rounded overflow-hidden">
          <button
            className={`px-2 py-0.5 text-[10px] font-semibold transition-colors ${activeTab === '7d' ? 'bg-midnight-800 text-white' : 'bg-white text-midnight-500 hover:bg-midnight-50'}`}
            onClick={() => setActiveTab('7d')}
          >
            7D
          </button>
          <button
            className={`px-2 py-0.5 text-[10px] font-semibold transition-colors ${activeTab === '30d' ? 'bg-midnight-800 text-white' : 'bg-white text-midnight-500 hover:bg-midnight-50'}`}
            onClick={() => setActiveTab('30d')}
          >
            30D
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="p-3">
        {activeTab === '7d' && <ChartContent days={7} />}
        {activeTab === '30d' && <ChartContent days={30} />}
      </div>
    </div>
  );
}
