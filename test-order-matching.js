// Test script to verify order data structure and user-order matching
const { MongoClient } = require('mongodb');

async function testOrderUserMatching() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database');
  
  try {
    await client.connect();
    const db = client.db();
    
    // Get sample order and user data
    const orders = await db.collection('allOrders').find({}).limit(5).toArray();
    const users = await db.collection('users').find({}).limit(5).toArray();
    
    console.log('Sample Orders Structure:');
    orders.forEach((order, index) => {
      console.log(`\nOrder ${index + 1}:`);
      console.log('- ID:', order._id);
      console.log('- OrderId:', order.orderId);
      console.log('- Customer Info:', order.customerInfo ? 'Present' : 'Missing');
      if (order.customerInfo) {
        console.log('  - Customer Email:', order.customerInfo.email);
        console.log('  - Customer Name:', order.customerInfo.name);
      }
      console.log('- Order Summary:', order.orderSummary ? 'Present' : 'Missing');
      if (order.orderSummary) {
        console.log('  - Total:', order.orderSummary.total);
      }
      console.log('- Status:', order.status);
      console.log('- Items Count:', order.items ? order.items.length : 0);
    });

    console.log('\n\nSample Users Structure:');
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('- ID:', user._id);
      console.log('- Email:', user.email);
      console.log('- Name:', user.name);
      console.log('- Role:', user.role);
    });

    // Test matching logic
    console.log('\n\nTesting Order-User Matching:');
    users.forEach(user => {
      const matchingOrders = orders.filter(order => {
        if (!order || !order.customerInfo) return false;
        return order.customerInfo.email === user.email;
      });
      
      console.log(`\nUser: ${user.name} (${user.email})`);
      console.log(`Matching Orders: ${matchingOrders.length}`);
      matchingOrders.forEach(order => {
        console.log(`  - Order ID: ${order.orderId}, Total: $${order.orderSummary?.total || 0}`);
      });
    });
    
  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    await client.close();
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testOrderUserMatching();
}

module.exports = { testOrderUserMatching };