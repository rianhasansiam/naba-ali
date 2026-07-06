import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../../../lib/mongodb';
import { requireAdmin, checkOrigin } from '../../../../lib/apiGuards';

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

// PUT - Update coupon by ID (Admin only)
export async function PUT(request, { params }) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = params;
    const idError = validateObjectId(id, 'Coupon');
    if (idError) return idError;

    const coupons = await getCollection('allCoupons');
    const body = await request.json();
    const result = await coupons.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Coupon not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      Data: result,
      message: 'Coupon updated successfully'
    });

  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update coupon'
    }, { status: 500 });
  }
}

// DELETE - Delete coupon by ID (Admin only)
export async function DELETE(request, { params }) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = params;
    const idError = validateObjectId(id, 'Coupon');
    if (idError) return idError;

    const coupons = await getCollection('allCoupons');
    const result = await coupons.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Coupon not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      Data: result,
      message: 'Coupon deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete coupon'
    }, { status: 500 });
  }
}
