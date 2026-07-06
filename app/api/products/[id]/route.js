import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';
import { checkOrigin, isAdmin, forbiddenResponse } from '../../../../lib/security';
import { revalidateProductData } from '../../../../lib/cache/revalidate';
import { publishRealtimeEvent } from '../../../../lib/socketIO';

// PUT - Update product by ID (Admin only)
export async function PUT(request, { params }) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return forbiddenResponse('Only admins can update products');
    }

    const { id } = params;
    const products = await getCollection('allProducts');
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required for update' 
      }, { status: 400 });
    }

    const { ObjectId } = (await import('mongodb'));
    const result = await products.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    revalidateProductData();
    await publishRealtimeEvent('products:changed', { action: 'update', id });

    return NextResponse.json({ 
      success: true, 
      Data: result, 
      message: 'Product updated successfully' 
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update product' 
    }, { status: 500 });
  }
}

// DELETE - Delete product by ID (Admin only)
export async function DELETE(request, { params }) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    // Check if user is admin
    const admin = await isAdmin();
    if (!admin) {
      return forbiddenResponse('Only admins can delete products');
    }

    const { id } = params;
    const products = await getCollection('allProducts');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required for delete' 
      }, { status: 400 });
    }

    const { ObjectId } = (await import('mongodb'));
    const result = await products.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    revalidateProductData();
    await publishRealtimeEvent('products:changed', { action: 'delete', id });

    return NextResponse.json({ 
      success: true, 
      Data: result, 
      message: 'Product deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete product' 
    }, { status: 500 });
  }
}

// GET - Get single product by ID (Public - Anyone can view)
export async function GET(request, { params }) {
  try {
    // Check origin for security
    const originCheck = checkOrigin(request);
    if (originCheck) return originCheck;

    const { id } = params;
    const products = await getCollection('allProducts');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    const { ObjectId } = (await import('mongodb'));
    const product = await products.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch product' 
    }, { status: 500 });
  }
}
