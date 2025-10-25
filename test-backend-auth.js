/**
 * Test Backend Server Authentication
 * આ script તમારા backend server ને test કરશે
 */

async function testBackendAuth() {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  
  console.log('🧪 Testing Backend Server Authentication...');
  console.log('📍 Server URL:', baseURL);
  
  try {
    // Test health check
    console.log('\n1️⃣ Testing health check...');
    const healthResponse = await fetch(`${baseURL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check:', healthData.message);
    } else {
      console.log('❌ Health check failed');
      return;
    }

    // Test login with admin
    console.log('\n2️⃣ Testing admin login...');
    const adminLoginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@sunshare.com',
        password: 'admin123'
      })
    });
    
    if (adminLoginResponse.ok) {
      const adminData = await adminLoginResponse.json();
      console.log('✅ Admin login successful:', `${adminData.data.user.firstName} ${adminData.data.user.lastName}`);
      
      // Test /me endpoint
      console.log('\n3️⃣ Testing /me endpoint...');
      const meResponse = await fetch(`${baseURL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${adminData.data.token}`
        }
      });
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        console.log('✅ /me endpoint working:', `${meData.data.firstName} ${meData.data.lastName}`);
      } else {
        console.log('❌ /me endpoint failed');
      }
      
    } else {
      const adminError = await adminLoginResponse.json();
      console.log('❌ Admin login failed:', adminError.message);
    }

    // Test login with test user
    console.log('\n4️⃣ Testing test user login...');
    const testLoginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'wrapcode.info@gmail.com',
        password: '123456'
      })
    });
    
    if (testLoginResponse.ok) {
      const testData = await testLoginResponse.json();
      console.log('✅ Test user login successful:', `${testData.data.user.firstName} ${testData.data.user.lastName}`);
    } else {
      const testError = await testLoginResponse.json();
      console.log('❌ Test user login failed:', testError.message);
    }
    
    console.log('\n🎉 Backend authentication testing completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.log('\n💡 Make sure your backend server is running:');
    console.log('   npm run server');
    console.log('   or');
    console.log('   npm run server:dev');
  }
}

// Run tests
testBackendAuth();