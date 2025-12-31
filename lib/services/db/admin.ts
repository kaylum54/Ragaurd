import { createServiceClient } from '@/lib/supabase/server';
import type { User, Organization, UsageDaily } from '@/types/database';

/**
 * Sanitize search input to prevent SQL injection in ILIKE patterns
 * Escapes special PostgreSQL LIKE/ILIKE characters: % _ \
 */
function sanitizeSearchInput(search: string): string {
  // Limit length to prevent DoS
  const trimmed = search.slice(0, 100);
  // Escape special LIKE pattern characters
  return trimmed
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/%/g, '\\%')    // Escape percent signs
    .replace(/_/g, '\\_');   // Escape underscores
}

// Platform-wide stats for admin dashboard
export interface PlatformStats {
  totalUsers: number;
  totalOrgs: number;
  activeSubscriptions: number;
  mrr: number; // Monthly Recurring Revenue in cents
  totalRequests: number;
  blockedThreats: number;
  newUsersToday: number;
  newOrgsToday: number;
}

export interface UserWithOrg extends User {
  organizations?: { name: string; plan: string }[];
}

export interface OrgWithStats extends Organization {
  memberCount?: number;
  totalRequests?: number;
}

// Get all platform stats
export async function getPlatformStats(): Promise<PlatformStats> {
  const supabase = createServiceClient();
  const today = new Date().toISOString().split('T')[0];

  // Get total users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // Get total organizations
  const { count: totalOrgs } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true });

  // Get active subscriptions (orgs with paid plans)
  const { count: activeSubscriptions } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .in('plan', ['starter', 'pro', 'business', 'enterprise']);

  // Calculate MRR from plan_limits
  const { data: orgsWithPlans } = await supabase
    .from('organizations')
    .select('plan')
    .in('plan', ['starter', 'pro', 'business', 'enterprise']);

  const { data: planPrices } = await supabase
    .from('plan_limits')
    .select('plan, price_monthly');

  const priceMap = new Map(
    (planPrices || []).map((p: { plan: string; price_monthly: number | null }) => [p.plan, p.price_monthly || 0])
  );

  const mrr = (orgsWithPlans || []).reduce((acc: number, org: { plan: string }) => {
    return acc + (priceMap.get(org.plan) || 0);
  }, 0);

  // Get total requests (sum from usage_daily)
  const { data: usageData } = await supabase
    .from('usage_daily')
    .select('text_requests, audio_requests, blocked_count');

  const totals = (usageData || []).reduce(
    (acc: { requests: number; blocked: number }, u: { text_requests: number; audio_requests: number; blocked_count: number }) => ({
      requests: acc.requests + u.text_requests + u.audio_requests,
      blocked: acc.blocked + u.blocked_count,
    }),
    { requests: 0, blocked: 0 }
  );

  // Get new users today
  const { count: newUsersToday } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today);

  // Get new orgs today
  const { count: newOrgsToday } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today);

  return {
    totalUsers: totalUsers || 0,
    totalOrgs: totalOrgs || 0,
    activeSubscriptions: activeSubscriptions || 0,
    mrr,
    totalRequests: totals.requests,
    blockedThreats: totals.blocked,
    newUsersToday: newUsersToday || 0,
    newOrgsToday: newOrgsToday || 0,
  };
}

// Get all users with pagination
export async function getAllUsers(
  page: number = 1,
  limit: number = 50,
  search?: string
): Promise<{ users: UserWithOrg[]; total: number }> {
  const supabase = createServiceClient();
  const offset = (page - 1) * limit;

  let query = supabase
    .from('users')
    .select('*', { count: 'exact' });

  if (search) {
    // Sanitize search input to prevent SQL injection
    const sanitized = sanitizeSearchInput(search);
    query = query.or(`email.ilike.%${sanitized}%,name.ilike.%${sanitized}%`);
  }

  const { data: users, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0 };
  }

  // Get org memberships for each user
  const userIds = (users || []).map((u: User) => u.id);
  const { data: memberships } = await supabase
    .from('org_members')
    .select('user_id, org_id')
    .in('user_id', userIds);

  const orgIds = Array.from(new Set((memberships || []).map((m: { org_id: string }) => m.org_id)));
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id, name, plan')
    .in('id', orgIds);

  const orgMap = new Map((orgs || []).map((o: { id: string; name: string; plan: string }) => [o.id, o]));
  const userOrgMap = new Map<string, { name: string; plan: string }[]>();

  (memberships || []).forEach((m: { user_id: string; org_id: string }) => {
    const org = orgMap.get(m.org_id);
    if (org) {
      const existing = userOrgMap.get(m.user_id) || [];
      existing.push({ name: org.name, plan: org.plan });
      userOrgMap.set(m.user_id, existing);
    }
  });

  const usersWithOrgs: UserWithOrg[] = (users || []).map((u: User) => ({
    ...u,
    organizations: userOrgMap.get(u.id) || [],
  }));

  return { users: usersWithOrgs, total: count || 0 };
}

// Get all organizations with stats
export async function getAllOrganizations(
  page: number = 1,
  limit: number = 50,
  search?: string
): Promise<{ organizations: OrgWithStats[]; total: number }> {
  const supabase = createServiceClient();
  const offset = (page - 1) * limit;

  let query = supabase
    .from('organizations')
    .select('*', { count: 'exact' });

  if (search) {
    // Sanitize search input to prevent SQL injection
    const sanitized = sanitizeSearchInput(search);
    query = query.or(`name.ilike.%${sanitized}%,slug.ilike.%${sanitized}%`);
  }

  const { data: orgs, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching organizations:', error);
    return { organizations: [], total: 0 };
  }

  // Get member counts
  const orgIds = (orgs || []).map((o: Organization) => o.id);
  const { data: memberCounts } = await supabase
    .from('org_members')
    .select('org_id')
    .in('org_id', orgIds);

  const memberCountMap = new Map<string, number>();
  (memberCounts || []).forEach((m: { org_id: string }) => {
    memberCountMap.set(m.org_id, (memberCountMap.get(m.org_id) || 0) + 1);
  });

  // Get request counts from usage_daily
  const { data: usageTotals } = await supabase
    .from('usage_daily')
    .select('org_id, text_requests, audio_requests')
    .in('org_id', orgIds);

  const requestCountMap = new Map<string, number>();
  (usageTotals || []).forEach((u: { org_id: string; text_requests: number; audio_requests: number }) => {
    requestCountMap.set(u.org_id, (requestCountMap.get(u.org_id) || 0) + u.text_requests + u.audio_requests);
  });

  const orgsWithStats: OrgWithStats[] = (orgs || []).map((o: Organization) => ({
    ...o,
    memberCount: memberCountMap.get(o.id) || 0,
    totalRequests: requestCountMap.get(o.id) || 0,
  }));

  return { organizations: orgsWithStats, total: count || 0 };
}

// Get revenue data
export interface RevenueData {
  mrr: number;
  arr: number;
  planBreakdown: { plan: string; count: number; revenue: number }[];
  recentTransactions: { date: string; amount: number; org: string; type: string }[];
  mrrHistory: { date: string; mrr: number }[];
}

export async function getRevenueData(): Promise<RevenueData> {
  const supabase = createServiceClient();

  // Get orgs by plan
  const { data: orgsWithPlans } = await supabase
    .from('organizations')
    .select('id, name, plan, created_at');

  // Get plan prices
  const { data: planPrices } = await supabase
    .from('plan_limits')
    .select('plan, price_monthly, display_name');

  const priceMap = new Map(
    (planPrices || []).map((p: { plan: string; price_monthly: number | null }) => [p.plan, p.price_monthly || 0])
  );

  // Calculate plan breakdown
  const planCounts = new Map<string, number>();
  (orgsWithPlans || []).forEach((o: { plan: string }) => {
    planCounts.set(o.plan, (planCounts.get(o.plan) || 0) + 1);
  });

  const planBreakdown = Array.from(planCounts.entries())
    .filter(([plan]) => plan !== 'free')
    .map(([plan, count]) => ({
      plan,
      count,
      revenue: count * (priceMap.get(plan) || 0),
    }));

  const mrr = planBreakdown.reduce((acc, p) => acc + p.revenue, 0);

  // Simulate recent transactions (would come from Stripe in production)
  const recentTransactions = (orgsWithPlans || [])
    .filter((o: { plan: string }) => o.plan !== 'free')
    .slice(0, 10)
    .map((o: { name: string; plan: string; created_at: string }) => ({
      date: o.created_at,
      amount: priceMap.get(o.plan) || 0,
      org: o.name,
      type: 'subscription',
    }));

  // Simulate MRR history (last 12 months)
  const mrrHistory: { date: string; mrr: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // Simulate growth - in production, calculate from actual historical data
    const historicalMrr = Math.round(mrr * (1 - i * 0.08));
    mrrHistory.push({
      date: date.toISOString().split('T')[0],
      mrr: Math.max(0, historicalMrr),
    });
  }

  return {
    mrr,
    arr: mrr * 12,
    planBreakdown,
    recentTransactions,
    mrrHistory,
  };
}

// Get platform usage data
export interface PlatformUsage {
  totalRequests: number;
  textRequests: number;
  audioRequests: number;
  redteamAttacks: number;
  blockedCount: number;
  avgLatency: number;
  dailyUsage: { date: string; text: number; audio: number; blocked: number }[];
  topOrgs: { name: string; requests: number }[];
}

export async function getPlatformUsage(days: number = 30): Promise<PlatformUsage> {
  const supabase = createServiceClient();

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all usage data
  const { data: usageData } = await supabase
    .from('usage_daily')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  // Aggregate totals
  const totals = (usageData || []).reduce(
    (acc: {
      text: number;
      audio: number;
      redteam: number;
      blocked: number;
      latencySum: number;
      latencyCount: number;
    }, u: UsageDaily) => ({
      text: acc.text + u.text_requests,
      audio: acc.audio + u.audio_requests,
      redteam: acc.redteam + u.redteam_attacks,
      blocked: acc.blocked + u.blocked_count,
      latencySum: acc.latencySum + (u.avg_latency_ms || 0) * u.text_requests,
      latencyCount: acc.latencyCount + (u.avg_latency_ms ? u.text_requests : 0),
    }),
    { text: 0, audio: 0, redteam: 0, blocked: 0, latencySum: 0, latencyCount: 0 }
  );

  // Group by date
  const dailyMap = new Map<string, { text: number; audio: number; blocked: number }>();
  (usageData || []).forEach((u: UsageDaily) => {
    const existing = dailyMap.get(u.date) || { text: 0, audio: 0, blocked: 0 };
    dailyMap.set(u.date, {
      text: existing.text + u.text_requests,
      audio: existing.audio + u.audio_requests,
      blocked: existing.blocked + u.blocked_count,
    });
  });

  // Fill in missing days
  const dailyUsage: { date: string; text: number; audio: number; blocked: number }[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dailyUsage.push({
      date: dateStr,
      ...(dailyMap.get(dateStr) || { text: 0, audio: 0, blocked: 0 }),
    });
  }

  // Get top orgs by usage
  const orgUsageMap = new Map<string, number>();
  (usageData || []).forEach((u: UsageDaily) => {
    orgUsageMap.set(u.org_id, (orgUsageMap.get(u.org_id) || 0) + u.text_requests + u.audio_requests);
  });

  const topOrgIds = Array.from(orgUsageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  const { data: topOrgsData } = await supabase
    .from('organizations')
    .select('id, name')
    .in('id', topOrgIds);

  const orgNameMap = new Map((topOrgsData || []).map((o: { id: string; name: string }) => [o.id, o.name]));
  const topOrgs = topOrgIds.map((id) => ({
    name: orgNameMap.get(id) || 'Unknown',
    requests: orgUsageMap.get(id) || 0,
  }));

  return {
    totalRequests: totals.text + totals.audio,
    textRequests: totals.text,
    audioRequests: totals.audio,
    redteamAttacks: totals.redteam,
    blockedCount: totals.blocked,
    avgLatency: totals.latencyCount > 0 ? Math.round(totals.latencySum / totals.latencyCount) : 0,
    dailyUsage,
    topOrgs,
  };
}

// Get user growth data
export interface GrowthData {
  usersByDay: { date: string; count: number }[];
  orgsByDay: { date: string; count: number }[];
  totalUsers: number;
  totalOrgs: number;
}

export async function getGrowthData(days: number = 30): Promise<GrowthData> {
  const supabase = createServiceClient();

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get users created in period
  const { data: users } = await supabase
    .from('users')
    .select('created_at')
    .gte('created_at', startDate.toISOString());

  // Get orgs created in period
  const { data: orgs } = await supabase
    .from('organizations')
    .select('created_at')
    .gte('created_at', startDate.toISOString());

  // Group by date
  const usersByDay = new Map<string, number>();
  const orgsByDay = new Map<string, number>();

  (users || []).forEach((u: { created_at: string }) => {
    const date = u.created_at.split('T')[0];
    usersByDay.set(date, (usersByDay.get(date) || 0) + 1);
  });

  (orgs || []).forEach((o: { created_at: string }) => {
    const date = o.created_at.split('T')[0];
    orgsByDay.set(date, (orgsByDay.get(date) || 0) + 1);
  });

  // Fill in all days
  const userGrowth: { date: string; count: number }[] = [];
  const orgGrowth: { date: string; count: number }[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    userGrowth.push({ date: dateStr, count: usersByDay.get(dateStr) || 0 });
    orgGrowth.push({ date: dateStr, count: orgsByDay.get(dateStr) || 0 });
  }

  // Get totals
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: totalOrgs } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true });

  return {
    usersByDay: userGrowth,
    orgsByDay: orgGrowth,
    totalUsers: totalUsers || 0,
    totalOrgs: totalOrgs || 0,
  };
}
