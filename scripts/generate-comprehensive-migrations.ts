#!/usr/bin/env tsx

import { execSync } from 'child_process';
import path from 'path';

/**
 * Comprehensive migration generation script
 * This script generates database migrations for all new schema files
 */

async function generateMigrations() {
  console.log('🚀 Starting comprehensive database migration generation...');
  
  try {
    // Generate migrations for all schemas
    console.log('📊 Generating migrations for all comprehensive schemas...');
    
    const result = execSync('npx drizzle-kit generate', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log('✅ Migration generation output:');
    console.log(result);
    
    console.log('\n🎉 Comprehensive migrations generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated migration files in ./migrations/');
    console.log('2. Run migrations with: npm run db:migrate');
    console.log('3. Verify all tables are created properly');
    
    console.log('\n📚 New schemas included:');
    console.log('- Video schema: TikTok-style videos, processing, battles, duets');
    console.log('- Social schema: Posts, stories, comments, follows, groups, pages');
    console.log('- AI schema: Content analysis, recommendations, moderation, trends');
    console.log('- Notifications schema: Multi-channel notifications, campaigns, preferences');
    
  } catch (error) {
    console.error('❌ Error generating migrations:', error);
    process.exit(1);
  }
}

// Run the migration generation
generateMigrations().catch(console.error);
