#!/usr/bin/env node

/**
 * Migration CLI Tool for Sunshare
 * આ tool તમને command line માંથી migrations manage કરવા માટે મદદ કરશે
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env.local') });

import { 
  runMigrations, 
  createMigration, 
  showStatus, 
  applyMigration, 
  rollbackMigration,
  resetMigrations 
} from '../lib/migrations.js';

const command = process.argv[2];
const argument = process.argv[3];

async function main() {
  try {
    switch (command) {
      case 'migrate':
      case 'up':
        console.log('🔄 Running migrations...');
        await runMigrations();
        break;
        
      case 'create':
        if (!argument) {
          console.error('❌ Please provide migration name');
          console.log('Usage: npm run migration create add_user_phone_column');
          process.exit(1);
        }
        await createMigration(argument);
        break;
        
      case 'status':
        await showStatus();
        break;
        
      case 'apply':
        if (!argument) {
          console.error('❌ Please provide migration filename');
          console.log('Usage: npm run migration apply 2024-01-01T10-00-00_add_user_phone.sql');
          process.exit(1);
        }
        await applyMigration(argument);
        break;
        
      case 'rollback':
        if (!argument) {
          console.error('❌ Please provide migration filename');
          console.log('Usage: npm run migration rollback 2024-01-01T10-00-00_add_user_phone.sql');
          process.exit(1);
        }
        await rollbackMigration(argument);
        break;
        
      case 'reset':
        console.log('⚠️  WARNING: This will rollback ALL migrations!');
        console.log('Type "yes" to confirm:');
        
        // Simple confirmation (in production, use readline)
        const confirmation = process.argv[3];
        if (confirmation === 'yes') {
          await resetMigrations();
        } else {
          console.log('❌ Reset cancelled');
        }
        break;
        
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ Migration command failed:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🗄️  Sunshare Migration Tool
============================

Available Commands:
  migrate, up     - Run all pending migrations
  create <name>   - Create a new migration file
  status          - Show migration status
  apply <file>    - Apply specific migration
  rollback <file> - Rollback specific migration
  reset           - Reset all migrations (DANGEROUS!)
  help            - Show this help

Examples:
  npm run migration create add_user_phone_column
  npm run migration up
  npm run migration status
  npm run migration apply 2024-01-01T10-00-00_add_user_phone.sql
  npm run migration rollback 2024-01-01T10-00-00_add_user_phone.sql

Migration File Structure:
  src/migrations/
  ├── 2024-01-01T10-00-00_add_user_phone.sql
  ├── 2024-01-01T10-00-00_add_user_phone.rollback.sql
  └── ...

For more details, see MIGRATION_GUIDE.md
`);
}

main();
