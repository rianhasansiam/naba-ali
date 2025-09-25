import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT - Update order status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const orders = await getCollection('allOrders');
    
    const body = await request.json();
    const { status, ...otherUpdates } = body;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID is required' 
      }, { status: 400 });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData = {
      ...otherUpdates,
      ...(status && { status }),
      updatedAt: new Date().toISOString()
    };

    // Update the order
    const result = await orders.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 });
    }

    // Get the updated order
    const updatedOrder = await orders.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update order' 
    }, { status: 500 });
  }
}

// GET - Get specific order details
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const orders = await getCollection('allOrders');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID is required' 
      }, { status: 400 });
    }

    // Find the specific order
    const order = await orders.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch order' 
    }, { status: 500 });
  }
}

// DELETE - Delete specific order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const orders = await getCollection('allOrders');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID is required' 
      }, { status: 400 });
    }

    // Find the order first to check if it exists
    const existingOrder = await orders.findOne({ _id: new ObjectId(id) });
    
    if (!existingOrder) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 });
    }

    // Delete the order
    const result = await orders.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete order' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { deletedId: id },
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete order' 
    }, { status: 500 });
  }
}