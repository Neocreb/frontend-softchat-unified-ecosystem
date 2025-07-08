#!/usr/bin/env npx tsx

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with anon key for user creation
const SUPABASE_URL = "https://hjebzdekquczudhrygns.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZWJ6ZGVrcXVjenVkaHJ5Z25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjIzMjksImV4cCI6MjA2MDE5ODMyOX0.bUXtDIV-QReFFgv6UoOGovH2zi2q68HKe2E4Kkbhc7U";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminUser() {
  const adminEmail = "admin@softchat.com";
  const adminPassword = "Admin123!";
  const adminName = "Super Admin";

  try {
    console.log("🔐 Creating admin user...");

    // Try to sign up the user (this will create them in auth.users)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          full_name: adminName,
        },
      },
    });

    if (authError) {
      throw new Error(`Auth creation failed: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error("User creation failed - no user returned");
    }

    console.log("✅ Auth user created with ID:", authData.user.id);

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        user_id: authData.user.id,
        username: "superadmin",
        full_name: adminName,
        name: adminName,
        bio: "Platform Super Administrator",
        role: "admin",
        status: "active",
        is_verified: true,
        level: "platinum",
        points: 10000,
      })
      .select()
      .single();

    if (profileError) {
      console.error("⚠️ Profile creation error:", profileError);
      // Continue anyway, profile might already exist
    } else {
      console.log("✅ Profile created with ID:", profileData.id);
    }

    // Grant super admin permissions
    const { data: permissionData, error: permissionError } = await supabase
      .from("admin_permissions")
      .insert({
        user_id: authData.user.id,
        role: "super_admin",
        permissions: [
          "admin.all",
          "users.all",
          "content.all",
          "marketplace.all",
          "crypto.all",
          "freelance.all",
          "settings.all",
          "moderation.all",
        ],
        is_active: true,
        granted_by: authData.user.id, // Self-granted for initial setup
      })
      .select()
      .single();

    if (permissionError) {
      console.error("⚠️ Permission creation error:", permissionError);
      // Continue anyway, might be a schema difference
    } else {
      console.log("✅ Admin permissions granted with ID:", permissionData.id);
    }

    console.log("\n🎉 Admin user created successfully!");
    console.log("📋 Login Details:");
    console.log("   📧 Email:", adminEmail);
    console.log("   🔑 Password:", adminPassword);
    console.log("   🌐 Admin Dashboard: /admin/dashboard");
    console.log("   🔐 Admin Login: /admin-login");
    console.log("\n⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
}

// Run the script
createAdminUser();
