import { createServiceClient } from '@/lib/supabase/server';
import { generateApiKey, hashApiKey } from '@/lib/utils/hash';
import type { ApiKey, Database } from '@/types/database';

type ApiKeyInsert = Database['public']['Tables']['api_keys']['Insert'];

export interface CreateApiKeyInput {
  orgId: string;
  name: string;
  scopes?: string[];
  rateLimitPerMin?: number;
  expiresAt?: string | null;
}

export interface CreateApiKeyResult {
  apiKey: ApiKey;
  secretKey: string; // Only returned once at creation
}

export async function createApiKey(input: CreateApiKeyInput): Promise<CreateApiKeyResult | null> {
  const supabase = createServiceClient();

  // Generate the key
  const { key, prefix, hash } = generateApiKey();

  const insertData: ApiKeyInsert = {
    org_id: input.orgId,
    name: input.name,
    key_hash: hash,
    key_prefix: prefix,
    scopes: input.scopes || ['defend:text'],
    rate_limit_per_min: input.rateLimitPerMin || 60,
    expires_at: input.expiresAt,
    is_active: true,
  };

  const { data, error } = await supabase
    .from('api_keys')
    .insert(insertData as never)
    .select()
    .single();

  if (error) {
    console.error('Error creating API key:', error);
    return null;
  }

  return {
    apiKey: data as ApiKey,
    secretKey: key, // Return the actual key only once
  };
}

export async function getApiKeysByOrg(orgId: string): Promise<ApiKey[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('org_id', orgId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching API keys:', error);
    return [];
  }

  return (data as ApiKey[]) || [];
}

export async function getApiKeyById(id: string): Promise<ApiKey | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching API key:', error);
    return null;
  }

  return data as ApiKey;
}

export async function validateApiKey(secretKey: string): Promise<{
  valid: boolean;
  apiKey?: ApiKey;
  orgId?: string;
  error?: string;
}> {
  const supabase = createServiceClient();

  // Hash the provided key
  const keyHash = hashApiKey(secretKey);

  // Look up the key
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { valid: false, error: 'Invalid API key' };
  }

  const apiKey = data as ApiKey;

  // Check expiration
  if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
    return { valid: false, error: 'API key has expired' };
  }

  // Update last used timestamp
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() } as never)
    .eq('id', apiKey.id);

  return {
    valid: true,
    apiKey,
    orgId: apiKey.org_id,
  };
}

export async function revokeApiKey(id: string, orgId: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false } as never)
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) {
    console.error('Error revoking API key:', error);
    return false;
  }

  return true;
}

export async function deleteApiKey(id: string, orgId: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) {
    console.error('Error deleting API key:', error);
    return false;
  }

  return true;
}

export async function getApiKeyCount(orgId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from('api_keys')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('is_active', true);

  if (error) {
    console.error('Error counting API keys:', error);
    return 0;
  }

  return count || 0;
}

export async function updateApiKey(
  id: string,
  orgId: string,
  updates: { name?: string; scopes?: string[]; rate_limit_per_min?: number }
): Promise<ApiKey | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('api_keys')
    .update(updates as never)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();

  if (error) {
    console.error('Error updating API key:', error);
    return null;
  }

  return data as ApiKey;
}
