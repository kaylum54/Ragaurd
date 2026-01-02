const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bgcbyttglkwsrumkpnsy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnY2J5dHRnbGt3c3J1bWtwbnN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3NjkwOCwiZXhwIjoyMDgyNjUyOTA4fQ.yF1sCL8Fk3U_opLHQfODDQ4x2bX7rFDyZhEV_pNh7aI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  // Test 1: Check connection by querying users table
  console.log('1. Testing database connection...');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(5);

  if (usersError) {
    console.log('   ❌ Connection failed:', usersError.message);
  } else {
    console.log('   ✓ Connection successful!');
    console.log(`   Found ${users.length} users in database`);
    if (users.length > 0) {
      console.log('   Users:', users.map(u => u.email).join(', '));
    }
  }

  // Test 2: Check all tables
  console.log('\n2. Checking tables...');
  const tables = ['users', 'organizations', 'api_keys', 'usage_daily', 'request_log'];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`   ❌ ${table}: ${error.message}`);
    } else {
      console.log(`   ✓ ${table}: ${count} rows`);
    }
  }

  // Test 3: Try to insert a test user
  console.log('\n3. Testing user insert...');
  const testEmail = `test-${Date.now()}@example.com`;
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      auth0_id: `email|${Date.now()}`,
      email: testEmail,
      name: 'Test User',
    })
    .select()
    .single();

  if (insertError) {
    console.log('   ❌ Insert failed:', insertError.message);
  } else {
    console.log('   ✓ Insert successful!');
    console.log('   Created user:', newUser.email);

    // Clean up test user
    await supabase.from('users').delete().eq('id', newUser.id);
    console.log('   ✓ Test user cleaned up');
  }

  console.log('\n✅ Supabase connection test complete!');
}

testConnection().catch(console.error);
