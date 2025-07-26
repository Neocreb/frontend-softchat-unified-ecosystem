import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

/**
 * Add duet-related fields to the posts table
 */
async function addDuetFields() {
  console.log('🚀 Starting duet fields migration...');

  try {
    // Check if duet fields already exist
    const checkQuery = sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'posts' 
      AND column_name IN ('is_duet', 'duet_of_post_id', 'original_creator_id', 'original_creator_username', 'duet_style', 'audio_source', 'duet_video_url', 'original_video_url')
    `;
    
    const existingColumns = await db.execute(checkQuery);
    
    if (existingColumns.length > 0) {
      console.log('⚠️  Duet fields already exist. Skipping migration.');
      console.log('Existing duet columns:', existingColumns.map(row => row.column_name));
      return;
    }

    // Add duet fields to posts table
    console.log('📝 Adding duet fields to posts table...');
    
    await db.execute(sql`
      ALTER TABLE posts 
      ADD COLUMN is_duet BOOLEAN DEFAULT FALSE,
      ADD COLUMN duet_of_post_id UUID REFERENCES posts(id),
      ADD COLUMN original_creator_id UUID REFERENCES users(id),
      ADD COLUMN original_creator_username TEXT,
      ADD COLUMN duet_style TEXT,
      ADD COLUMN audio_source TEXT DEFAULT 'both',
      ADD COLUMN duet_video_url TEXT,
      ADD COLUMN original_video_url TEXT
    `);

    console.log('✅ Successfully added duet fields to posts table');

    // Create indexes for better query performance
    console.log('📊 Creating indexes for duet fields...');
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_posts_is_duet ON posts(is_duet);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_posts_duet_of_post_id ON posts(duet_of_post_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_posts_original_creator_id ON posts(original_creator_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_posts_duet_style ON posts(duet_style);
    `);

    console.log('✅ Successfully created indexes for duet fields');

    // Add constraints for duet validation
    console.log('🔒 Adding duet validation constraints...');
    
    await db.execute(sql`
      ALTER TABLE posts 
      ADD CONSTRAINT check_duet_style 
      CHECK (duet_style IS NULL OR duet_style IN ('side-by-side', 'react-respond', 'picture-in-picture'))
    `);
    
    await db.execute(sql`
      ALTER TABLE posts 
      ADD CONSTRAINT check_audio_source 
      CHECK (audio_source IN ('original', 'both', 'voiceover'))
    `);
    
    await db.execute(sql`
      ALTER TABLE posts 
      ADD CONSTRAINT check_duet_logic 
      CHECK (
        (is_duet = FALSE AND duet_of_post_id IS NULL) OR 
        (is_duet = TRUE AND duet_of_post_id IS NOT NULL)
      )
    `);

    console.log('✅ Successfully added duet validation constraints');

    // Insert sample duet data for testing
    console.log('🧪 Inserting sample duet data for testing...');
    
    // First, let's check if we have any existing posts to create duets from
    const existingPosts = await db.execute(sql`
      SELECT id, user_id, video_url 
      FROM posts 
      WHERE video_url IS NOT NULL 
      LIMIT 1
    `);

    if (existingPosts.length > 0) {
      const originalPost = existingPosts[0];
      
      // Get a different user for the duet
      const users = await db.execute(sql`
        SELECT id 
        FROM users 
        WHERE id != ${originalPost.user_id} 
        LIMIT 1
      `);

      if (users.length > 0) {
        const duetUser = users[0];
        
        // Get the original creator's username
        const creatorProfile = await db.execute(sql`
          SELECT username 
          FROM profiles 
          WHERE user_id = ${originalPost.user_id} 
          LIMIT 1
        `);

        const creatorUsername = creatorProfile[0]?.username || 'unknown';

        // Insert a sample duet
        await db.execute(sql`
          INSERT INTO posts (
            user_id, 
            content, 
            video_url, 
            type, 
            is_duet, 
            duet_of_post_id, 
            original_creator_id, 
            original_creator_username, 
            duet_style, 
            audio_source,
            duet_video_url,
            original_video_url
          ) VALUES (
            ${duetUser.id},
            'Amazing duet with @' || ${creatorUsername} || '! 🎭 #duet #collaboration',
            'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
            'video',
            TRUE,
            ${originalPost.id},
            ${originalPost.user_id},
            ${creatorUsername},
            'side-by-side',
            'both',
            'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
            ${originalPost.video_url}
          )
        `);

        console.log('✅ Successfully inserted sample duet data');
      } else {
        console.log('⚠️  No additional users found for sample duet creation');
      }
    } else {
      console.log('⚠️  No existing video posts found for sample duet creation');
    }

    console.log('🎉 Duet fields migration completed successfully!');
    console.log('\n📋 Migration Summary:');
    console.log('  ✅ Added 8 duet-related fields to posts table');
    console.log('  ✅ Created 4 performance indexes');
    console.log('  ✅ Added 3 validation constraints');
    console.log('  ✅ Inserted sample duet data (if possible)');
    console.log('\n🔧 New Duet Fields:');
    console.log('  - is_duet: BOOLEAN (default: FALSE)');
    console.log('  - duet_of_post_id: UUID (references posts.id)');
    console.log('  - original_creator_id: UUID (references users.id)');
    console.log('  - original_creator_username: TEXT');
    console.log('  - duet_style: TEXT (side-by-side, react-respond, picture-in-picture)');
    console.log('  - audio_source: TEXT (original, both, voiceover)');
    console.log('  - duet_video_url: TEXT');
    console.log('  - original_video_url: TEXT');

  } catch (error) {
    console.error('❌ Error during duet fields migration:', error);
    throw error;
  }
}

/**
 * Rollback duet fields (for testing purposes)
 */
async function rollbackDuetFields() {
  console.log('🔄 Rolling back duet fields migration...');

  try {
    // Drop constraints
    await db.execute(sql`
      ALTER TABLE posts 
      DROP CONSTRAINT IF EXISTS check_duet_style,
      DROP CONSTRAINT IF EXISTS check_audio_source,
      DROP CONSTRAINT IF EXISTS check_duet_logic
    `);

    // Drop indexes
    await db.execute(sql`
      DROP INDEX IF EXISTS idx_posts_is_duet,
      DROP INDEX IF EXISTS idx_posts_duet_of_post_id,
      DROP INDEX IF EXISTS idx_posts_original_creator_id,
      DROP INDEX IF EXISTS idx_posts_duet_style
    `);

    // Drop columns
    await db.execute(sql`
      ALTER TABLE posts 
      DROP COLUMN IF EXISTS is_duet,
      DROP COLUMN IF EXISTS duet_of_post_id,
      DROP COLUMN IF EXISTS original_creator_id,
      DROP COLUMN IF EXISTS original_creator_username,
      DROP COLUMN IF EXISTS duet_style,
      DROP COLUMN IF EXISTS audio_source,
      DROP COLUMN IF EXISTS duet_video_url,
      DROP COLUMN IF EXISTS original_video_url
    `);

    console.log('✅ Successfully rolled back duet fields migration');
  } catch (error) {
    console.error('❌ Error during rollback:', error);
    throw error;
  }
}

// Main execution
async function main() {
  const command = process.argv[2];

  if (command === 'rollback') {
    await rollbackDuetFields();
  } else {
    await addDuetFields();
  }

  await client.end();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

export { addDuetFields, rollbackDuetFields };
