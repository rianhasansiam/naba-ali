/**
 * app/api/categories/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * GET  — Serves from the server-side cache (unstable_cache).
 * POST / PUT / DELETE — Writes to MongoDB → revalidates cache → emits socket.
 */

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../../lib/mongodb';
import { requireAdmin } from '../../../lib/apiGuards';
import { checkOrigin } from '../../../lib/security';
import { getCategories } from '../../../lib/data/categories.data';
import { revalidateCategoryData } from '../../../lib/cache/revalidate';
import { publishRealtimeEvent } from '../../../lib/socketIO';

// Helper: emit socket event safely
async function emitCategoryChanged(action, id) {
  await publishRealtimeEvent('categories:changed', { action, id });
}

// ── GET — Public ───────────────────────────────────────────────────────────────
export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error('GET /api/categories error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// ── POST — Admin only ──────────────────────────────────────────────────────────
export async function POST(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const { isAdmin: _a, role: _r, ...safeBody } = body;
    const col = await getCollection('allCategories');
    const result = await col.insertOne({ ...safeBody, createdAt: new Date() });

    revalidateCategoryData();
    await emitCategoryChanged('create', result.insertedId);

    return NextResponse.json({ success: true, data: { _id: result.insertedId }, message: 'Category created successfully' });
  } catch (err) {
    console.error('POST /api/categories error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
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
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'Category _id is required' }, { status: 400 });
    }

    const { isAdmin: _a, role: _r, ...safeUpdate } = updateData;
    const col = await getCollection('allCategories');
    const result = await col.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...safeUpdate, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    revalidateCategoryData();
    await emitCategoryChanged('update', _id);

    return NextResponse.json({ success: true, message: 'Category updated successfully' });
  } catch (err) {
    console.error('PUT /api/categories error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Category _id is required' }, { status: 400 });
    }

    const col = await getCollection('allCategories');
    const result = await col.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    revalidateCategoryData();
    await emitCategoryChanged('delete', _id);

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/categories error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
