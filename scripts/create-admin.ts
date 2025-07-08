#!/usr/bin/env npx tsx

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "../shared/schema";
import crypto from "crypto";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

// Hash password function (simple bcrypt-like implementation)
function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + "salt")
    .digest("hex");
}

async function createAdminUser() {
  const adminEmail = "admin@softchat.com";
  const adminPassword = "Admin123!";
  const adminName = "Super Admin";

  try {
    // Check if admin already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail),
    });

    if (existingUser) {
      console.log("❌ Admin user already exists with email:", adminEmail);
      return;
    }

    console.log("🔐 Creating admin user...");

    // Create user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        email: adminEmail,
        password: hashPassword(adminPassword),
        emailConfirmed: true,
      })
      .returning();

    console.log("✅ User created with ID:", newUser.id);

    // Create profile
    const [newProfile] = await db
      .insert(schema.profiles)
      .values({
        userId: newUser.id,
        username: "superadmin",
        fullName: adminName,
        name: adminName,
        bio: "Platform Super Administrator",
        role: "admin",
        status: "active",
        isVerified: true,
        level: "platinum",
        points: 10000,
      })
      .returning();

    console.log("✅ Profile created with ID:", newProfile.id);

    // Grant super admin permissions
    const [adminPermission] = await db
      .insert(schema.adminPermissions)
      .values({
        userId: newUser.id,
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
        isActive: true,
        grantedBy: newUser.id, // Self-granted for initial setup
      })
      .returning();

    console.log("✅ Admin permissions granted with ID:", adminPermission.id);

    console.log("\n🎉 Admin user created successfully!");
    console.log("📋 Login Details:");
    console.log("   📧 Email:", adminEmail);
    console.log("   🔑 Password:", adminPassword);
    console.log("   🌐 Admin Dashboard: /admin/dashboard");
    console.log("   🔐 Admin Login: /admin-login");
    console.log("\n⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await pool.end();
  }
}

// Run the script
createAdminUser();
