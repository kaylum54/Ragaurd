import { createServiceClient } from '@/lib/supabase/server';
import type { Organization, OrgMember, Database } from '@/types/database';

type OrgInsert = Database['public']['Tables']['organizations']['Insert'];
type OrgUpdate = Database['public']['Tables']['organizations']['Update'];
type OrgMemberInsert = Database['public']['Tables']['org_members']['Insert'];

export async function getOrganizationById(id: string): Promise<Organization | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching organization:', error);
    return null;
  }

  return data as Organization;
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching organization by slug:', error);
    return null;
  }

  return data as Organization | null;
}

export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  const supabase = createServiceClient();

  // Get org IDs where user is a member
  const { data: memberships, error: memberError } = await supabase
    .from('org_members')
    .select('org_id')
    .eq('user_id', userId);

  if (memberError || !memberships?.length) {
    return [];
  }

  const orgIds = (memberships as { org_id: string }[]).map((m) => m.org_id);

  const { data: orgs, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .in('id', orgIds);

  if (orgError) {
    console.error('Error fetching user organizations:', orgError);
    return [];
  }

  return (orgs as Organization[]) || [];
}

export async function createOrganization(
  orgData: OrgInsert,
  userId: string
): Promise<Organization | null> {
  const supabase = createServiceClient();

  // Create the organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert(orgData as never)
    .select()
    .single();

  if (orgError) {
    console.error('Error creating organization:', orgError);
    return null;
  }

  const organization = org as Organization;

  // Add owner as member
  const { error: memberError } = await supabase
    .from('org_members')
    .insert({
      org_id: organization.id,
      user_id: userId,
      role: 'owner',
    } as never);

  if (memberError) {
    console.error('Error adding owner to organization:', memberError);
    // Rollback organization creation
    await supabase.from('organizations').delete().eq('id', organization.id);
    return null;
  }

  return organization;
}

export async function updateOrganization(
  id: string,
  orgData: OrgUpdate
): Promise<Organization | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('organizations')
    .update({ ...orgData, updated_at: new Date().toISOString() } as never)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating organization:', error);
    return null;
  }

  return data as Organization;
}

export async function getOrganizationMembers(orgId: string): Promise<OrgMember[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('org_members')
    .select('*')
    .eq('org_id', orgId);

  if (error) {
    console.error('Error fetching organization members:', error);
    return [];
  }

  return (data as OrgMember[]) || [];
}

export async function getMemberRole(
  orgId: string,
  userId: string
): Promise<OrgMember['role'] | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .single();

  if (error) {
    return null;
  }

  return (data as { role: OrgMember['role'] })?.role || null;
}

export async function addOrganizationMember(
  memberData: OrgMemberInsert
): Promise<OrgMember | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('org_members')
    .insert(memberData as never)
    .select()
    .single();

  if (error) {
    console.error('Error adding organization member:', error);
    return null;
  }

  return data as OrgMember;
}

export async function removeOrganizationMember(
  orgId: string,
  userId: string
): Promise<boolean> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('org_members')
    .delete()
    .eq('org_id', orgId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing organization member:', error);
    return false;
  }

  return true;
}

export async function updateMemberRole(
  orgId: string,
  userId: string,
  role: OrgMember['role']
): Promise<boolean> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('org_members')
    .update({ role } as never)
    .eq('org_id', orgId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating member role:', error);
    return false;
  }

  return true;
}

export async function getMemberCount(orgId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from('org_members')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId);

  if (error) {
    console.error('Error counting members:', error);
    return 0;
  }

  return count || 0;
}
