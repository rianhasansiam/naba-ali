/**
 * app/api/contacts/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed: GET is admin-only with pagination. POST validates input with Zod.
 */

import { NextResponse } from 'next/server';
import { getCollection } from '../../../lib/mongodb';
import { requireAdmin } from '../../../lib/apiGuards';
import { validateBody, contactSchema } from '../../../lib/validators';

// GET — Admin only, returns all contacts with pagination
export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const page   = Math.max(1, parseInt(searchParams.get('page')   || '1',  10));
    const limit  = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));
    const skip   = (page - 1) * limit;
    const status = searchParams.get('status'); // optional filter: 'unread' | 'read'

    const contacts = await getCollection('allContacts');
    const filter   = status ? { status } : {};

    const [data, total] = await Promise.all([
      contacts.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      contacts.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('GET /api/contacts error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// POST — Public submission (rate limiting handled at middleware/edge level)
export async function POST(request) {
  const { data, error: validationError } = await validateBody(request, contactSchema);
  if (validationError) return validationError;

  try {
    const contacts = await getCollection('allContacts');

    const contactDocument = {
      name: data.name,
      email: data.email,
      subject: data.subject || '',
      message: data.message,
      phone: data.phone || null,
      status: 'unread',
      createdAt: new Date(),
    };

    const result = await contacts.insertOne(contactDocument);

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully',
      data: { id: result.insertedId },
    });
  } catch (err) {
    console.error('POST /api/contacts error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
