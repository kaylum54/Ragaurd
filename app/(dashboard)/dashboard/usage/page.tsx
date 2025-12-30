import { Metadata } from 'next';
import { BarChart3, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { AttackChart } from '@/components/dashboard/AttackChart';

export const metadata: Metadata = {
  title: 'Usage & Analytics',
  description: 'View your usage statistics and analytics',
};

// Mock data
const usage = {
  period: { start: '2024-12-01', end: '2024-12-31' },
  text: { used: 45230, limit: 150000 },
  audio: { used: 12456, limit: 50000 },
  redteam: { used: 234, limit: 1000 },
  blocked: 1247,
  passed: 56685,
  avgLatency: 156,
};

const dailyStats = [
  { day: 'Mon', requests: 8234, blocked: 156 },
  { day: 'Tue', requests: 7891, blocked: 143 },
  { day: 'Wed', requests: 9012, blocked: 189 },
  { day: 'Thu', requests: 8567, blocked: 167 },
  { day: 'Fri', requests: 7234, blocked: 134 },
  { day: 'Sat', requests: 4123, blocked: 78 },
  { day: 'Sun', requests: 3891, blocked: 72 },
];

export default function UsagePage() {
  const textPercent = (usage.text.used / usage.text.limit) * 100;
  const audioPercent = (usage.audio.used / usage.audio.limit) * 100;
  const redteamPercent = (usage.redteam.used / usage.redteam.limit) * 100;
  const blockRate = (usage.blocked / (usage.blocked + usage.passed)) * 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usage & Analytics</h1>
          <p className="text-muted-foreground">
            Monitor your API usage and security metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Dec 1 - Dec 31, 2024
          </Badge>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Usage Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Text Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.text.used.toLocaleString()}
            </div>
            <Progress value={textPercent} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(textPercent)}% of {usage.text.limit.toLocaleString()} limit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Audio Requests
              </CardTitle>
              <Badge variant="outline" className="text-xs">Pro+</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.audio.used.toLocaleString()}
            </div>
            <Progress value={audioPercent} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(audioPercent)}% of {usage.audio.limit.toLocaleString()} limit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Red Team Attacks
              </CardTitle>
              <Badge variant="outline" className="text-xs">Pro+</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.redteam.used.toLocaleString()}
            </div>
            <Progress value={redteamPercent} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(redteamPercent)}% of {usage.redteam.limit.toLocaleString()} limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Requests</div>
            <div className="text-2xl font-bold">
              {(usage.blocked + usage.passed).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Blocked</div>
            <div className="text-2xl font-bold text-danger">
              {usage.blocked.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Block Rate</div>
            <div className="text-2xl font-bold text-primary-600">
              {blockRate.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Avg Latency</div>
            <div className="text-2xl font-bold text-success">
              {usage.avgLatency}ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UsageChart />
        <AttackChart />
      </div>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown (Last 7 Days)</CardTitle>
          <CardDescription>Request volume and blocked threats by day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyStats.map((day) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-12 font-medium">{day.day}</div>
                <div className="flex-1">
                  <div className="flex h-4 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className="bg-success"
                      style={{ width: `${((day.requests - day.blocked) / 10000) * 100}%` }}
                    />
                    <div
                      className="bg-danger"
                      style={{ width: `${(day.blocked / 10000) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground w-24 text-right">
                  {day.requests.toLocaleString()} total
                </div>
                <div className="text-sm text-danger w-20 text-right">
                  {day.blocked} blocked
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
