/**
 * app/api/products/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * GET  — Serves from the server-side cache (unstable_cache).
 *         Shared with Server Components → zero duplicate DB queries.
 * POST — Validates → writes to MongoDB → revalidates cache → emits socket event.
 */

import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';
import { requireAdmin } from '../../../lib/apiGuards';
import { checkOrigin } from '../../../lib/security';
import { getProducts } from '../../../lib/data/products.data';
import { revalidateProductData } from '../../../lib/cache/revalidate';

// ── GET — Public ───────────────────────────────────────────────────────────────
export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  try {
    // Reuse the same cached function used by Server Components.
    // If cache is warm, no DB call is made at all.
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
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

    // Basic validation — extend with Zod if needed
    if (!body.name || !body.price) {
      return NextResponse.json({ success: false, error: 'name and price are required' }, { status: 400 });
    }

    // Never trust isAdmin, role, or calculated fields from the client
    const { isAdmin: _a, role: _r, ...safeBody } = body;

    const col = await getCollection('allProducts');
    const result = await col.insertOne({ ...safeBody, createdAt: new Date(), updatedAt: new Date() });

    // ── Cache invalidation ────────────────────────────────────────────────────
    revalidateProductData();

    // ── Socket.io event ───────────────────────────────────────────────────────
    try {
      const { getIO } = await import('../../../lib/socketIO');
      getIO()?.emit('products:changed', { action: 'create', id: result.insertedId });
    } catch { /* socket optional */ }

    return NextResponse.json({ success: true, data: { _id: result.insertedId }, message: 'Product created successfully' });
  } catch (err) {
    console.error('POST /api/products error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}