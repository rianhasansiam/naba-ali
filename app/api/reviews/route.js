/**
 * app/api/reviews/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * GET  — Public, paginated. Serves approved reviews from server-side cache.
 * POST — Authenticated users. Identity always from session.
 * PUT  — Admin only: update review status / approval.
 * DELETE — Admin only.
 *
 * After every mutation: revalidateReviewData() + emit reviews:changed.
 */

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '../../../lib/mongodb';
import { requireAuth, requireAdmin } from '../../../lib/apiGuards';
import { validateBody, reviewSchema } from '../../../lib/validators';
import { checkOrigin } from '../../../lib/security';
import { getApprovedReviews } from '../../../lib/data/reviews.data';
import { revalidateReviewData } from '../../../lib/cache/revalidate';
import { publishRealtimeEvent } from '../../../lib/socketIO';

async function emitReviewsChanged(action) {
  await publishRealtimeEvent('reviews:changed', { action });
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEmail(value) {
  return normalizeString(value).toLowerCase();
}

function addOwnershipConditions(conditions, fields, values) {
  for (const field of fields) {
    for (const value of values) {
      conditions.push({ [field]: value });
    }
  }
}

function buildReviewOwnershipConditions(user) {
  const conditions = [];
  const userId = normalizeString(user?.id);
  const userEmail = normalizeEmail(user?.email);

  if (userId) {
    const idValues = [userId];
    if (ObjectId.isValid(userId)) {
      idValues.push(new ObjectId(userId));
    }

    addOwnershipConditions(conditions, ['userId', 'customerId', 'customer.id'], idValues);
  }

  if (userEmail) {
    const emailValues = [...new Set([normalizeString(user?.email), userEmail].filter(Boolean))];
    addOwnershipConditions(
      conditions,
      ['userEmail', 'customerEmail', 'email', 'customer.email'],
      emailValues
    );
  }

  return conditions;
}

function normalizeReviewForOwner(review) {
  return {
    ...review,
    status: review.status || (review.isApproved ? 'approved' : 'pending'),
    customerName: review.customerName || review.userName,
    customerEmail: review.customerEmail || review.userEmail,
  };
}

// ── GET — Public, paginated ────────────────────────────────────────────────────
export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const mine = searchParams.get('mine') === '1' || searchParams.get('mine') === 'true';

    if (mine) {
      const { user, error } = await requireAuth();
      if (error) return error;

      const ownershipConditions = buildReviewOwnershipConditions(user);
      const filter = ownershipConditions.length > 0 ? { $or: ownershipConditions } : { _id: null };
      const col = await getCollection('allReviews');
      const data = await col.find(filter).sort({ createdAt: -1 }).toArray();

      return NextResponse.json({ success: true, data: data.map(normalizeReviewForOwner) });
    }

    // If filtering by productId, query DB directly (not worth caching per-product)
    if (productId) {
      const page  = Math.max(1, parseInt(searchParams.get('page')  || '1',  10));
      const limit = Math.min(50, parseInt(searchParams.get('limit') || '10', 10));
      const skip  = (page - 1) * limit;
      const col   = await getCollection('allReviews');
      const filter = { productId };
      const [data, total] = await Promise.all([
        col.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        col.countDocuments(filter),
      ]);
      return NextResponse.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    }

    // General public view — serve from cache
    const reviews = await getApprovedReviews();
    return NextResponse.json({ success: true, data: reviews });
  } catch (err) {
    console.error('GET /api/reviews error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// ── POST — Authenticated users only ───────────────────────────────────────────
export async function POST(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { user, error } = await requireAuth();
  if (error) return error;

  const { data, error: validationError } = await validateBody(request, reviewSchema);
  if (validationError) return validationError;

  try {
    const col = await getCollection('allReviews');

    // Prevent duplicate reviews for same product by same user, including older email-based records.
    const ownershipConditions = buildReviewOwnershipConditions(user);
    const existing = await col.findOne({
      productId: data.productId,
      ...(ownershipConditions.length > 0 ? { $or: ownershipConditions } : { userId: user.id }),
    });
    if (existing) {
      return NextResponse.json({ success: false, error: 'You have already reviewed this product' }, { status: 409 });
    }

    const doc = {
      productId:  data.productId,
      productName: data.productName || null,
      rating:     data.rating,
      title:      data.title || null,
      comment:    data.comment,
      photo:      data.photo || null,
      // Identity always from session — NEVER from request body
      userId:     user.id,
      userName:   user.name || user.email,
      userEmail:  user.email,
      customerName: user.name || user.email,
      customerEmail: user.email,
      isApproved: false,   // pending admin approval
      status:     'pending',
      verified:   true,
      helpful:    0,
      date:       new Date().toISOString().slice(0, 10),
      createdAt:  new Date(),
      updatedAt:  new Date(),
    };

    const result = await col.insertOne(doc);

    revalidateReviewData();
    await emitReviewsChanged('create');

    return NextResponse.json({ success: true, message: 'Review submitted successfully', data: { ...doc, _id: result.insertedId } });
  } catch (err) {
    console.error('POST /api/reviews error:', err);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}

// ── PUT — Admin only: update / approve review ─────────────────────────────────
export async function PUT(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'Review _id is required' }, { status: 400 });
    }

    // Strip any fields that must not be overwritten by admin manually
    const { userId: _u, userEmail: _e, userName: _n, ...safeUpdate } = updateData;

    const col = await getCollection('allReviews');
    const result = await col.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...safeUpdate, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    revalidateReviewData();
    await emitReviewsChanged('update');

    return NextResponse.json({ success: true, message: 'Review updated successfully' });
  } catch (err) {
    console.error('PUT /api/reviews error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Review _id is required' }, { status: 400 });
    }

    const col = await getCollection('allReviews');
    const result = await col.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    revalidateReviewData();
    await emitReviewsChanged('delete');

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/reviews error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete review' }, { status: 500 });
  }
}
