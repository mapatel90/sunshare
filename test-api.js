// Simple API test script
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function testAPI() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testing API endpoints...');
  
  try {
    // Test health check
    console.log('\n1️⃣ Testing health check...');
    const healthResponse = await fetch(`${baseURL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test login
    console.log('\n2️⃣ Testing login...');
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@sunshare.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      console.log('✅ Login successful:', loginData.data.user.email);
      
      // Test getting user profile
      console.log('\n3️⃣ Testing user profile...');
      const token = loginData.data.token;
      const profileResponse = await fetch(`${baseURL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const profileData = await profileResponse.json();
      if (profileData.success) {
        console.log('✅ Profile retrieved:', profileData.data.firstName, profileData.data.lastName);
      } else {
        console.log('❌ Profile error:', profileData.message);
      }
      
      // Test getting users list
      console.log('\n4️⃣ Testing users list...');
      const usersResponse = await fetch(`${baseURL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const usersData = await usersResponse.json();
      if (usersData.success) {
        console.log('✅ Users list retrieved:', usersData.data.users.length, 'users');
      } else {
        console.log('❌ Users list error:', usersData.message);
      }
      
      // Test getting roles
      console.log('\n5️⃣ Testing roles list...');
      const rolesResponse = await fetch(`${baseURL}/api/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const rolesData = await rolesResponse.json();
      if (rolesData.success) {
        console.log('✅ Roles list retrieved:', rolesData.data.roles.length, 'roles');
      } else {
        console.log('❌ Roles list error:', rolesData.message);
      }
      
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
    
    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run tests if server is running
testAPI();