#!/usr/bin/env npx tsx

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import readline from "readline";
import { wallets, adminUsers } from "../shared/enhanced-schema";

import { users, profiles } from "../shared/schema";

// Setup database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql);

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

async function createComprehensiveAdmin() {
  console.log("🚀 SoftChat Comprehensive Admin User Creation\n");

  try {
    // Collect admin information
    const email = await prompt("Enter admin email: ");
    const name = await prompt("Enter admin full name: ");
    const password = await prompt("Enter admin password (min 8 characters): ");

    console.log("\n📋 Select admin roles (comma-separated):");
    console.log("Available roles:");
    console.log("  - super_admin (Full access to everything)");
    console.log("  - finance_admin (Wallet, escrow, earnings management)");
    console.log("  - content_admin (Content moderation, flags, reviews)");
    console.log("  - community_mod (Chat & social moderation)");
    console.log("  - support_agent (Tickets, FAQs, limited view)");
    console.log("  - marketplace_admin (Products, orders, sellers)");
    console.log("  - crypto_admin (P2P trades, disputes, crypto operations)");
    console.log("  - freelance_admin (Jobs, projects, freelancer management)");

    const rolesInput = await prompt("\nEnter roles: ");
    const roles = rolesInput
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r);

    if (roles.length === 0) {
      console.log("⚠️  No roles specified, defaulting to 'support_agent'");
      roles.push("support_agent");
    }

    const department =
      (await prompt("Enter department (optional): ")) || "Administration";
    const position =
      (await prompt("Enter position (optional): ")) || "System Administrator";
    const employeeId =
      (await prompt("Enter employee ID (optional): ")) || `ADM-${Date.now()}`;

    // Validate input
    if (!email || !name || !password) {
      throw new Error("Email, name, and password are required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log(
        "⚠️  User with this email already exists. Converting to admin...",
      );

      const userId = existingUser[0].id;

      // Check if already admin
      const existingAdmin = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.userId, userId))
        .limit(1);

      if (existingAdmin.length > 0) {
        console.log("✅ User is already an admin. Updating roles...");

        // Update existing admin
        await db
          .update(adminUsers)
          .set({
            roles,
            permissions: generatePermissions(roles),
            department,
            position,
            employeeId,
            isActive: true,
          })
          .where(eq(adminUsers.userId, userId));

        console.log("✅ Admin user updated successfully!");
      } else {
        // Create admin record for existing user
        await db.insert(adminUsers).values({
          userId,
          roles,
          permissions: generatePermissions(roles),
          department,
          position,
          employeeId,
          isActive: true,
        });

        console.log("✅ Existing user converted to admin successfully!");
      }
    } else {
      // Create new user and admin
      console.log("🔐 Creating new user account...");

      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          emailConfirmed: true, // Auto-confirm admin emails
        })
        .returning();

      console.log("👤 Creating user profile...");

      // Create profile
      await db.insert(profiles).values({
        userId: newUser.id,
        fullName: name,
        name,
        role: "admin",
        status: "active",
        isVerified: true, // Auto-verify admin users
      });

      console.log("💰 Creating wallet...");

      // Create wallet
      await db.insert(wallets).values({
        userId: newUser.id,
        isActive: true,
      });

      console.log("🛡️  Creating admin permissions...");

      // Create admin user
      await db.insert(adminUsers).values({
        userId: newUser.id,
        roles,
        permissions: generatePermissions(roles),
        department,
        position,
        employeeId,
        isActive: true,
      });

      console.log("✅ New admin user created successfully!");
    }

    // Display summary
    console.log("\n📊 Admin User Summary:");
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🏢 Department: ${department}`);
    console.log(`💼 Position: ${position}`);
    console.log(`🆔 Employee ID: ${employeeId}`);
    console.log(`🔑 Roles: ${roles.join(", ")}`);
    console.log(`🛡️  Permissions: ${generatePermissions(roles).join(", ")}`);

    console.log("\n🎉 Admin user setup complete!");
    console.log("\n📝 Next steps:");
    console.log("1. Admin can now login at /admin/login");
    console.log("2. Use the provided email and password");
    console.log("3. Access admin dashboard at /admin/dashboard");
    console.log("4. Configure additional admin settings as needed");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function generatePermissions(roles: string[]): string[] {
  const rolePermissions: Record<string, string[]> = {
    super_admin: [
      "admin.all",
      "users.all",
      "content.all",
      "marketplace.all",
      "crypto.all",
      "freelance.all",
      "financial.all",
      "settings.all",
      "moderation.all",
      "analytics.all",
      "system.all",
    ],
    finance_admin: [
      "admin.view",
      "financial.all",
      "wallet.view",
      "wallet.freeze",
      "escrow.all",
      "earnings.view",
      "transactions.view",
      "disputes.financial",
    ],
    content_admin: [
      "admin.view",
      "content.all",
      "moderation.all",
      "reports.all",
      "users.suspend",
      "posts.moderate",
      "reviews.moderate",
    ],
    community_mod: [
      "admin.view",
      "moderation.view",
      "moderation.resolve",
      "chat.moderate",
      "users.warn",
      "content.flag",
      "reports.view",
    ],
    support_agent: [
      "admin.view",
      "users.view",
      "tickets.all",
      "reports.view",
      "moderation.view",
    ],
    marketplace_admin: [
      "admin.view",
      "marketplace.all",
      "products.all",
      "orders.all",
      "sellers.manage",
      "reviews.moderate",
      "disputes.marketplace",
    ],
    crypto_admin: [
      "admin.view",
      "crypto.all",
      "p2p.all",
      "trades.all",
      "disputes.crypto",
      "wallet.view",
    ],
    freelance_admin: [
      "admin.view",
      "freelance.all",
      "jobs.all",
      "projects.all",
      "disputes.freelance",
      "escrow.freelance",
    ],
  };

  const permissions = new Set<string>();

  roles.forEach((role) => {
    const rolePerms = rolePermissions[role] || [];
    rolePerms.forEach((perm) => permissions.add(perm));
  });

  return Array.from(permissions);
}

// Run the script
if (require.main === module) {
  createComprehensiveAdmin();
}
