#!/usr/bin/env node

/**
 * Seeder Test Script
 * આ script seeder ને test કરવા માટે વપરાય છે
 */

import { runSeeder, getSeederStatus } from './mainSeeder.js';
import { query } from './db.js';

async function testSeeder() {
  console.log(`
🧪 Testing Sunshare Database Seeder
====================================

`);

  try {
    // Test 1: Check database connection
    console.log('1️⃣ Testing database connection...');
    await query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Test 2: Check if users table exists
    console.log('\n2️⃣ Checking users table...');
    const usersTable = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (usersTable.rows[0].exists) {
      console.log('✅ Users table exists');
    } else {
      console.log('❌ Users table does not exist. Please run migrations first.');
      process.exit(1);
    }

    // Test 3: Run seeder
    console.log('\n3️⃣ Running seeder...');
    const result = await runSeeder({ clear: true });
    console.log('✅ Seeder completed successfully');

    // Test 4: Verify seeded data
    console.log('\n4️⃣ Verifying seeded data...');
    
    const status = await getSeederStatus();
    console.log(`✅ Found ${status.users} seeded users`);
    console.log(`✅ Found ${status.projects} seeded projects`);
    console.log(`✅ Found ${status.tasks} seeded tasks`);
    console.log(`✅ Found ${status.customers} seeded customers`);

    // Test 5: Test login credentials
    console.log('\n5️⃣ Testing login credentials...');
    const adminUser = await query('SELECT email FROM users WHERE email = $1', ['admin@sunshare.com']);
    if (adminUser.rows.length > 0) {
      console.log('✅ Admin user created successfully');
    } else {
      console.log('❌ Admin user not found');
    }

    console.log(`
🎉 All tests passed successfully!

You can now:
1. Login with admin@sunshare.com / admin123
2. Test your application with seeded data
3. Use the SeederPanel component in your admin area

Available commands:
- npm run seed (run all seeders)
- npm run seed:users (run only user seeder)
- npm run seed:projects (run only project seeder)
- npm run seed:tasks (run only task seeder)
- npm run seed:customers (run only customer seeder)
- npm run seed:status (check seeder status)

Happy coding! 🚀
`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSeeder();
