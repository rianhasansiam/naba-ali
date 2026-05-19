/**
 * app/api/stats/route.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Public stats endpoint.
 * Returns aggregated counts from the server-side cached function.
 * Replaces the unsafe /api/users count pattern used on the homepage.
 */

import { NextResponse } from 'next/server';
import { getHomeStats } from '@/lib/data/stats.data';
import { checkOrigin } from '@/lib/security';

export async function GET(request) {
  const originCheck = checkOrigin(request);
  if (originCheck) return originCheck;

  try {
    const stats = await getHomeStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error('GET /api/stats error:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
