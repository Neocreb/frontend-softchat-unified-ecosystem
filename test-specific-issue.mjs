import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hjebzdekquczudhrygns.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZWJ6ZGVrcXVjenVkaHJ5Z25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjIzMjksImV4cCI6MjA2MDE5ODMyOX0.bUXtDIV-QReFFgv6UoOGovH2zi2q68HKe2E4Kkbhc7U'
);

console.log('Testing specific authentication scenarios...');

// Test scenario 1: Try to register user that might already exist
console.log('\n1. Testing registration with existing demo user...');
try {
  const { data, error } = await supabase.auth.signUp({
    email: 'demo@softchat.com',
    password: 'password123',
    options: {
      data: {
        name: 'Demo User',
        full_name: 'Demo User',
        username: 'demo'
      }
    }
  });
  
  if (error) {
    console.log('❌ Registration error:', error.message);
    console.log('Error details:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Registration successful or user already exists');
    console.log('Data:', JSON.stringify(data, null, 2));
  }
} catch (err) {
  console.log('❌ Registration exception:', err.message);
}

// Test scenario 2: Try login with wrong password
console.log('\n2. Testing login with wrong password...');
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'demo@softchat.com',
    password: 'wrongpassword'
  });
  
  if (error) {
    console.log('❌ Login error (expected):', error.message);
    console.log('Error details:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Login unexpectedly successful');
  }
} catch (err) {
  console.log('❌ Login exception:', err.message);
}

// Test scenario 3: Try login with correct credentials
console.log('\n3. Testing login with correct credentials...');
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'demo@softchat.com',
    password: 'password123'
  });
  
  if (error) {
    console.log('❌ Login error:', error.message);
    console.log('Error details:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Login successful');
    console.log('User email:', data.user?.email);
  }
} catch (err) {
  console.log('❌ Login exception:', err.message);
}

// Test scenario 4: Try with non-existent user
console.log('\n4. Testing login with non-existent user...');
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'nonexistent@example.com',
    password: 'anypassword'
  });
  
  if (error) {
    console.log('❌ Login error (expected):', error.message);
    console.log('Error details:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Login unexpectedly successful');
  }
} catch (err) {
  console.log('❌ Login exception:', err.message);
}
