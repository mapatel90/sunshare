#!/usr/bin/env node

/**
 * Database Setup Helper for Sunshare
 * આ script તમને database setup માં મદદ કરશે
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env.local') });

import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
  console.log(`
🗄️  Sunshare Database Setup
============================

This will help you configure your database connection.
Make sure PostgreSQL is running and you have the credentials ready.

`);

  try {
    const dbHost = await question('Database Host (default: localhost): ') || 'localhost';
    const dbPort = await question('Database Port (default: 5432): ') || '5432';
    const dbUser = await question('Database User (default: postgres): ') || 'postgres';
    const dbPassword = await question('Database Password: ');
    const dbName = await question('Database Name (default: sunshare_db): ') || 'sunshare_db';

    if (!dbPassword) {
      console.log('❌ Database password is required!');
      process.exit(1);
    }

    const envContent = `# Sunshare Environment Variables

# Database Configuration
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}
DATABASE_URL=postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Application
NODE_ENV=development
`;

    fs.writeFileSync('.env.local', envContent);
    
    console.log(`
✅ Database configuration saved to .env.local

Next steps:
1. Make sure PostgreSQL is running
2. Create database '${dbName}' in pgAdmin
3. Run: npm run migrate
4. Test: npm run dev

Happy coding! 🚀
`);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupDatabase();
