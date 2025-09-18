import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection string from environment variable
const uri = process.env.MONGODB_URI;

// Check if the environment variable is set
if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// MongoDB client configuration
const options = {
  serverApi: {
    version: ServerApiVersion.v1,  // Use MongoDB Server API version 1
    strict: true,                  // Enable strict mode for better error checking
    deprecationErrors: true,       // Show warnings for deprecated features
  }
};

// Create a global variable to store the client
let client;
let clientPromise;





// In development, use a global variable to preserve the client across hot reloads
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}






// Simple function to get database connection
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const database = client.db(process.env.MONGODB_DB || 'naba-ali');
    return { client, database };
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}




// Helper function to get a specific collection
export async function getCollection(collectionName) {
  try {
    const { database } = await connectToDatabase();
    return database.collection(collectionName);
  } catch (error) {
    console.error(`Failed to get collection ${collectionName}:`, error);
    throw error;
  }
}

// Export the client promise for advanced usage
export default clientPromise;
