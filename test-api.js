// Simple test to verify API responses
async function testAPIs() {
  try {
    console.log('Testing API endpoints...');
    
    // Test orders API
    const ordersResponse = await fetch('http://localhost:3001/api/orders');
    const ordersData = await ordersResponse.json();
    console.log('Orders API Response:', ordersData);
    
    if (ordersData.success && ordersData.data) {
      console.log('Orders count:', ordersData.data.length);
      if (ordersData.data.length > 0) {
        console.log('Sample order structure:', ordersData.data[0]);
      }
    }
    
    // Test users API
    const usersResponse = await fetch('http://localhost:3001/api/users');
    const usersData = await usersResponse.json();
    console.log('Users API Response:', usersData);
    
    if (usersData.success && usersData.data) {
      console.log('Users count:', usersData.data.length);
      if (usersData.data.length > 0) {
        console.log('Sample user structure:', usersData.data[0]);
      }
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run in browser console or Node.js
if (typeof window !== 'undefined') {
  // Browser
  testAPIs();
} else {
  // Node.js
  const fetch = require('node-fetch');
  testAPIs();
}