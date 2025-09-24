import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';

// GET - Get all orders
export async function GET(request) {
  try {
    // Get the orders collection
    const orders = await getCollection('allOrders');
    
    // Find all orders
    const allOrders = await orders.find({}).toArray();

    return NextResponse.json(allOrders);

  } catch (error) {
    console.error("Error fetching orders:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch orders" 
    }, { status: 500 });
  }
} // End of GET function

// POST - Create new order
export async function POST(request) {
  try {
    // Get the orders collection
    const orders = await getCollection('allOrders');
    
    // Get the request body
    const body = await request.json();
    
    // Insert the new order
    const orderData = await orders.insertOne(body);

    return NextResponse.json({
      success: true,
      Data: orderData,
      message: "Order created successfully"
    });

  } catch (error) {
    console.error("Error creating order:", error); 
    return NextResponse.json({ 
      success: false,
      error: "Failed to create order" 
    }, { status: 500 });
  }
} // End of POST function


// PUT - Update admin order by _id
export async function PUT(request) {
  try {
    const adminOrders = await getCollection('adminOrders');
    const body = await request.json();
    const { _id, ...updateData } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Admin order _id is required for update' }, { status: 400 });
    }
    const { ObjectId } = (await import('mongodb'));
    const result = await adminOrders.updateOne({ _id: new ObjectId(_id) }, { $set: updateData });
    return NextResponse.json({ success: true, Data: result, message: 'Admin order updated successfully' });
  } catch (error) {
    console.error('Error updating admin order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update admin order' }, { status: 500 });
  }
} // End of PUT function

// DELETE - Delete admin order by _id
export async function DELETE(request) {
  try {
    const adminOrders = await getCollection('adminOrders');
    const body = await request.json();
    const { _id } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Admin order _id is required for delete' }, { status: 400 });
    }
    const { ObjectId } = (await import('mongodb'));
    const result = await adminOrders.deleteOne({ _id: new ObjectId(_id) });
    return NextResponse.json({ success: true, Data: result, message: 'Admin order deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin order:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete admin order' }, { status: 500 });
  }
} // End of DELETE function