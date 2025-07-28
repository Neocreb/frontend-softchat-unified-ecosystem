#!/usr/bin/env npx tsx

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { 
  liveSessions,
  liveSessionParticipants,
  liveChatMessages,
  giftTypes,
  liveGifts,
  battleVotes,
  liveSessionAnalytics,
  creatorRankings,
  liveReactions
} from '../shared/live-battle-schema';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  console.log('🚀 Starting Live/Battle tables migration...');

  try {
    // Create the tables in order (respecting dependencies)
    
    console.log('📋 Creating live_sessions table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "live_sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "creator_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "title" text NOT NULL,
        "description" text,
        "category" text,
        "max_participants" integer DEFAULT 6,
        "current_participants" integer DEFAULT 1,
        "is_private" boolean DEFAULT false,
        "requires_approval" boolean DEFAULT false,
        "stream_url" text,
        "stream_key" text,
        "quality" text DEFAULT '720p',
        "status" text DEFAULT 'waiting',
        "started_at" timestamp,
        "ended_at" timestamp,
        "peak_viewers" integer DEFAULT 0,
        "total_views" integer DEFAULT 0,
        "total_likes" integer DEFAULT 0,
        "total_gifts" integer DEFAULT 0,
        "total_gift_value" numeric(20,2) DEFAULT '0',
        "enable_gifts" boolean DEFAULT true,
        "enable_tips" boolean DEFAULT true,
        "minimum_tip" numeric(10,2) DEFAULT '1.00',
        "chat_enabled" boolean DEFAULT true,
        "moderated_chat" boolean DEFAULT false,
        "banned_words" jsonb,
        "record_session" boolean DEFAULT false,
        "recording_url" text,
        "highlight_clips" jsonb,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);

    console.log('👥 Creating live_session_participants table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "live_session_participants" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "session_id" uuid NOT NULL REFERENCES "live_sessions"("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "role" text NOT NULL,
        "can_speak" boolean DEFAULT false,
        "can_video" boolean DEFAULT false,
        "can_invite" boolean DEFAULT false,
        "can_moderate" boolean DEFAULT false,
        "is_active" boolean DEFAULT true,
        "mic_enabled" boolean DEFAULT true,
        "video_enabled" boolean DEFAULT true,
        "joined_at" timestamp DEFAULT now(),
        "left_at" timestamp,
        "total_speak_time" integer DEFAULT 0,
        "messages_count" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now()
      );
    `);

    console.log('💬 Creating live_chat_messages table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "live_chat_messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "session_id" uuid NOT NULL REFERENCES "live_sessions"("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "message" text NOT NULL,
        "message_type" text DEFAULT 'text',
        "is_system_message" boolean DEFAULT false,
        "is_pinned" boolean DEFAULT false,
        "is_deleted" boolean DEFAULT false,
        "deleted_by" uuid REFERENCES "users"("id"),
        "delete_reason" text,
        "reply_to_message_id" uuid REFERENCES "live_chat_messages"("id"),
        "is_moderated" boolean DEFAULT false,
        "moderated_by" uuid REFERENCES "users"("id"),
        "moderation_reason" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);

    console.log('🎁 Creating gift_types table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "gift_types" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL,
        "emoji" text NOT NULL,
        "description" text,
        "soft_points_value" numeric(10,2) NOT NULL,
        "rarity" text NOT NULL,
        "color" text,
        "has_animation" boolean DEFAULT false,
        "animation_type" text,
        "sound_effect" text,
        "combo_multiplier" numeric(3,2) DEFAULT '1.00',
        "is_active" boolean DEFAULT true,
        "is_limited" boolean DEFAULT false,
        "limited_until" timestamp,
        "requires_minimum_tier" text,
        "adds_to_score" boolean DEFAULT true,
        "score_multiplier" numeric(3,2) DEFAULT '1.00',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);

    console.log('🎁 Creating live_gifts table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "live_gifts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "session_id" uuid NOT NULL REFERENCES "live_sessions"("id") ON DELETE CASCADE,
        "gift_type_id" uuid NOT NULL REFERENCES "gift_types"("id"),
        "sender_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "recipient_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "quantity" integer DEFAULT 1,
        "total_value" numeric(10,2) NOT NULL,
        "is_combo" boolean DEFAULT false,
        "combo_count" integer DEFAULT 1,
        "combo_multiplier" numeric(3,2) DEFAULT '1.00',
        "message" text,
        "is_anonymous" boolean DEFAULT false,
        "battle_id" uuid,
        "added_to_score" numeric(10,2) DEFAULT '0',
        "created_at" timestamp DEFAULT now()
      );
    `);

    console.log('🗳️ Creating battle_votes table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "battle_votes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "battle_id" uuid NOT NULL REFERENCES "live_sessions"("id") ON DELETE CASCADE,
        "voter_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "voted_for" uuid NOT NULL REFERENCES "users"("id"),
        "amount_sp" numeric(10,2) NOT NULL,
        "odds_at_time_of_vote" numeric(5,2),
        "potential_payout" numeric(10,2),
        "status" text DEFAULT 'active',
        "actual_payout" numeric(10,2) DEFAULT '0',
        "voting_round" integer DEFAULT 1,
        "confidence" text,
        "created_at" timestamp DEFAULT now(),
        "processed_at" timestamp
      );
    `);

    console.log('📊 Creating live_session_analytics table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "live_session_analytics" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "session_id" uuid NOT NULL REFERENCES "live_sessions"("id") ON DELETE CASCADE,
        "average_view_time" integer,
        "chat_messages_per_minute" numeric(5,2),
        "gifts_per_minute" numeric(5,2),
        "likes_per_minute" numeric(5,2),
        "unique_viewers" integer,
        "returning_viewers" integer,
        "new_followers" integer,
        "peak_concurrent_viewers" integer,
        "top_countries" jsonb,
        "age_distribution" jsonb,
        "gender_distribution" jsonb,
        "total_revenue" numeric(10,2) DEFAULT '0',
        "revenue_from_gifts" numeric(10,2) DEFAULT '0',
        "revenue_from_tips" numeric(10,2) DEFAULT '0',
        "top_gifters" jsonb,
        "stream_quality" text,
        "buffering_events" integer DEFAULT 0,
        "disconnections" integer DEFAULT 0,
        "average_latency" integer,
        "voting_participation" numeric(5,2),
        "total_voting_pool" numeric(10,2),
        "average_vote_amount" numeric(10,2),
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);

    console.log('🏆 Creating creator_rankings table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "creator_rankings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "ranking_type" text NOT NULL,
        "period_start" timestamp NOT NULL,
        "period_end" timestamp NOT NULL,
        "overall_rank" integer,
        "category_rank" integer,
        "category" text,
        "total_streams" integer DEFAULT 0,
        "total_viewers" integer DEFAULT 0,
        "total_watch_time" integer DEFAULT 0,
        "total_revenue" numeric(15,2) DEFAULT '0',
        "average_viewer_count" numeric(8,2),
        "engagement_rate" numeric(5,2),
        "chat_activity" numeric(8,2),
        "battles_won" integer DEFAULT 0,
        "battles_lost" integer DEFAULT 0,
        "win_rate" numeric(5,2),
        "average_battle_score" numeric(10,2),
        "engagement_score" numeric(10,2),
        "consistency_score" numeric(10,2),
        "revenue_score" numeric(10,2),
        "total_score" numeric(10,2),
        "achievements" jsonb,
        "new_badges" jsonb,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);

    console.log('😍 Creating live_reactions table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "live_reactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "session_id" uuid NOT NULL REFERENCES "live_sessions"("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "reaction_type" text NOT NULL,
        "emoji" text NOT NULL,
        "position_x" numeric(5,2),
        "position_y" numeric(5,2),
        "timestamp" integer,
        "context_message" text,
        "created_at" timestamp DEFAULT now()
      );
    `);

    // Create indexes for performance
    console.log('📈 Creating performance indexes...');
    
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_live_sessions_creator_status" ON "live_sessions"("creator_id", "status");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_live_sessions_status_created" ON "live_sessions"("status", "created_at");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_live_sessions_category_status" ON "live_sessions"("category", "status");`);
    
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_chat_messages_session_created" ON "live_chat_messages"("session_id", "created_at");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_chat_messages_user_session" ON "live_chat_messages"("user_id", "session_id");`);
    
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_live_gifts_session_created" ON "live_gifts"("session_id", "created_at");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_live_gifts_recipient_created" ON "live_gifts"("recipient_id", "created_at");`);
    
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_battle_votes_battle_voter" ON "battle_votes"("battle_id", "voter_id");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_battle_votes_voted_for" ON "battle_votes"("voted_for", "created_at");`);
    
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_creator_rankings_period_rank" ON "creator_rankings"("ranking_type", "period_start", "overall_rank");`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_creator_rankings_user_period" ON "creator_rankings"("user_id", "ranking_type", "period_start");`);

    // Insert default gift types
    console.log('🎁 Inserting default gift types...');
    await db.execute(sql`
      INSERT INTO "gift_types" ("name", "emoji", "soft_points_value", "rarity", "color", "has_animation", "adds_to_score", "score_multiplier")
      VALUES 
        ('Heart', '❤️', 1, 'common', 'text-red-400', false, true, 1.0),
        ('Like', '👍', 2, 'common', 'text-blue-400', false, true, 1.0),
        ('Star', '⭐', 5, 'common', 'text-yellow-400', false, true, 1.0),
        ('Fire', '🔥', 10, 'rare', 'text-orange-400', true, true, 1.2),
        ('Diamond', '💎', 25, 'rare', 'text-blue-400', true, true, 1.5),
        ('Crown', '👑', 50, 'epic', 'text-yellow-400', true, true, 2.0),
        ('Rocket', '🚀', 100, 'epic', 'text-purple-400', true, true, 2.5),
        ('Rainbow', '🌈', 250, 'legendary', 'text-rainbow', true, true, 3.0)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Live/Battle tables migration completed successfully!');
    console.log('\n📋 Summary of created tables:');
    console.log('   • live_sessions - Main live streaming sessions');
    console.log('   • live_session_participants - Participants in live sessions');
    console.log('   • live_chat_messages - Real-time chat messages');
    console.log('   • gift_types - Catalog of available gifts');
    console.log('   • live_gifts - Gifts sent during streams/battles');
    console.log('   • battle_votes - SoftPoints voting system');
    console.log('   • live_session_analytics - Stream analytics and metrics');
    console.log('   • creator_rankings - Weekly/monthly leaderboards');
    console.log('   • live_reactions - Real-time reactions during streams');
    console.log('\n🚀 Your Live/Battle system is ready to use!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Live/Battle Tables Migration

Usage:
  npx tsx scripts/add-live-battle-tables-migration.ts

This script will:
  • Create all Live/Battle related database tables
  • Add performance indexes
  • Insert default gift types
  • Set up the complete Live/Battle system infrastructure

Environment Variables Required:
  DATABASE_URL - PostgreSQL connection string

Options:
  --help, -h    Show this help message
  `);
  process.exit(0);
}

if (require.main === module) {
  main();
}

export { main };
