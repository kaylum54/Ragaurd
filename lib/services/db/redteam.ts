import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase/server';

export interface RedteamScan {
  id: string;
  org_id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  target_endpoint: string;
  attack_suite: string;
  total_attacks: number;
  blocked_attacks: number;
  passed_attacks: number;
  error_attacks: number;
  block_rate: number;
  avg_latency_ms: number | null;
  config: Record<string, unknown> | null;
  results: Record<string, unknown> | null;
  report_json: Record<string, unknown> | null;
  error_message: string | null;
  garak_job_id: string | null;
  pyrit_job_id: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

// Demo data for when Supabase is not configured
const demoScans: RedteamScan[] = [
  {
    id: 'demo-1',
    org_id: 'demo-org-001',
    name: 'Production Security Audit',
    status: 'completed',
    target_endpoint: 'https://api.example.com/chat',
    attack_suite: 'comprehensive',
    total_attacks: 500,
    blocked_attacks: 497,
    passed_attacks: 3,
    error_attacks: 0,
    block_rate: 99.4,
    avg_latency_ms: 145,
    config: null,
    results: null,
    report_json: null,
    error_message: null,
    garak_job_id: null,
    pyrit_job_id: null,
    created_at: '2024-12-28T10:00:00Z',
    started_at: '2024-12-28T10:00:30Z',
    completed_at: '2024-12-28T10:45:00Z',
  },
  {
    id: 'demo-2',
    org_id: 'demo-org-001',
    name: 'Weekly Scan',
    status: 'running',
    target_endpoint: 'https://api.example.com/agent',
    attack_suite: 'standard',
    total_attacks: 200,
    blocked_attacks: 156,
    passed_attacks: 4,
    error_attacks: 0,
    block_rate: 97.5,
    avg_latency_ms: 120,
    config: null,
    results: null,
    report_json: null,
    error_message: null,
    garak_job_id: null,
    pyrit_job_id: null,
    created_at: '2024-12-30T08:00:00Z',
    started_at: '2024-12-30T08:00:15Z',
    completed_at: null,
  },
  {
    id: 'demo-3',
    org_id: 'demo-org-001',
    name: 'Quick Vulnerability Check',
    status: 'completed',
    target_endpoint: 'https://api.example.com/voice',
    attack_suite: 'basic',
    total_attacks: 50,
    blocked_attacks: 50,
    passed_attacks: 0,
    error_attacks: 0,
    block_rate: 100,
    avg_latency_ms: 98,
    config: null,
    results: null,
    report_json: null,
    error_message: null,
    garak_job_id: null,
    pyrit_job_id: null,
    created_at: '2024-12-27T14:00:00Z',
    started_at: '2024-12-27T14:00:10Z',
    completed_at: '2024-12-27T14:15:00Z',
  },
];

export async function getRedteamScans(orgId: string): Promise<RedteamScan[]> {
  // Return demo data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return demoScans;
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('redteam_scans')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching redteam scans:', error);
      return demoScans;
    }

    return (data || []) as RedteamScan[];
  } catch (error) {
    console.error('Error connecting to database:', error);
    return demoScans;
  }
}

export async function getRedteamScanById(id: string): Promise<RedteamScan | null> {
  // Return demo data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return demoScans.find(s => s.id === id) || null;
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('redteam_scans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching redteam scan:', error);
      return demoScans.find(s => s.id === id) || null;
    }

    return data as RedteamScan;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return demoScans.find(s => s.id === id) || null;
  }
}

interface CreateScanParams {
  orgId: string;
  name: string;
  targetEndpoint: string;
  attackSuite: string;
  totalAttacks: number;
  config?: Record<string, unknown>;
}

export async function createRedteamScan(params: CreateScanParams): Promise<RedteamScan | null> {
  // Return demo scan if Supabase is not configured
  if (!isSupabaseConfigured()) {
    const demoScan: RedteamScan = {
      id: `demo-${Date.now()}`,
      org_id: params.orgId,
      name: params.name || `Scan ${new Date().toISOString()}`,
      target_endpoint: params.targetEndpoint,
      attack_suite: params.attackSuite,
      total_attacks: params.totalAttacks,
      blocked_attacks: 0,
      passed_attacks: 0,
      error_attacks: 0,
      block_rate: 0,
      avg_latency_ms: null,
      status: 'pending',
      config: params.config || null,
      results: null,
      report_json: null,
      error_message: null,
      garak_job_id: null,
      pyrit_job_id: null,
      created_at: new Date().toISOString(),
      started_at: null,
      completed_at: null,
    };
    return demoScan;
  }

  try {
    const supabase = createServiceClient();
    const insertData = {
      org_id: params.orgId,
      name: params.name || `Scan ${new Date().toISOString()}`,
      target_endpoint: params.targetEndpoint,
      attack_suite: params.attackSuite,
      total_attacks: params.totalAttacks,
      blocked_attacks: 0,
      passed_attacks: 0,
      block_rate: 0,
      status: 'pending' as const,
      config: params.config || {},
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('redteam_scans')
      .insert(insertData as never)
      .select()
      .single();

    if (error) {
      console.error('Error creating redteam scan:', error);
      return null;
    }

    return data as RedteamScan;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return null;
  }
}

export async function updateScanStatus(
  id: string,
  status: RedteamScan['status'],
  updates?: Partial<Pick<RedteamScan, 'blocked_attacks' | 'passed_attacks' | 'error_attacks' | 'block_rate' | 'avg_latency_ms' | 'results' | 'report_json' | 'error_message' | 'completed_at'>>
): Promise<boolean> {
  // In demo mode, just return true
  if (!isSupabaseConfigured()) {
    return true;
  }

  try {
    const supabase = createServiceClient();
    const updateData: Record<string, unknown> = {
      status,
      ...updates,
    };

    if (status === 'running') {
      updateData.started_at = new Date().toISOString();
    }
    if (status === 'completed' || status === 'failed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('redteam_scans')
      .update(updateData as never)
      .eq('id', id);

    if (error) {
      console.error('Error updating scan status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  }
}

export async function updateScanProgress(
  id: string,
  updates: Partial<{
    blocked_attacks: number;
    passed_attacks: number;
    error_attacks: number;
    block_rate: number;
    avg_latency_ms: number;
    garak_job_id: string;
    pyrit_job_id: string;
  }>
): Promise<boolean> {
  // In demo mode, just return true
  if (!isSupabaseConfigured()) {
    return true;
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('redteam_scans')
      .update(updates as never)
      .eq('id', id);

    if (error) {
      console.error('Error updating scan progress:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  }
}

export async function deleteScan(id: string, orgId: string): Promise<boolean> {
  // In demo mode, just return true
  if (!isSupabaseConfigured()) {
    return true;
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('redteam_scans')
      .delete()
      .eq('id', id)
      .eq('org_id', orgId);

    if (error) {
      console.error('Error deleting scan:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  }
}

export async function getRedteamStats(orgId: string) {
  const scans = await getRedteamScans(orgId);

  const totalScans = scans.length;
  const completedScans = scans.filter(s => s.status === 'completed').length;
  const runningScans = scans.filter(s => s.status === 'running').length;

  const completedWithResults = scans.filter(s => s.status === 'completed' && s.total_attacks > 0);
  const avgBlockRate = completedWithResults.length > 0
    ? completedWithResults.reduce((acc, s) => acc + s.block_rate, 0) / completedWithResults.length
    : 0;

  const totalAttacks = scans.reduce((acc, s) => acc + s.total_attacks, 0);
  const totalBlocked = scans.reduce((acc, s) => acc + s.blocked_attacks, 0);

  return {
    totalScans,
    completedScans,
    runningScans,
    avgBlockRate,
    totalAttacks,
    totalBlocked,
  };
}
