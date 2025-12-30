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
      <div className="bg-white border border-midnight-200 rounded p-3">
        <p className="text-xs font-medium text-midnight-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-midnight-500">{entry.name}:</span>
            <span className="text-midnight-900 tabular-nums font-medium">
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
      <div className="h-[280px] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-midnight-400" />
      </div>
    );
  }

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-midnight-600">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="passed"
            name="Passed"
            stroke="#1E293B"
            strokeWidth={1.5}
            fill="#1E293B"
            fillOpacity={0.1}
          />
          <Area
            type="monotone"
            dataKey="blocked"
            name="Blocked"
            stroke="#15803D"
            strokeWidth={1.5}
            fill="#15803D"
            fillOpacity={0.1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UsageChart() {
  const [activeTab, setActiveTab] = useState('7d');

  return (
    <div className="bg-white rounded border border-midnight-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-medium text-midnight-950">Request Volume</h2>
          <p className="text-xs text-midnight-500 mt-0.5">Daily requests and threat detection</p>
        </div>
        <div className="flex border border-midnight-200 rounded overflow-hidden">
          <button
            className={`px-3 py-1 text-xs font-medium transition-colors ${activeTab === '7d' ? 'bg-midnight-800 text-white' : 'bg-white text-midnight-600 hover:bg-midnight-50'}`}
            onClick={() => setActiveTab('7d')}
          >
            7d
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium transition-colors ${activeTab === '30d' ? 'bg-midnight-800 text-white' : 'bg-white text-midnight-600 hover:bg-midnight-50'}`}
            onClick={() => setActiveTab('30d')}
          >
            30d
          </button>
        </div>
      </div>

      {activeTab === '7d' && <ChartContent days={7} />}
      {activeTab === '30d' && <ChartContent days={30} />}
    </div>
  );
}
