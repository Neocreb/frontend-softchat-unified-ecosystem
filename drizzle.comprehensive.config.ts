import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Please check your environment configuration.",
  );
}

export default defineConfig({
  out: "./migrations",
  schema: [
    "./shared/schema.ts", // Original schema
    "./shared/enhanced-schema.ts", // Enhanced comprehensive schema
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  // Migration configuration
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },

  // Development configuration
  verbose: process.env.NODE_ENV === "development",
  strict: true,

  // Production optimizations
  ...(process.env.NODE_ENV === "production" && {
    tablesFilter: ["!drizzle_*"],
  }),
});
