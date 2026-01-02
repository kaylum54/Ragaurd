import { createServiceClient } from '@/lib/supabase/server';
import type { UsageDaily, Database } from '@/types/database';
import type { UsageStats, UsageLimits } from '@/types/api';

type UsageDailyInsert = Database['public']['Tables']['usage_daily']['Insert'];

export interface UsageLimitCheck {
  allowed: boolean;
  reason?: string;
  current: number;
  limit: number | null;
  percentage: number;
}

/**
 * Check if an organization has exceeded their usage limit for a specific type
 * Returns { allowed: true } if within limits, or { allowed: false, reason: string } if exceeded
 */
interface PlanLimitsRecord {
  plan: string;
  text_requests_monthly: number | null;
  audio_requests_monthly: number | null;
  redteam_attacks_monthly: number | null;
  audio_enabled: boolean;
  redteam_enabled: boolean;
}

export async function checkUsageLimit(
  orgId: string,
  plan: string,
  type: 'text' | 'audio' | 'redteam'
): Promise<UsageLimitCheck> {
  const supabase = createServiceClient();

  // Get plan limits
  const { data } = await supabase
    .from('plan_limits')
    .select('*')
    .eq('plan', plan)
    .single();

  const planLimits = data as PlanLimitsRecord | null;

  if (!planLimits) {
    // If no plan found, allow (fail open for now)
    return { allowed: true, current: 0, limit: null, percentage: 0 };
  }

  // Get current month usage
  const currentUsage = await getCurrentMonthUsage(orgId);

  let current: number;
  let limit: number | null;
  let limitName: string;

  switch (type) {
    case 'text':
      current = currentUsage.text_requests;
      limit = planLimits.text_requests_monthly;
      limitName = 'text requests';
      break;
    case 'audio':
      current = currentUsage.audio_requests;
      limit = planLimits.audio_requests_monthly;
      limitName = 'audio requests';
      // Also check if audio is enabled for this plan
      if (!planLimits.audio_enabled) {
        return {
          allowed: false,
          reason: 'Audio defense is not available on your current plan. Please upgrade to Pro or higher.',
          current: 0,
          limit: 0,
          percentage: 100,
        };
      }
      break;
    case 'redteam':
      current = currentUsage.redteam_attacks;
      limit = planLimits.redteam_attacks_monthly;
      limitName = 'red team attacks';
      // Also check if redteam is enabled for this plan
      if (!planLimits.redteam_enabled) {
        return {
          allowed: false,
          reason: 'Red team testing is not available on your current plan. Please upgrade to Pro or higher.',
          current: 0,
          limit: 0,
          percentage: 100,
        };
      }
      break;
    default:
      return { allowed: true, current: 0, limit: null, percentage: 0 };
  }

  // null limit means unlimited
  if (limit === null) {
    return { allowed: true, current, limit: null, percentage: 0 };
  }

  const percentage = Math.round((current / limit) * 100);

  if (current >= limit) {
    return {
      allowed: false,
      reason: `Monthly ${limitName} limit exceeded (${current.toLocaleString()}/${limit.toLocaleString()}). Please upgrade your plan.`,
      current,
      limit,
      percentage: 100,
    };
  }

  return { allowed: true, current, limit, percentage };
}

/**
 * Get the organization's plan from the database
 */
export async function getOrgPlan(orgId: string): Promise<string> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from('organizations')
    .select('plan')
    .eq('id', orgId)
    .single();

  const org = data as { plan: string } | null;
  return org?.plan || 'free';
}

export async function getUsageForPeriod(
  orgId: string,
  startDate: string,
  endDate: string
): Promise<UsageDaily[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('usage_daily')
    .select('*')
    .eq('org_id', orgId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching usage:', error);
    return [];
  }

  return (data as UsageDaily[]) || [];
}

export async function getUsageStats(
  orgId: string,
  days: number = 30
): Promise<UsageStats> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const usage = await getUsageForPeriod(
    orgId,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  // Aggregate totals
  const totals = usage.reduce(
    (acc, day) => ({
      text_requests: acc.text_requests + day.text_requests,
      audio_requests: acc.audio_requests + day.audio_requests,
      redteam_attacks: acc.redteam_attacks + day.redteam_attacks,
      blocked_count: acc.blocked_count + day.blocked_count,
      total_latency: acc.total_latency + (day.avg_latency_ms || 0) * day.text_requests,
      total_requests: acc.total_requests + day.text_requests,
    }),
    {
      text_requests: 0,
      audio_requests: 0,
      redteam_attacks: 0,
      blocked_count: 0,
      total_latency: 0,
      total_requests: 0,
    }
  );

  const totalRequests = totals.text_requests + totals.audio_requests;
  const blockRate = totalRequests > 0 ? totals.blocked_count / totalRequests : 0;
  const avgLatency = totals.total_requests > 0 ? totals.total_latency / totals.total_requests : 0;

  return {
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
    text_requests: totals.text_requests,
    audio_requests: totals.audio_requests,
    redteam_attacks: totals.redteam_attacks,
    blocked_count: totals.blocked_count,
    block_rate: Math.round(blockRate * 100) / 100,
    avg_latency_ms: Math.round(avgLatency),
    daily: usage.map((day) => ({
      date: day.date,
      text_requests: day.text_requests,
      audio_requests: day.audio_requests,
      blocked_count: day.blocked_count,
    })),
  };
}

export async function getCurrentMonthUsage(orgId: string): Promise<{
  text_requests: number;
  audio_requests: number;
  redteam_attacks: number;
}> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const usage = await getUsageForPeriod(
    orgId,
    startOfMonth.toISOString().split('T')[0],
    now.toISOString().split('T')[0]
  );

  return usage.reduce(
    (acc, day) => ({
      text_requests: acc.text_requests + day.text_requests,
      audio_requests: acc.audio_requests + day.audio_requests,
      redteam_attacks: acc.redteam_attacks + day.redteam_attacks,
    }),
    { text_requests: 0, audio_requests: 0, redteam_attacks: 0 }
  );
}

interface PlanLimitsRow {
  text_requests_monthly: number | null;
  audio_requests_monthly: number | null;
  redteam_attacks_monthly: number | null;
  max_api_keys: number | null;
  max_team_members: number | null;
}

export async function getUsageLimits(
  orgId: string,
  plan: string
): Promise<UsageLimits> {
  const supabase = createServiceClient();

  // Get plan limits
  const { data: planLimits } = await supabase
    .from('plan_limits')
    .select('*')
    .eq('plan', plan)
    .single();

  const limits = planLimits as PlanLimitsRow | null;

  // Get current usage
  const currentUsage = await getCurrentMonthUsage(orgId);

  // Get API key count
  const { count: apiKeyCount } = await supabase
    .from('api_keys')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('is_active', true);

  // Get team member count
  const { count: memberCount } = await supabase
    .from('org_members')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId);

  const textLimit = limits?.text_requests_monthly ?? null;
  const audioLimit = limits?.audio_requests_monthly ?? null;
  const redteamLimit = limits?.redteam_attacks_monthly ?? null;
  const apiKeyLimit = limits?.max_api_keys ?? null;
  const memberLimit = limits?.max_team_members ?? null;

  return {
    text_requests: {
      used: currentUsage.text_requests,
      limit: textLimit,
      percentage: textLimit ? Math.round((currentUsage.text_requests / textLimit) * 100) : 0,
    },
    audio_requests: {
      used: currentUsage.audio_requests,
      limit: audioLimit,
      percentage: audioLimit ? Math.round((currentUsage.audio_requests / audioLimit) * 100) : 0,
    },
    redteam_attacks: {
      used: currentUsage.redteam_attacks,
      limit: redteamLimit,
      percentage: redteamLimit ? Math.round((currentUsage.redteam_attacks / redteamLimit) * 100) : 0,
    },
    api_keys: {
      used: apiKeyCount || 0,
      limit: apiKeyLimit,
    },
    team_members: {
      used: memberCount || 0,
      limit: memberLimit,
    },
  };
}

export async function incrementDailyUsage(
  orgId: string,
  type: 'text' | 'audio' | 'redteam',
  blocked: boolean,
  latencyMs?: number
): Promise<void> {
  const supabase = createServiceClient();
  const today = new Date().toISOString().split('T')[0];

  // Try to get existing record for today
  const { data: existing } = await supabase
    .from('usage_daily')
    .select('*')
    .eq('org_id', orgId)
    .eq('date', today)
    .single();

  const existingData = existing as UsageDaily | null;

  if (existingData) {
    // Update existing record
    const updates: Partial<UsageDailyInsert> = {
      blocked_count: existingData.blocked_count + (blocked ? 1 : 0),
    };

    if (type === 'text') {
      updates.text_requests = existingData.text_requests + 1;
      if (latencyMs) {
        // Calculate new average latency
        const totalLatency = (existingData.avg_latency_ms || 0) * existingData.text_requests + latencyMs;
        updates.avg_latency_ms = Math.round(totalLatency / (existingData.text_requests + 1));
      }
    } else if (type === 'audio') {
      updates.audio_requests = existingData.audio_requests + 1;
    } else if (type === 'redteam') {
      updates.redteam_attacks = existingData.redteam_attacks + 1;
    }

    await supabase
      .from('usage_daily')
      .update(updates as never)
      .eq('id', existingData.id);
  } else {
    // Create new record for today
    const insertData: UsageDailyInsert = {
      org_id: orgId,
      date: today,
      text_requests: type === 'text' ? 1 : 0,
      audio_requests: type === 'audio' ? 1 : 0,
      redteam_attacks: type === 'redteam' ? 1 : 0,
      blocked_count: blocked ? 1 : 0,
      avg_latency_ms: type === 'text' ? latencyMs : null,
    };

    await supabase.from('usage_daily').insert(insertData as never);
  }
}

export async function getDailyUsageChart(
  orgId: string,
  days: number = 7
): Promise<{ date: string; requests: number; blocked: number }[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const usage = await getUsageForPeriod(
    orgId,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  // Fill in missing days with zeros
  const result: { date: string; requests: number; blocked: number }[] = [];
  const usageMap = new Map(usage.map((u) => [u.date, u]));

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const dayUsage = usageMap.get(dateStr);
    result.push({
      date: dateStr,
      requests: dayUsage ? dayUsage.text_requests + dayUsage.audio_requests : 0,
      blocked: dayUsage?.blocked_count || 0,
    });
  }

  return result;
}
