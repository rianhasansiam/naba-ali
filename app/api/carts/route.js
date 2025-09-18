import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';

// GET - Get all carts
export async function GET(request) {
  try {
    // Get the carts collection
    const carts = await getCollection('allCarts');
    
    // Find all carts
    const allCarts = await carts.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      Data: allCarts
    });

  } catch (error) {
    console.error("Error fetching carts:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch carts" 
    }, { status: 500 });
  }
} // End of GET function

// POST - Create new cart
export async function POST(request) {
  try {
    // Get the carts collection
    const carts = await getCollection('allCarts');
    
    // Get the request body
    const body = await request.json();
    
    // Insert the new cart
    const cartData = await carts.insertOne(body);

    return NextResponse.json({
      success: true,
      Data: cartData,
      message: "Cart created successfully"
    });

  } catch (error) {
    console.error("Error creating cart:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to create cart" 
    }, { status: 500 });
  }
} // End of POST function


