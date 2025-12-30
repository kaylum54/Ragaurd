import { createServiceClient } from '@/lib/supabase/server';
import type { RequestLog, Database } from '@/types/database';

type RequestLogInsert = Database['public']['Tables']['request_log']['Insert'];

export interface LogRequestInput {
  orgId: string;
  apiKeyId?: string;
  requestType: 'text' | 'audio' | 'redteam';
  status: 'blocked' | 'passed' | 'error';
  blockedBy?: string;
  threatCategory?: string;
  latencyMs?: number;
}

export async function logRequest(input: LogRequestInput): Promise<RequestLog | null> {
  const supabase = createServiceClient();

  const insertData: RequestLogInsert = {
    org_id: input.orgId,
    api_key_id: input.apiKeyId,
    request_type: input.requestType,
    status: input.status,
    blocked_by: input.blockedBy,
    threat_category: input.threatCategory,
    latency_ms: input.latencyMs,
  };

  const { data, error } = await supabase
    .from('request_log')
    .insert(insertData as never)
    .select()
    .single();

  if (error) {
    console.error('Error logging request:', error);
    return null;
  }

  return data as RequestLog;
}

export async function getRecentRequests(
  orgId: string,
  limit: number = 50
): Promise<RequestLog[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('request_log')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent requests:', error);
    return [];
  }

  return (data as RequestLog[]) || [];
}

export async function getRequestsByStatus(
  orgId: string,
  status: 'blocked' | 'passed' | 'error',
  limit: number = 100
): Promise<RequestLog[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('request_log')
    .select('*')
    .eq('org_id', orgId)
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching requests by status:', error);
    return [];
  }

  return (data as RequestLog[]) || [];
}

export async function getRequestStats(
  orgId: string,
  hours: number = 24
): Promise<{
  total: number;
  blocked: number;
  passed: number;
  errors: number;
  avgLatencyMs: number;
  threatBreakdown: Record<string, number>;
}> {
  const supabase = createServiceClient();
  const since = new Date();
  since.setHours(since.getHours() - hours);

  const { data, error } = await supabase
    .from('request_log')
    .select('*')
    .eq('org_id', orgId)
    .gte('created_at', since.toISOString());

  if (error || !data) {
    return {
      total: 0,
      blocked: 0,
      passed: 0,
      errors: 0,
      avgLatencyMs: 0,
      threatBreakdown: {},
    };
  }

  const requests = data as RequestLog[];

  const blocked = requests.filter((r) => r.status === 'blocked').length;
  const passed = requests.filter((r) => r.status === 'passed').length;
  const errors = requests.filter((r) => r.status === 'error').length;

  const latencies = requests.filter((r) => r.latency_ms).map((r) => r.latency_ms!);
  const avgLatencyMs = latencies.length > 0
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
    : 0;

  // Count threats by category
  const threatBreakdown: Record<string, number> = {};
  requests
    .filter((r) => r.threat_category)
    .forEach((r) => {
      const cat = r.threat_category!;
      threatBreakdown[cat] = (threatBreakdown[cat] || 0) + 1;
    });

  return {
    total: requests.length,
    blocked,
    passed,
    errors,
    avgLatencyMs,
    threatBreakdown,
  };
}

export async function getThreatCategories(
  orgId: string,
  days: number = 30
): Promise<{ category: string; count: number }[]> {
  const supabase = createServiceClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('request_log')
    .select('threat_category')
    .eq('org_id', orgId)
    .eq('status', 'blocked')
    .gte('created_at', since.toISOString());

  if (error || !data) {
    return [];
  }

  const requests = data as { threat_category: string | null }[];

  // Count by category
  const counts: Record<string, number> = {};
  requests.forEach((r) => {
    if (r.threat_category) {
      counts[r.threat_category] = (counts[r.threat_category] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getBlockedByLayer(
  orgId: string,
  days: number = 30
): Promise<{ layer: string; count: number }[]> {
  const supabase = createServiceClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('request_log')
    .select('blocked_by')
    .eq('org_id', orgId)
    .eq('status', 'blocked')
    .gte('created_at', since.toISOString());

  if (error || !data) {
    return [];
  }

  const requests = data as { blocked_by: string | null }[];

  // Count by layer
  const counts: Record<string, number> = {};
  requests.forEach((r) => {
    if (r.blocked_by) {
      counts[r.blocked_by] = (counts[r.blocked_by] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .map(([layer, count]) => ({ layer, count }))
    .sort((a, b) => b.count - a.count);
}

export async function deleteOldLogs(
  orgId: string,
  retentionDays: number = 90
): Promise<number> {
  const supabase = createServiceClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);

  const { data, error } = await supabase
    .from('request_log')
    .delete()
    .eq('org_id', orgId)
    .lt('created_at', cutoff.toISOString())
    .select('id');

  if (error) {
    console.error('Error deleting old logs:', error);
    return 0;
  }

  return (data as { id: string }[])?.length || 0;
}
