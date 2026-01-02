import { createServiceClient } from '@/lib/supabase/server';
import type { SavedEndpoint, SavedEndpointInsert, SavedEndpointUpdate } from '@/types/database';

// Note: Using 'any' for table access since the saved_endpoints table
// isn't in the generated Supabase types yet. Run `npx supabase gen types`
// after applying the migration to fix this.

/**
 * Get all saved endpoints for an organization
 */
export async function getSavedEndpoints(orgId: string): Promise<SavedEndpoint[]> {
  const supabase = createServiceClient();
  const { data, error } = await (supabase as any)
    .from('saved_endpoints')
    .select('*')
    .eq('org_id', orgId)
    .order('last_used_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching saved endpoints:', error);
    return [];
  }

  return data as SavedEndpoint[];
}

/**
 * Get a single saved endpoint by ID
 */
export async function getSavedEndpointById(id: string): Promise<SavedEndpoint | null> {
  const supabase = createServiceClient();
  const { data, error } = await (supabase as any)
    .from('saved_endpoints')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching saved endpoint:', error);
    return null;
  }

  return data as SavedEndpoint;
}

/**
 * Create a new saved endpoint
 */
export async function createSavedEndpoint(
  orgId: string,
  endpoint: SavedEndpointInsert
): Promise<SavedEndpoint | null> {
  const supabase = createServiceClient();
  const { data, error } = await (supabase as any)
    .from('saved_endpoints')
    .insert({
      org_id: orgId,
      name: endpoint.name,
      endpoint_url: endpoint.endpoint_url,
      endpoint_type: endpoint.endpoint_type || 'voice_agent',
      description: endpoint.description || null,
      config: endpoint.config || {},
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating saved endpoint:', error);
    return null;
  }

  return data as SavedEndpoint;
}

/**
 * Update a saved endpoint
 */
export async function updateSavedEndpoint(
  id: string,
  orgId: string,
  updates: SavedEndpointUpdate
): Promise<SavedEndpoint | null> {
  const supabase = createServiceClient();
  const { data, error } = await (supabase as any)
    .from('saved_endpoints')
    .update(updates)
    .eq('id', id)
    .eq('org_id', orgId) // Ensure org ownership
    .select()
    .single();

  if (error) {
    console.error('Error updating saved endpoint:', error);
    return null;
  }

  return data as SavedEndpoint;
}

/**
 * Delete a saved endpoint
 */
export async function deleteSavedEndpoint(id: string, orgId: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { error } = await (supabase as any)
    .from('saved_endpoints')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId); // Ensure org ownership

  if (error) {
    console.error('Error deleting saved endpoint:', error);
    return false;
  }

  return true;
}

/**
 * Update last_used_at timestamp when an endpoint is used
 */
export async function markEndpointUsed(id: string, orgId: string): Promise<void> {
  const supabase = createServiceClient();
  await (supabase as any)
    .from('saved_endpoints')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', id)
    .eq('org_id', orgId);
}
