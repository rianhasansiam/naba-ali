import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';

// GET - Get all reviews
export async function GET(request) {
  try {
    // Get the reviews collection
    const reviews = await getCollection('allReviews');
    
    // Find all reviews
    const allReviews = await reviews.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      Data: allReviews
    });

  } catch (error) {
    console.error("Error fetching reviews:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch reviews" 
    }, { status: 500 });
  }
} // End of GET function

// POST - Create new review
export async function POST(request) {
  try {
    // Get the reviews collection
    const reviews = await getCollection('allReviews');
    
    // Get the request body
    const body = await request.json();
    
    // Insert the new review
    const reviewData = await reviews.insertOne(body);

    return NextResponse.json({
      success: true,
      Data: reviewData,
      message: "Review created successfully"
    });

  } catch (error) {
    console.error("Error creating review:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to create review" 
    }, { status: 500 });
  }
} // End of POST function

// PUT - Update admin review by _id
export async function PUT(request) {
  try {
    const adminReviews = await getCollection('adminReviews');
    const body = await request.json();
    const { _id, ...updateData } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Admin review _id is required for update' }, { status: 400 });
    }
    const { ObjectId } = (await import('mongodb'));
    const result = await adminReviews.updateOne({ _id: new ObjectId(_id) }, { $set: updateData });
    return NextResponse.json({ success: true, Data: result, message: 'Admin review updated successfully' });
  } catch (error) {
    console.error('Error updating admin review:', error);
    return NextResponse.json({ success: false, error: 'Failed to update admin review' }, { status: 500 });
  }
} // End of PUT function

// DELETE - Delete admin review by _id
export async function DELETE(request) {
  try {
    const adminReviews = await getCollection('adminReviews');
    const body = await request.json();
    const { _id } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Admin review _id is required for delete' }, { status: 400 });
    }
    const { ObjectId } = (await import('mongodb'));
    const result = await adminReviews.deleteOne({ _id: new ObjectId(_id) });
    return NextResponse.json({ success: true, Data: result, message: 'Admin review deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin review:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete admin review' }, { status: 500 });
  }
} // End of DELETE function