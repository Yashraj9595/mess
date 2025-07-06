const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123',
  role: 'user'
};

let authToken = '';

// Helper function to make requests
const makeRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...(data && { data })
    };

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('🔍 Testing health check...');
  try {
    const response = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check passed:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
};

const testRegistration = async () => {
  console.log('\n📝 Testing user registration...');
  const result = await makeRequest('POST', '/register', testUser);
  
  if (result.success) {
    console.log('✅ Registration successful:', result.data.message);
    return true;
  } else {
    console.log('❌ Registration failed:', result.error.error?.message || result.error);
    return false;
  }
};

const testLogin = async () => {
  console.log('\n🔐 Testing user login...');
  const loginData = {
    email: testUser.email,
    password: testUser.password
  };
  
  const result = await makeRequest('POST', '/login', loginData);
  
  if (result.success) {
    console.log('✅ Login successful:', result.data.message);
    authToken = result.data.data.token;
    return true;
  } else {
    console.log('❌ Login failed:', result.error.error?.message || result.error);
    return false;
  }
};

const testGetProfile = async () => {
  console.log('\n👤 Testing get profile...');
  const result = await makeRequest('GET', '/me', null, authToken);
  
  if (result.success) {
    console.log('✅ Get profile successful:', result.data.data.user.name);
    return true;
  } else {
    console.log('❌ Get profile failed:', result.error.error?.message || result.error);
    return false;
  }
};

const testUpdateProfile = async () => {
  console.log('\n✏️ Testing profile update...');
  const updateData = {
    name: 'Updated Test User',
    phone: '+1234567890'
  };
  
  const result = await makeRequest('PUT', '/me', updateData, authToken);
  
  if (result.success) {
    console.log('✅ Profile update successful:', result.data.message);
    return true;
  } else {
    console.log('❌ Profile update failed:', result.error.error?.message || result.error);
    return false;
  }
};

const testChangePassword = async () => {
  console.log('\n🔑 Testing password change...');
  const passwordData = {
    currentPassword: testUser.password,
    newPassword: 'NewTestPass123'
  };
  
  const result = await makeRequest('PUT', '/change-password', passwordData, authToken);
  
  if (result.success) {
    console.log('✅ Password change successful:', result.data.message);
    return true;
  } else {
    console.log('❌ Password change failed:', result.error.error?.message || result.error);
    return false;
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Authentication API Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Registration', fn: testRegistration },
    { name: 'Login', fn: testLogin },
    { name: 'Get Profile', fn: testGetProfile },
    { name: 'Update Profile', fn: testUpdateProfile },
    { name: 'Change Password', fn: testChangePassword }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const result = await test.fn();
    if (result) passed++;
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Authentication system is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the server and try again.');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  makeRequest,
  testUser
}; 