import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default roles
  const roles = [
    { id: 1, name: 'superadmin', status: 1 },
    { id: 2, name: 'staffadmin', status: 1 },
    { id: 3, name: 'Offtaker', status: 1 },
  ];

  console.log('📝 Creating roles...');
  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData
    });
    console.log(`✅ Role created: ${roleData.name}`);
  }

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  console.log('👤 Creating admin user...');
  await prisma.user.upsert({
    where: { email: 'admin@sunshare.com' },
    update: {},
    create: {
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@sunshare.com',
      password: adminPassword,
      userRole: 1,
      phoneNumber: '+1234567890',
      status: 1 // Active
    }
  });
  console.log('✅ Admin user created: admin@sunshare.com (password: admin123)');

  // Create sample users
  const sampleUsers = [
    {
      firstName: 'John',
      lastName: 'Manager',
      email: 'manager@sunshare.com',
      userRole: 2,
      phoneNumber: '+1234567891'
    },
    {
      firstName: 'Test',
      lastName: 'User',
      email: 'wrapcode.info@gmail.com',
      userRole: 3,
      phoneNumber: '+1234567892'
    }
  ];

  console.log('👥 Creating sample users...');
  const defaultPassword = await bcrypt.hash('password123', 12);
  const testPassword = await bcrypt.hash('123456', 12);
  
  for (const userData of sampleUsers) {
    const password = userData.email === 'wrapcode.info@gmail.com' ? testPassword : defaultPassword;
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: password,
        status: 1 // Active
      }
    });
    const passwordText = userData.email === 'wrapcode.info@gmail.com' ? '123456' : 'password123';
    console.log(`✅ User created: ${userData.email} (password: ${passwordText})`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });