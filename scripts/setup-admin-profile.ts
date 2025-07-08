#!/usr/bin/env npx tsx

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const SUPABASE_URL = "https://hjebzdekquczudhrygns.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZWJ6ZGVrcXVjenVkaHJ5Z25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjIzMjksImV4cCI6MjA2MDE5ODMyOX0.bUXtDIV-QReFFgv6UoOGovH2zi2q68HKe2E4Kkbhc7U";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupAdminProfile() {
  const adminEmail = "admin@softchat.com";
  const adminPassword = "Admin123!";
  const adminName = "Super Admin";

  try {
    console.log("🔧 Setting up admin profile...");

    // First, sign in as the admin user to get proper session
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error("No user data returned");
    }

    console.log("✅ Authenticated as admin user:", authData.user.id);

    // Now create/update profile with authenticated session
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        user_id: authData.user.id,
        username: "superadmin",
        full_name: adminName,
        name: adminName,
        bio: "Platform Super Administrator",
        role: "admin", // Set admin role
        status: "active",
        is_verified: true,
        level: "platinum",
        points: 10000,
        avatar_url: "https://api.dicebear.com/7.x/personas/svg?seed=admin",
      })
      .select()
      .single();

    if (profileError) {
      console.error("❌ Profile setup error:", profileError);
      return;
    }

    console.log("✅ Admin profile created/updated:", profileData);

    // Create or update wallet for admin
    const { data: walletData, error: walletError } = await supabase
      .from("wallets")
      .upsert({
        user_id: authData.user.id,
        softpoints_balance: 100000,
        usdt_balance: 1000,
        btc_balance: 0.1,
        eth_balance: 1,
        sol_balance: 10,
        kyc_verified: true,
        kyc_level: 3,
      })
      .select()
      .single();

    if (walletError) {
      console.error("⚠️ Wallet setup error:", walletError);
    } else {
      console.log("✅ Admin wallet created/updated:", walletData.id);
    }

    console.log("\n🎉 Admin setup completed successfully!");
    console.log("📋 Admin Login Details:");
    console.log("   📧 Email: admin@softchat.com");
    console.log("   🔑 Password: Admin123!");
    console.log("   👤 User ID:", authData.user.id);
    console.log("   🌐 Admin Dashboard: http://localhost:5000/admin/dashboard");
    console.log("   🔐 Admin Login: http://localhost:5000/admin-login");
    console.log("\n⚠️  Important:");
    console.log("   • Please change the password after first login");
    console.log("   • The user has admin role set in the profile");
    console.log("   • Admin permissions are handled by the role field");
  } catch (error) {
    console.error("❌ Error setting up admin profile:", error);
  }
}

// Run the script
setupAdminProfile();
