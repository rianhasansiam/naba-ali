/**
 * lib/apiGuards.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable server-side guards for Next.js API Route Handlers.
 *
 * Usage:
 *   const { user, error } = await requireAuth();
 *   if (error) return error;
 *
 *   const { user, error } = await requireAdmin();
 *   if (error) return error;
 */

import { auth } from './auth';

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────
function jsonError(message, status) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// requireAuth
// Returns { user } on success, { error: Response } on failure.
// ─────────────────────────────────────────────────────────────────────────────
export async function requireAuth() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return { error: jsonError('Authentication required', 401) };
    }
    return { user };
  } catch {
    return { error: jsonError('Authentication check failed', 500) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// requireAdmin
// Returns { user } on success, { error: Response } on failure.
// ─────────────────────────────────────────────────────────────────────────────
export async function requireAdmin() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return { error: jsonError('Authentication required', 401) };
    }
    if (user.role !== 'admin') {
      return { error: jsonError('Admin access required', 403) };
    }
    return { user };
  } catch {
    return { error: jsonError('Authorization check failed', 500) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// checkOrigin — kept here for single import convenience
// ─────────────────────────────────────────────────────────────────────────────
export { checkOrigin, unauthorizedResponse, forbiddenResponse } from './security';
