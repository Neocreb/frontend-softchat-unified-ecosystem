import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: [
    "./shared/schema.ts",
    "./shared/enhanced-schema.ts",
    "./shared/admin-schema.ts",
    "./shared/activity-economy-schema.ts",
    "./shared/engagement-schema.ts",
    "./shared/video-schema.ts",
    "./shared/social-schema.ts",
    "./shared/ai-schema.ts",
    "./shared/notifications-schema.ts"
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
