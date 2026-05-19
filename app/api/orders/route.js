/**
 * app/api/orders/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * GET  — Admin only, paginated.
 * POST — Authenticated users; total calculated server-side.
 * PUT  — Admin only.
 * DELETE — Admin only.
 *
 * After every mutation: revalidateOrderData() + emit orders:changed.
 */

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../../lib/mongodb';
import { requireAuth, requireAdmin } from '../../../lib/apiGuards';
import { validateBody, orderSchema } from '../../../lib/validators';
import { checkOrigin } from '../../../lib/security';
import { revalidateOrderData } from '../../../lib/cache/revalidate';

async function emitOrdersChanged(action, id) {
  try {
    const { getIO } = await import('../../../lib/socketIO');
    getIO()?.emit('orders:changed', { action, id });
  } catch { /* socket optional */ }
}

// ── GET — Admin only, paginated ────────────────────────────────────────────────
export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const page   = Math.max(1, parseInt(searchParams.get('page')   || '1',  10));
    const limit  = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));
    const status = searchParams.get('status');
    const skip   = (page - 1) * limit;

    const col    = await getCollection('allOrders');
    const filter = status ? { status } : {};

    const [data, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// ── POST — Authenticated users, server-calculated total ───────────────────────
export async function POST(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { user, error } = await requireAuth();
  if (error) return error;

  const { data, error: validationError } = await validateBody(request, orderSchema);
  if (validationError) return validationError;

  try {
    const productsCol = await getCollection('allProducts');

    // Server-side price calculation — never trust client total
    let calculatedTotal = 0;
    const resolvedItems = [];

    for (const item of data.items) {
      if (!ObjectId.isValid(item.productId)) {
        return NextResponse.json({ success: false, error: `Invalid product ID: ${item.productId}` }, { status: 400 });
      }

      const product = await productsCol.findOne({ _id: new ObjectId(item.productId) });
      if (!product) {
        return NextResponse.json({ success: false, error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      const unitPrice = product.salePrice || product.price;
      calculatedTotal += unitPrice * item.quantity;

      resolvedItems.push({
        productId: item.productId,
        name:      product.name,
        price:     unitPrice,
        quantity:  item.quantity,
        size:      item.size  || null,
        color:     item.color || null,
        image:     product.primaryImage || product.image || null,
      });
    }

    const doc = {
      // Identity always from session
      userId:          user.id,
      userEmail:       user.email,
      userName:        user.name,
      // Verified server-resolved data
      items:           resolvedItems,
      shippingAddress: data.shippingAddress,
      paymentMethod:   data.paymentMethod,
      couponCode:      data.couponCode || null,
      // Server-set financials — NEVER from client
      totalPrice:      parseFloat(calculatedTotal.toFixed(2)),
      // Server-set flags — NEVER from client
      status:          'pending',
      isPaid:          false,
      isDelivered:     false,
      paidAt:          null,
      deliveredAt:     null,
      createdAt:       new Date(),
      updatedAt:       new Date(),
    };

    const ordersCol = await getCollection('allOrders');
    const result    = await ordersCol.insertOne(doc);

    revalidateOrderData();
    await emitOrdersChanged('create', result.insertedId);

    return NextResponse.json({ success: true, message: 'Order placed successfully', data: { ...doc, _id: result.insertedId } });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

// ── PUT — Admin only ───────────────────────────────────────────────────────────
export async function PUT(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { _id, status, trackingNumber, note } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'Order _id is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status value' }, { status: 400 });
    }

    // Only allow explicit safe fields — never expose a general $set
    const updateFields = { updatedAt: new Date() };
    if (status)         updateFields.status         = status;
    if (trackingNumber) updateFields.trackingNumber  = trackingNumber;
    if (note)           updateFields.adminNote       = note;
    if (status === 'delivered') {
      updateFields.isDelivered  = true;
      updateFields.deliveredAt  = new Date();
    }

    const col    = await getCollection('allOrders');
    const result = await col.updateOne({ _id: new ObjectId(_id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    revalidateOrderData();
    await emitOrdersChanged('update', _id);

    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (err) {
    console.error('PUT /api/orders error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}

// ── DELETE — Admin only ────────────────────────────────────────────────────────
export async function DELETE(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'Order _id is required' }, { status: 400 });
    }

    const col    = await getCollection('allOrders');
    const result = await col.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    revalidateOrderData();
    await emitOrdersChanged('delete', _id);

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/orders error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete order' }, { status: 500 });
  }
}