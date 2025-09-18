import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';

// GET - Get all products
export async function GET(request) {
  try {
    // Get the products collection
    const products = await getCollection('allProducts');
    
    // Find all products
    const allProducts = await products.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      Data: allProducts
    });

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
    const productData = await products.insertOne(body);

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

// PUT - Update admin product by _id
export async function PUT(request) {
  try {
    const adminProducts = await getCollection('adminProducts');
    const body = await request.json();
    const { _id, ...updateData } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Admin product _id is required for update' }, { status: 400 });
    }
    const { ObjectId } = (await import('mongodb'));
    const result = await adminProducts.updateOne({ _id: new ObjectId(_id) }, { $set: updateData });
    return NextResponse.json({ success: true, Data: result, message: 'Admin product updated successfully' });
  } catch (error) {
    console.error('Error updating admin product:', error);
    return NextResponse.json({ success: false, error: 'Failed to update admin product' }, { status: 500 });
  }
} // End of PUT function

// DELETE - Delete admin product by _id
export async function DELETE(request) {
  try {
    const adminProducts = await getCollection('adminProducts');
    const body = await request.json();
    const { _id } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Admin product _id is required for delete' }, { status: 400 });
    }
    const { ObjectId } = (await import('mongodb'));
    const result = await adminProducts.deleteOne({ _id: new ObjectId(_id) });
    return NextResponse.json({ success: true, Data: result, message: 'Admin product deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete admin product' }, { status: 500 });
  }
} // End of DELETE function