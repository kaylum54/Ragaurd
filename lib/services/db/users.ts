import { createServiceClient } from '@/lib/supabase/server';
import type { User, Database } from '@/types/database';

type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export async function getUserById(id: string): Promise<User | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user by id:', error);
    return null;
  }

  return data as User;
}

export async function getUserByAuth0Id(auth0Id: string): Promise<User | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth0_id', auth0Id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user by auth0_id:', error);
    return null;
  }

  return data as User | null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user by email:', error);
    return null;
  }

  return data as User | null;
}

export async function createUser(userData: UserInsert): Promise<User | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('users')
    .insert(userData as never)
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data as User;
}

export async function updateUser(id: string, userData: UserUpdate): Promise<User | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('users')
    .update({ ...userData, updated_at: new Date().toISOString() } as never)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }

  return data as User;
}

export async function deleteUser(id: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }

  return true;
}

export async function upsertUserFromAuth0(
  auth0Id: string,
  email: string,
  name?: string | null,
  avatarUrl?: string | null
): Promise<User | null> {
  // Check if user exists
  const existingUser = await getUserByAuth0Id(auth0Id);

  if (existingUser) {
    // Update existing user
    return updateUser(existingUser.id, { name, avatar_url: avatarUrl });
  }

  // Create new user
  return createUser({
    auth0_id: auth0Id,
    email,
    name,
    avatar_url: avatarUrl,
  });
}
