/**
 * User Seeder
 * આ file માં users table માટે sample data છે
 */

import { query } from '../db.js';
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
export async function seedUsers() {
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
 * Clear seeded users
 */
export async function clearSeededUsers() {
  console.log('🧹 Clearing seeded users...');
  
  try {
    const result = await query(`
      DELETE FROM users 
      WHERE email LIKE '%@example.com' 
         OR email = 'admin@sunshare.com'
    `);
    
    console.log(`✅ Cleared ${result.rowCount} seeded users`);
    return result.rowCount;
  } catch (error) {
    console.error('❌ Error clearing seeded users:', error);
    throw error;
  }
}

/**
 * Get seeded users count
 */
export async function getSeededUsersCount() {
  try {
    const result = await query(`
      SELECT COUNT(*) FROM users 
      WHERE email LIKE '%@example.com' 
         OR email = 'admin@sunshare.com'
    `);
    
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('❌ Error getting seeded users count:', error);
    return 0;
  }
}
