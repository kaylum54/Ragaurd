'use client';

import { Download, Calendar, Loader2, RotateCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { AttackChart } from '@/components/dashboard/AttackChart';
import { useUsageStats, useDailyBreakdown } from '@/hooks/useUsage';

export default function UsagePage() {
  const { stats, loading: statsLoading, refetch } = useUsageStats();
  const { data: dailyStats, loading: dailyLoading } = useDailyBreakdown(7);

  const textPercent = stats.text.limit > 0 ? (stats.text.used / stats.text.limit) * 100 : 0;
  const audioPercent = stats.audio.limit > 0 ? (stats.audio.used / stats.audio.limit) * 100 : 0;
  const redteamPercent = stats.redteam.limit > 0 ? (stats.redteam.used / stats.redteam.limit) * 100 : 0;
  const totalRequests = stats.blocked + stats.passed;
  const blockRate = totalRequests > 0 ? (stats.blocked / totalRequests) * 100 : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
            {formatDate(stats.period.start)} - {formatDate(stats.period.end)}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.text.used.toLocaleString()}
                </div>
                <Progress value={textPercent} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round(textPercent)}% of {stats.text.limit.toLocaleString()} limit
                </p>
              </>
            )}
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
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.audio.used.toLocaleString()}
                </div>
                <Progress value={audioPercent} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round(audioPercent)}% of {stats.audio.limit.toLocaleString()} limit
                </p>
              </>
            )}
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
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.redteam.used.toLocaleString()}
                </div>
                <Progress value={redteamPercent} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round(redteamPercent)}% of {stats.redteam.limit.toLocaleString()} limit
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Requests</div>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-2" />
            ) : (
              <div className="text-2xl font-bold">
                {totalRequests.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Blocked</div>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-2" />
            ) : (
              <div className="text-2xl font-bold text-danger">
                {stats.blocked.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Block Rate</div>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-2" />
            ) : (
              <div className="text-2xl font-bold text-primary-600">
                {blockRate.toFixed(2)}%
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Avg Latency</div>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mt-2" />
            ) : (
              <div className="text-2xl font-bold text-success">
                {stats.avgLatency}ms
              </div>
            )}
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
          {dailyLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {dailyStats.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 font-medium">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex h-4 rounded-full overflow-hidden bg-slate-100">
                      <div
                        className="bg-success transition-all"
                        style={{ width: `${Math.min(((day.requests - day.blocked) / 10000) * 100, 100)}%` }}
                      />
                      <div
                        className="bg-danger transition-all"
                        style={{ width: `${Math.min((day.blocked / 10000) * 100, 100)}%` }}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
