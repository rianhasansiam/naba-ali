/**
 * app/api/carts/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Cart API — requires login. Each user can only access their own cart.
 * Fixed: Added authentication, user-scoped queries, Zod validation, pagination.
 */

import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';
import { requireAuth } from '../../../lib/apiGuards';
import { validateBody, cartSchema } from '../../../lib/validators';

// GET — Return current user's cart items only
export async function GET(request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1', 10));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '50', 10));
    const skip  = (page - 1) * limit;

    const carts = await getCollection('allCarts');
    const [items, total] = await Promise.all([
      carts.find({ userId: user.id }).skip(skip).limit(limit).toArray(),
      carts.countDocuments({ userId: user.id }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('GET /api/carts error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST — Add a cart entry for the current user
export async function POST(request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { data, error: validationError } = await validateBody(request, cartSchema);
  if (validationError) return validationError;

  try {
    const carts = await getCollection('allCarts');

    const cartDocument = {
      userId: user.id,           // always from session — never from body
      userEmail: user.email,
      items: data.items,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    // Upsert: replace existing cart for this user or create new
    const result = await carts.updateOne(
      { userId: user.id },
      { $set: cartDocument },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Cart saved successfully',
      data: result,
    });
  } catch (err) {
    console.error('POST /api/carts error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save cart' }, { status: 500 });
  }
}

// DELETE — Clear the current user's cart
export async function DELETE() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const carts = await getCollection('allCarts');
    await carts.deleteOne({ userId: user.id });

    return NextResponse.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    console.error('DELETE /api/carts error:', err);
    return NextResponse.json({ success: false, error: 'Failed to clear cart' }, { status: 500 });
  }
}
