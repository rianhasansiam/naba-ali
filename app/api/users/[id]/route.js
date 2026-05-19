/**
 * app/api/users/[id]/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed:
 * - DELETE is admin-only
 * - PATCH is self-or-admin only
 * - GET is self-or-admin only
 * - Password stripped from all GET responses
 */

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../../../lib/mongodb';
import { requireAuth, requireAdmin } from '../../../../lib/apiGuards';

// ─── DELETE — Admin only ──────────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await Promise.resolve(params);

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID format' }, { status: 400 });
    }

    const users = await getCollection('users');
    const existingUser = await users.findOne({ _id: new ObjectId(id) });

    if (!existingUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const result = await users.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully', deletedId: id });
  } catch (err) {
    console.error('DELETE /api/users/[id] error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PATCH — Self or Admin ────────────────────────────────────────────────────
export async function PATCH(request, { params }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await Promise.resolve(params);

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID format' }, { status: 400 });
    }
    // Only the user themselves or an admin can update
    if (user.id !== id && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const updateData = await request.json();
    const users = await getCollection('users');

    const existingUser = await users.findOne({ _id: new ObjectId(id) });
    if (!existingUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Allowlist — only safe fields
    const allowedUpdates = { updatedAt: new Date() };
    if (updateData.name)  allowedUpdates.name  = String(updateData.name).slice(0, 80);
    if (updateData.image) allowedUpdates.image = updateData.image;
    if (updateData.phone !== undefined) {
      allowedUpdates.phone = updateData.phone === '' ? null : String(updateData.phone).slice(0, 20);
    }

    const result = await users.updateOne({ _id: new ObjectId(id) }, { $set: allowedUpdates });

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const updated = await users.findOne({ _id: new ObjectId(id) });
    const { password: _, ...safeUser } = updated;

    return NextResponse.json({ success: true, message: 'User updated successfully', user: safeUser });
  } catch (err) {
    console.error('PATCH /api/users/[id] error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── GET — Self or Admin ──────────────────────────────────────────────────────
export async function GET(request, { params }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await Promise.resolve(params);

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID format' }, { status: 400 });
    }
    // Only self or admin
    if (user.id !== id && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const users  = await getCollection('users');
    const found  = await users.findOne({ _id: new ObjectId(id) });

    if (!found) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...safeUser } = found;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err) {
    console.error('GET /api/users/[id] error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}