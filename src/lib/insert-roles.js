#!/usr/bin/env node

/**
 * Simple Role Seeder Test
 * આ script roles table માં direct data insert કરે છે
 */

import { query } from './db.js';

async function insertRoles() {
  console.log('🌱 Inserting roles directly...');
  
  try {
    // Insert Admin role
    const adminResult = await query(`
      INSERT INTO roles (name, status, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
      RETURNING id
    `, ['Admin', 1]);
    
    if (adminResult.rows.length > 0) {
      console.log('✅ Admin role inserted successfully');
    } else {
      console.log('⚠️  Admin role already exists');
    }
    
    // Insert User role
    const userResult = await query(`
      INSERT INTO roles (name, status, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
      RETURNING id
    `, ['User', 1]);
    
    if (userResult.rows.length > 0) {
      console.log('✅ User role inserted successfully');
    } else {
      console.log('⚠️  User role already exists');
    }
    
    // Check total roles
    const countResult = await query('SELECT COUNT(*) FROM roles');
    console.log(`📊 Total roles in database: ${countResult.rows[0].count}`);
    
    // List all roles
    const allRoles = await query('SELECT * FROM roles ORDER BY id');
    console.log('\n📋 All roles:');
    allRoles.rows.forEach(role => {
      console.log(`- ${role.id}: ${role.name} (status: ${role.status})`);
    });
    
  } catch (error) {
    console.error('❌ Error inserting roles:', error);
  }
}

insertRoles();
