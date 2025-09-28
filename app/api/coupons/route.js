import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';

// GET - Get all coupons
export async function GET(request) {
  try {
    // Get the coupons collection
    const coupons = await getCollection('allCoupons');
    
    // Find all coupons
    const allCoupons = await coupons.find({}).toArray();

    return NextResponse.json(allCoupons);

  } catch (error) {
    console.error("Error fetching coupons:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch coupons" 
    }, { status: 500 });
  }
} // End of GET function

// POST - Create new coupon
export async function POST(request) {
  try {
    // Get the coupons collection
    const coupons = await getCollection('allCoupons');
    
    // Get the request body
    const body = await request.json();
    
    // Add creation timestamp
    const couponData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the new coupon
    const result = await coupons.insertOne(couponData);

    return NextResponse.json({
      success: true,
      Data: result,
      message: "Coupon created successfully"
    });

  } catch (error) {
    console.error("Error creating coupon:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to create coupon" 
    }, { status: 500 });
  }
} // End of POST function