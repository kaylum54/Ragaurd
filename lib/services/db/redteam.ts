import { createServiceClient } from '@/lib/supabase/server';

export interface RedteamScan {
  id: string;
  org_id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  target_endpoint: string;
  attack_suite: string;
  total_attacks: number;
  blocked_attacks: number;
  passed_attacks: number;
  block_rate: number;
  config: Record<string, unknown> | null;
  results: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export async function getRedteamScans(orgId: string): Promise<RedteamScan[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('redteam_scans')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching redteam scans:', error);
    return [];
  }

  return (data || []) as RedteamScan[];
}

export async function getRedteamScanById(id: string): Promise<RedteamScan | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('redteam_scans')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching redteam scan:', error);
    return null;
  }

  return data as RedteamScan;
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
}

export async function updateScanStatus(
  id: string,
  status: RedteamScan['status'],
  updates?: Partial<Pick<RedteamScan, 'blocked_attacks' | 'passed_attacks' | 'block_rate' | 'results' | 'error_message'>>
): Promise<boolean> {
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
}

export async function deleteScan(id: string, orgId: string): Promise<boolean> {
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
