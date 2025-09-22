import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';

// GET - Get all products
export async function GET(request) {
  try {
    // Get the products collection
    const products = await getCollection('allProducts');
    
    // Find all products
    const allProducts = await products.find({}).toArray();
    
    return NextResponse.json(
      allProducts
    );

  } catch (error) {
    console.error("Error fetching products:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch products" 
    }, { status: 500 });
  }
} // End of GET function

// POST - Create new product
export async function POST(request) {
  try {
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
    console.error("Error creating product:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to create product" 
    }, { status: 500 });
  }
} // End of POST function