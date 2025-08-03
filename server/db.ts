import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as enhancedSchema from "@shared/enhanced-schema";
import * as adminSchema from "@shared/admin-schema";
import * as activityEconomySchema from "@shared/activity-economy-schema";
import * as engagementSchema from "@shared/engagement-schema";
import * as videoSchema from "@shared/video-schema";
import * as socialSchema from "@shared/social-schema";
import * as aiSchema from "@shared/ai-schema";
import * as notificationsSchema from "@shared/notifications-schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const allSchemas = {
  ...schema,
  ...enhancedSchema,
  ...adminSchema,
  ...activityEconomySchema,
  ...engagementSchema,
  ...videoSchema,
  ...socialSchema,
  ...aiSchema,
  ...notificationsSchema
};

export const db = drizzle({ client: pool, schema: allSchemas });
