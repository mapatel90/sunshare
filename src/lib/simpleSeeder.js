#!/usr/bin/env node

/**
 * Simple User Seeder
 * આ script માત્ર users ને seed કરે છે
 */

import { query } from './db.js';
import bcrypt from 'bcryptjs';

// Sample users data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@sunshare.com',
    password: 'admin123',
    phone: '+91 9876543210',
    role: '1' // Admin role
  }
];

/**
 * Hash password using bcrypt
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Seed users table
 */
async function seedUsers() {
  console.log('🌱 Seeding users...');
  
  try {
    let seededCount = 0;
    
    for (const user of sampleUsers) {
      const hashedPassword = await hashPassword(user.password);
      
      const result = await query(`
        INSERT INTO users (name, email, password, phone, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `, [user.name, user.email, hashedPassword, user.phone, user.role]);
      
      if (result.rows.length > 0) {
        seededCount++;
        console.log(`✅ User created: ${user.email}`);
      } else {
        console.log(`⚠️  User already exists: ${user.email}`);
      }
    }
    
    console.log(`✅ Users seeded successfully (${seededCount} new users)`);
    return seededCount;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log(`
🌱 Simple User Seeder
=====================

`);
  
  try {
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      process.exit(1);
    }
    
    // Check if users table exists
    const usersTable = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (!usersTable.rows[0].exists) {
      console.log('❌ Users table does not exist. Please run migrations first.');
      console.log('Run: npm run migrate');
      process.exit(1);
    }
    
    // Seed users
    await seedUsers();
    
    console.log(`
🎉 Seeding completed successfully!

You can now login with:
- Email: admin@sunshare.com
- Password: admin123

Happy coding! 🚀
`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
