/**
 * MongoDB Database Indexing Guide
 * ================================
 * 
 * IMPORTANT: Run these indexes on your MongoDB database for optimal performance
 * 
 * You can run these in MongoDB Compass, MongoDB Shell, or via a migration script:
 * 
 * HOW TO APPLY:
 * 1. Connect to your MongoDB database
 * 2. Select your database (e.g., 'naba-ali')
 * 3. Run the commands below in MongoDB Shell or Compass
 * 
 * OR create a script file and run: node lib/mongodb-indexes.js
 */

import { connectToDatabase } from './mongodb.js';

/**
 * Database indexes for optimal query performance
 */
const DATABASE_INDEXES = {
  // Products Collection Indexes
  allProducts: [
    { key: { category: 1 }, name: 'category_index' },
    { key: { isInStock: 1 }, name: 'stock_index' },
    { key: { price: 1 }, name: 'price_index' },
    { key: { createdAt: -1 }, name: 'created_date_index' },
    { key: { name: 'text', description: 'text' }, name: 'product_text_search' },
    { key: { category: 1, isInStock: 1, price: 1 }, name: 'category_stock_price_compound' }
  ],

  // Categories Collection Indexes
  allCategories: [
    { key: { name: 1 }, name: 'category_name_index', unique: true },
    { key: { isActive: 1 }, name: 'active_status_index' }
  ],

  // Users Collection Indexes
  allUsers: [
    { key: { email: 1 }, name: 'email_index', unique: true },
    { key: { role: 1 }, name: 'role_index' },
    { key: { createdAt: -1 }, name: 'user_created_date_index' },
    { key: { lastLoginAt: -1 }, name: 'last_login_index' }
  ],

  // Orders Collection Indexes
  allOrders: [
    { key: { userEmail: 1 }, name: 'user_email_index' },
    { key: { orderStatus: 1 }, name: 'order_status_index' },
    { key: { createdAt: -1 }, name: 'order_date_index' },
    { key: { userEmail: 1, createdAt: -1 }, name: 'user_orders_compound' }
  ],

  // Reviews Collection Indexes
  allReviews: [
    { key: { productId: 1 }, name: 'product_id_index' },
    { key: { userEmail: 1 }, name: 'reviewer_email_index' },
    { key: { isApproved: 1 }, name: 'approval_status_index' },
    { key: { createdAt: -1 }, name: 'review_date_index' },
    { key: { productId: 1, isApproved: 1 }, name: 'product_approved_reviews' }
  ],

  // Carts Collection Indexes
  allCarts: [
    { key: { userEmail: 1 }, name: 'cart_user_index', unique: true },
    { key: { updatedAt: -1 }, name: 'cart_updated_index' }
  ],

  // Coupons Collection Indexes
  allCoupons: [
    { key: { code: 1 }, name: 'coupon_code_index', unique: true },
    { key: { isActive: 1 }, name: 'coupon_active_index' },
    { key: { expiryDate: 1 }, name: 'coupon_expiry_index' }
  ]
};

/**
 * Create all recommended indexes
 */
export async function createRecommendedIndexes() {
  try {
    console.log('🚀 Starting database index creation...\n');
    
    const { database } = await connectToDatabase();
    let totalIndexes = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const [collectionName, indexes] of Object.entries(DATABASE_INDEXES)) {
      console.log(`📊 Creating indexes for collection: ${collectionName}`);
      
      try {
        const collection = database.collection(collectionName);
        
        for (const indexSpec of indexes) {
          try {
            totalIndexes++;
            const options = { name: indexSpec.name };
            if (indexSpec.unique) options.unique = true;
            
            await collection.createIndex(indexSpec.key, options);
            console.log(`  ✅ Created index: ${indexSpec.name}`);
            successCount++;
          } catch (indexError) {
            // Index might already exist
            if (indexError.code === 85 || indexError.message.includes('already exists')) {
              console.log(`  ℹ️  Index already exists: ${indexSpec.name}`);
              successCount++;
            } else {
              console.error(`  ❌ Failed to create index ${indexSpec.name}:`, indexError.message);
              errorCount++;
            }
          }
        }
        
        console.log('');
      } catch (collectionError) {
        console.error(`  ❌ Error accessing collection ${collectionName}:`, collectionError.message);
        errorCount += indexes.length;
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('📈 Index Creation Summary:');
    console.log(`   Total Indexes: ${totalIndexes}`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('═══════════════════════════════════════\n');

    if (errorCount === 0) {
      console.log('✨ All indexes created successfully!\n');
    } else {
      console.log('⚠️  Some indexes failed. Check errors above.\n');
    }

    return { totalIndexes, successCount, errorCount };
  } catch (error) {
    console.error('❌ Fatal error creating indexes:', error);
    throw error;
  }
}

/**
 * List all indexes in the database
 */
export async function listAllIndexes() {
  try {
    const { database } = await connectToDatabase();
    const collections = await database.listCollections().toArray();

    console.log('\n📋 Current Database Indexes:\n');

    for (const collInfo of collections) {
      const collection = database.collection(collInfo.name);
      const indexes = await collection.indexes();
      
      console.log(`\n📊 Collection: ${collInfo.name}`);
      indexes.forEach(index => {
        console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
      });
    }

    console.log('\n');
  } catch (error) {
    console.error('❌ Error listing indexes:', error);
    throw error;
  }
}

// If running directly from command line
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   MongoDB Index Creation Script           ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  createRecommendedIndexes()
    .then(() => {
      console.log('✨ Index creation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Index creation failed:', error);
      process.exit(1);
    });
}

/**
 * MANUAL MONGODB SHELL COMMANDS
 * ==============================
 * 
 * If you prefer to run these manually in MongoDB Shell:
 * 
 * use naba-ali
 * 
 * // Products
 * db.allProducts.createIndex({ category: 1 })
 * db.allProducts.createIndex({ isInStock: 1 })
 * db.allProducts.createIndex({ price: 1 })
 * db.allProducts.createIndex({ createdAt: -1 })
 * db.allProducts.createIndex({ name: "text", description: "text" })
 * db.allProducts.createIndex({ category: 1, isInStock: 1, price: 1 })
 * 
 * // Categories
 * db.allCategories.createIndex({ name: 1 }, { unique: true })
 * db.allCategories.createIndex({ isActive: 1 })
 * 
 * // Users
 * db.allUsers.createIndex({ email: 1 }, { unique: true })
 * db.allUsers.createIndex({ role: 1 })
 * db.allUsers.createIndex({ createdAt: -1 })
 * db.allUsers.createIndex({ lastLoginAt: -1 })
 * 
 * // Orders
 * db.allOrders.createIndex({ userEmail: 1 })
 * db.allOrders.createIndex({ orderStatus: 1 })
 * db.allOrders.createIndex({ createdAt: -1 })
 * db.allOrders.createIndex({ userEmail: 1, createdAt: -1 })
 * 
 * // Reviews
 * db.allReviews.createIndex({ productId: 1 })
 * db.allReviews.createIndex({ userEmail: 1 })
 * db.allReviews.createIndex({ isApproved: 1 })
 * db.allReviews.createIndex({ createdAt: -1 })
 * db.allReviews.createIndex({ productId: 1, isApproved: 1 })
 * 
 * // Carts
 * db.allCarts.createIndex({ userEmail: 1 }, { unique: true })
 * db.allCarts.createIndex({ updatedAt: -1 })
 * 
 * // Coupons
 * db.allCoupons.createIndex({ code: 1 }, { unique: true })
 * db.allCoupons.createIndex({ isActive: 1 })
 * db.allCoupons.createIndex({ expiryDate: 1 })
 */
