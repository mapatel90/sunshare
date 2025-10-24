/**
 * Role Seeder
 * આ file માં roles table માટે sample data છે
 */

import { id } from 'date-fns/locale';
import { query } from '../db.js';

// Sample roles data
const sampleRoles = [
  {
    id: 1,
    name: 'Admin',
    status: '1',
  },
];

/**
 * Seed roles table
 */
export async function seedRole() {
  console.log('🌱 Seeding roles...');
  
  try {
    // Check if roles table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'roles'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('⚠️  Roles table does not exist, skipping...');
      return 0;
    }
    
    let seededCount = 0;
    
    for (const role of sampleRoles) {
      const result = await query(`
        INSERT INTO roles (name, status, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT (name) DO NOTHING
        RETURNING id
      `, [role.name, role.status]);
      
      if (result.rows.length > 0) {
        seededCount++;
      }
    }
    
    console.log(`✅ Roles seeded successfully (${seededCount} new roles)`);
    return seededCount;
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
}

/**
 * Clear seeded roles
 */
export async function clearSeededRoles() {
  console.log('🧹 Clearing seeded roles...');
  
  try {
    // Check if roles table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'roles'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('⚠️  Roles table does not exist, skipping...');
      return 0;
    }
    
    const result = await query(`
      DELETE FROM roles 
      WHERE name IN ('Admin')
    `);
    
    console.log(`✅ Cleared ${result.rowCount} seeded roles`);
    return result.rowCount;
  } catch (error) {
    console.error('❌ Error clearing seeded roles:', error);
    throw error;
  }
}

/**
 * Get seeded roles count
 */
export async function getSeededRolesCount() {
  try {
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'roles'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      return 0;
    }
    
    const result = await query(`
      SELECT COUNT(*) FROM roles 
      WHERE name IN ('Admin')
    `);
    
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('❌ Error getting seeded roles count:', error);
    return 0;
  }
}