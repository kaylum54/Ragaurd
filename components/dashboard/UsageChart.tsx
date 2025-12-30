'use client';

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

// Mock data for the chart
const generateMockData = (days: number) => {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const baseRequests = 1000 + Math.random() * 500;
    const blocked = Math.floor(baseRequests * (0.02 + Math.random() * 0.03));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      requests: Math.floor(baseRequests),
      blocked: blocked,
      passed: Math.floor(baseRequests - blocked),
    });
  }

  return data;
};

const data7d = generateMockData(7);
const data30d = generateMockData(30);

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

export function UsageChart() {
  return (
    <div className="dashboard-card">
      <div className="mb-6">
        <h2 className="section-header mb-1">Request Volume</h2>
        <p className="text-sm text-steel-500">Daily requests and threat detection</p>
      </div>
      <Tabs defaultValue="7d">
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
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data7d}>
                <defs>
                  <linearGradient id="passedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#passedGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  name="Blocked"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#blockedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="30d">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data30d}>
                <defs>
                  <linearGradient id="passedGradient30" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blockedGradient30" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#passedGradient30)"
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  name="Blocked"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#blockedGradient30)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
