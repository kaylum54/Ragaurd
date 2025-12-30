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
      <div className="bg-elevated border border-[rgba(59,130,246,0.2)] rounded-lg p-3 shadow-card">
        <p className="text-sm font-medium text-steel-100 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-steel-400">{entry.name}:</span>
            <span className="text-steel-100 tabular-nums font-medium">
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
        <Loader2 className="h-8 w-8 animate-spin text-electric-500" />
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`passedGradient${days}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`blockedGradient${days}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-sm text-steel-400">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="passed"
            name="Passed"
            stroke="#3b82f6"
            strokeWidth={2}
            fill={`url(#passedGradient${days})`}
          />
          <Area
            type="monotone"
            dataKey="blocked"
            name="Blocked"
            stroke="#06b6d4"
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
    <div className="dashboard-card">
      <div className="mb-6">
        <h2 className="section-header mb-1">Request Volume</h2>
        <p className="text-sm text-steel-500">Daily requests and threat detection</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.1)]">
          <TabsTrigger
            value="7d"
            className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
          >
            7 days
          </TabsTrigger>
          <TabsTrigger
            value="30d"
            className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
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
