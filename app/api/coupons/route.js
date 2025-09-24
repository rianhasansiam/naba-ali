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

// PUT - Update coupon by _id
export async function PUT(request) {
  try {
    // Get the coupons collection
    const coupons = await getCollection('allCoupons');
    
    // Get the request body
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    // Add update timestamp
    const updatedCouponData = {
      ...updateData,
      updatedAt: new Date()
    };

    // Update the coupon
    const result = await coupons.updateOne(
      { _id: new require('mongodb').ObjectId(_id) },
      { $set: updatedCouponData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false,
        error: "Coupon not found" 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      Data: result,
      message: "Coupon updated successfully"
    });

  } catch (error) {
    console.error("Error updating coupon:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to update coupon" 
    }, { status: 500 });
  }
} // End of PUT function

// DELETE - Delete coupon by _id
export async function DELETE(request) {
  try {
    // Get the coupons collection
    const coupons = await getCollection('allCoupons');
    
    // Get the coupon ID from the URL
    const url = new URL(request.url);
    const couponId = url.searchParams.get('id');

    if (!couponId) {
      return NextResponse.json({ 
        success: false,
        error: "Coupon ID is required" 
      }, { status: 400 });
    }

    // Delete the coupon
    const result = await coupons.deleteOne({ 
      _id: new require('mongodb').ObjectId(couponId) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false,
        error: "Coupon not found" 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      Data: result,
      message: "Coupon deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting coupon:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to delete coupon" 
    }, { status: 500 });
  }
} // End of DELETE function