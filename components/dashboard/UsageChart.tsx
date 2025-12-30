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
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="text-slate-900 tabular-nums font-medium">
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
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`passedGradient${days}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`blockedGradient${days}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-sm text-slate-600">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="passed"
            name="Passed"
            stroke="#7c3aed"
            strokeWidth={2}
            fill={`url(#passedGradient${days})`}
          />
          <Area
            type="monotone"
            dataKey="blocked"
            name="Blocked"
            stroke="#10b981"
            strokeWidth={2}
            fill={`url(#blockedGradient${days})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UsageChart() {
  const [activeTab, setActiveTab] = useState('7d');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Request Volume</h2>
        <p className="text-sm text-slate-500">Daily requests and threat detection</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-slate-100">
          <TabsTrigger
            value="7d"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
          >
            7 days
          </TabsTrigger>
          <TabsTrigger
            value="30d"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
          >
            30 days
          </TabsTrigger>
        </TabsList>

        <TabsContent value="7d">
          <ChartContent days={7} />
        </TabsContent>

        <TabsContent value="30d">
          <ChartContent days={30} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
