/**
 * app/api/debug/session/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixed: Admin-only in all environments, completely blocked in production.
 */

import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/apiGuards';

export async function GET() {
  // Block entirely in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  // Admin-only in development/staging
  const { user, error } = await requireAdmin();
  if (error) return error;

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    env: process.env.NODE_ENV,
  });
}
