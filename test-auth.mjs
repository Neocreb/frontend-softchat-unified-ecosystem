import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hjebzdekquczudhrygns.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZWJ6ZGVrcXVjenVkaHJ5Z25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjIzMjksImV4cCI6MjA2MDE5ODMyOX0.bUXtDIV-QReFFgv6UoOGovH2zi2q68HKe2E4Kkbhc7U'
);

console.log('Testing Supabase authentication...');

// Test basic connection
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.log('❌ Session check failed:', error.message);
  } else {
    console.log('✅ Supabase connection successful');
    console.log('Current session:', data.session ? 'Active' : 'None');
  }
} catch (err) {
  console.log('❌ Connection failed:', err.message);
}

// Test a simple sign up
try {
  console.log('\nTesting signup with test email...');
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpassword123',
    options: {
      data: {
        name: 'Test User',
        full_name: 'Test User',
        username: 'testuser'
      }
    }
  });
  
  if (error) {
    console.log('Signup error:', error.message);
    console.log('Error details:', error);
  } else {
    console.log('Signup result:', data);
  }
} catch (err) {
  console.log('Signup exception:', err.message);
}

// Test login with the demo credentials from the form
try {
  console.log('\nTesting login with demo credentials...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'demo@softchat.com',
    password: 'password123'
  });
  
  if (error) {
    console.log('Login error:', error.message);
    console.log('Error details:', error);
  } else {
    console.log('Login successful:', data.user?.email);
  }
} catch (err) {
  console.log('Login exception:', err.message);
}
