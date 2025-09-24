const { MongoClient } = require('mongodb');

// MongoDB connection string (replace with your actual connection string)
const uri = 'mongodb://localhost:27017/your-database-name'; // Update this with your actual MongoDB URI

// Sample coupon data
const sampleCoupons = [
  {
    code: 'WELCOME10',
    discount: 10,
    minAmount: 100,
    description: '10% off orders over $100',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'SAVE20',
    discount: 20,
    minAmount: 200,
    description: '20% off orders over $200',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'MEGA50',
    discount: 50,
    minAmount: 500,
    description: '50% off orders over $500',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'NEWUSER',
    discount: 15,
    minAmount: 50,
    description: '15% off for new users',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function insertTestCoupons() {
  let client;
  
  try {
    // Create a new MongoClient
    client = new MongoClient(uri);
    
    // Connect to the MongoDB cluster
    await client.connect();
    
    // Get the database and collection
    const database = client.db();
    const collection = database.collection('allCoupons');
    
    // Insert sample coupons
    const result = await collection.insertMany(sampleCoupons);
    
    console.log(`${result.insertedCount} coupons were inserted`);
    console.log('Inserted coupon codes:', sampleCoupons.map(c => c.code).join(', '));
    
  } catch (error) {
    console.error('Error inserting test coupons:', error);
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

insertTestCoupons();