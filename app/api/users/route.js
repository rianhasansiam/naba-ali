/**
 * app/api/users/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed:
 * - Removed all development bypass logic
 * - GET is strictly admin-only with pagination, strips passwords
 * - POST (signup) validates with Zod, normalises email, no raw body insert
 * - PUT (login) removed plain-text password comparison
 * - DELETE is admin-only and properly scoped to 'users' collection
 */

import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';
import { requireAdmin } from '../../../lib/apiGuards';
import { checkOrigin } from '../../../lib/security';
import { validateBody, signupSchema } from '../../../lib/validators';

// ─── POST — Signup (Create new user) ─────────────────────────────────────────
export async function POST(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { data, error: validationError } = await validateBody(request, signupSchema);
  if (validationError) return validationError;

  try {
    const users = await getCollection('users');
    const email = data.email.toLowerCase();

    // Duplicate check (using normalised email)
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already registered. Please log in.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newUser = {
      name: data.name,
      email,
      password: hashedPassword,
      image: data.image || null,
      role: 'user',
      provider: 'credentials',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      emailVerified: null,
    };

    const result = await users.insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: { id: result.insertedId },
    });
  } catch (err) {
    console.error('POST /api/users error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
}

// ─── GET — Fetch users list (Admin only) ──────────────────────────────────────
export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  // Strictly admin-only — no development bypass
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1',  10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));
    const skip  = (page - 1) * limit;

    const users = await getCollection('users');

    // Single-user lookup by email
    if (email) {
      const user = await users.findOne({ email: email.toLowerCase() });
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      const { password: _, ...safeUser } = user;
      return NextResponse.json({ success: true, user: safeUser });
    }

    // Paginated full list — strip passwords
    const [rawUsers, total] = await Promise.all([
      users
        .find({}, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      users.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: rawUsers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('GET /api/users error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

// ─── DELETE — Delete user by _id (Admin only) ────────────────────────────────
export async function DELETE(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { _id } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: '_id is required' }, { status: 400 });
    }

    const { ObjectId } = await import('mongodb');
    if (!ObjectId.isValid(_id)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID format' }, { status: 400 });
    }

    const users  = await getCollection('users');
    const result = await users.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/users error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
  }
}