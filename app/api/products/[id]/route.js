import { NextResponse } from 'next/server';
import { getCollection } from '../../../../lib/mongodb';

// PUT - Update product by ID
export async function PUT(request, { params }) {
  try {
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

// DELETE - Delete product by ID
export async function DELETE(request, { params }) {
  try {
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

// GET - Get single product by ID
export async function GET(request, { params }) {
  try {
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