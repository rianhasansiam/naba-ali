import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../../../lib/mongodb';
import { requireAdmin, checkOrigin } from '../../../../lib/apiGuards';
import { revalidateCategoryData } from '../../../../lib/cache/revalidate';
import { publishRealtimeEvent } from '../../../../lib/socketIO';

function validateObjectId(id, resourceName) {
  if (!id) {
    return NextResponse.json({
      success: false,
      error: `${resourceName} ID is required`
    }, { status: 400 });
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({
      success: false,
      error: `Invalid ${resourceName.toLowerCase()} ID`
    }, { status: 400 });
  }

  return null;
}

// PUT - Update category by ID (Admin only)
export async function PUT(request, { params }) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = params;
    const idError = validateObjectId(id, 'Category');
    if (idError) return idError;

    const categories = await getCollection('allCategories');
    const body = await request.json();
    const result = await categories.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }

    revalidateCategoryData();
    await publishRealtimeEvent('categories:changed', { action: 'update', id });

    return NextResponse.json({ 
      success: true, 
      Data: result, 
      message: 'Category updated successfully' 
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update category' 
    }, { status: 500 });
  }
}

// DELETE - Delete category by ID (Admin only)
export async function DELETE(request, { params }) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = params;
    const idError = validateObjectId(id, 'Category');
    if (idError) return idError;

    const categories = await getCollection('allCategories');
    const result = await categories.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }

    revalidateCategoryData();
    await publishRealtimeEvent('categories:changed', { action: 'delete', id });

    return NextResponse.json({ 
      success: true, 
      Data: result, 
      message: 'Category deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete category' 
    }, { status: 500 });
  }
}

// GET - Get single category by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const idError = validateObjectId(id, 'Category');
    if (idError) return idError;

    const categories = await getCollection('allCategories');
    const category = await categories.findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }

    return NextResponse.json(category);

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch category' 
    }, { status: 500 });
  }
}
