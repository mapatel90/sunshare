/**
 * Main Seeder
 * આ file બધા individual seeders ને import કરે છે અને manage કરે છે
 */

import { seedUsers, clearSeededUsers, getSeededUsersCount } from './seeders/userSeeder.js';
import { seedRole, clearSeededRoles, getSeededRolesCount } from './seeders/roleSeeder.js';

/**
 * Main seeder function
 */
export async function runSeeder(options = {}) {
  const { 
    clear = false, 
    users = true, 
    roles = true,
  } = options;
  
  console.log(`
🌱 Sunshare Database Seeder
============================
Options:
- Clear existing data: ${clear}
- Seed users: ${users}
- Seed roles: ${roles}

`);

  try {
    let totalSeeded = 0;
    
    if (clear) {
      console.log('🧹 Clearing existing seeded data...');
      await clearSeededUsers();
      await clearSeededRoles();
    }
    
    if (roles) {
      const roleCount = await seedRole();
      totalSeeded += roleCount;
    }
    
    if (users) {
      const userCount = await seedUsers();
      totalSeeded += userCount;
    }
    
    console.log(`
🎉 Seeding completed successfully!

Total items seeded: ${totalSeeded}

You can now:
1. Login with admin@sunshare.com / admin123
2. Test with other sample users
3. View seeded projects, tasks, and customers

Happy coding! 🚀
`);
    
    return {
      success: true,
      totalSeeded,
      details: {
        roles: roles ? await getSeededRolesCount() : 0,
        users: users ? await getSeededUsersCount() : 0
      }
    };
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

/**
 * Run specific seeder
 */
export async function runSpecificSeeder(seederName, options = {}) {
  console.log(`🌱 Running ${seederName} seeder...`);
  
  try {
    switch (seederName) {
      case 'roles':
        if (options.clear) await clearSeededRoles();
        return await seedRole();
        
      case 'users':
        if (options.clear) await clearSeededUsers();
        return await seedUsers();
        
      default:
        throw new Error(`Unknown seeder: ${seederName}`);
    }
  } catch (error) {
    console.error(`❌ ${seederName} seeder failed:`, error);
    throw error;
  }
}

/**
 * Get seeder status
 */
export async function getSeederStatus() {
  try {
    const status = {
      roles: await getSeededRolesCount(),
      users: await getSeededUsersCount(),
    };
    
    console.log('📊 Seeder Status:');
    console.log(`- Roles: ${status.roles}`);
    console.log(`- Users: ${status.users}`);

    return status;
  } catch (error) {
    console.error('❌ Error getting seeder status:', error);
    throw error;
  }
}

/**
 * CLI interface for running seeder
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {
    clear: args.includes('--clear'),
    roles: !args.includes('--no-roles'),
    users: !args.includes('--no-users')
  };
  
  // Check for specific seeder
  const specificSeeder = args.find(arg => arg.startsWith('--seeder='));
  if (specificSeeder) {
    const seederName = specificSeeder.split('=')[1];
    runSpecificSeeder(seederName, options);
  } else {
    runSeeder(options);
  }
}
