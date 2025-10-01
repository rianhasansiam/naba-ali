import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';
import { checkOrigin, isAdmin, forbiddenResponse } from '../../../lib/security';

// GET - Get all products (Public - Anyone can view)
export async function GET(request) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Get the products collection
    const products = await getCollection('allProducts');
    
    // Find all products
    const allProducts = await products.find({}).toArray();

    return NextResponse.json(allProducts);

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch products" 
    }, { status: 500 });
  }
} // End of GET function

// POST - Create new product (Admin only)
export async function POST(request) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return forbiddenResponse('Only admins can create products');
    }

    // Get the products collection
    const products = await getCollection('allProducts');
    
    // Get the request body
    const body = await request.json();
    
    // Insert the new product
    const productData = await products.insertOne({...body, createdAt: new Date()});

    return NextResponse.json({
      success: true,
      Data: productData,
      message: "Product created successfully"
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: "Failed to create product" 
    }, { status: 500 });
  }
} // End of POST function