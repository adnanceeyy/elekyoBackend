const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing Backend Connection...');

  // 1. Check Root
  try {
    const res = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint reachable:', res.data);
  } catch (error) {
    console.error('❌ Root endpoint failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   -> Server is NOT running on port 5000.');
      return;
    }
  }

  // 2. Check Products
  try {
    console.log('🔄 Fetching products...');
    const res = await axios.get(`${BASE_URL}/api/products`);
    console.log(`✅ Products endpoint works. Found ${res.data.length} products.`);
  } catch (error) {
    console.error('❌ Products endpoint failed:', error.message);
  }

  // 3. Check Login (Expected 401 for bad creds)
  try {
    console.log('🔄 Testing Login endpoint...');
    await axios.post(`${BASE_URL}/api/users/login`, {
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    console.log('❓ Login unexpectedly succeeded with bad creds?');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Login endpoint reachable (returned 401 as expected).');
    } else {
      console.error('❌ Login endpoint failed with:', error.message);
      if (error.response) console.error('   Status:', error.response.status);
    }
  }
}

testBackend();
