/**
 * lib/validators.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Zod validation schemas for all API route inputs.
 * Never insert raw request.json() directly into MongoDB.
 */

import { z } from 'zod';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  image: z.string().url().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required').max(128),
});

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200).optional(),
  message: z.string().min(5).max(2000),
  phone: z.string().max(20).optional().nullable(),
});

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  quantity: z.number().int().positive().max(100),
  image: z.string().url().optional().nullable(),
  size: z.string().max(20).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
});

// ─── Order ────────────────────────────────────────────────────────────────────

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive().max(100),
  size: z.string().max(20).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  image: z.string().url().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(100),
  phone: z.string().min(6).max(20),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1).max(50),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['cash_on_delivery', 'stripe', 'paypal']).default('cash_on_delivery'),
  couponCode: z.string().max(50).optional().nullable(),
  // NOTE: totalPrice, status, isPaid, isDelivered are calculated server-side
});

// ─── Review ───────────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
  // NOTE: userName, userEmail, userId are derived from session server-side
});

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const chatMessageSchema = z.object({
  conversationId: z.string().min(1).max(100),
  message: z.string().min(1).max(2000, 'Message cannot exceed 2000 characters'),
  // userId and userName are accepted only for guest sessions (validated separately)
  userId: z.string().max(100).optional(),
  userName: z.string().max(80).optional(),
});

export const conversationSchema = z.object({
  userId: z.string().min(1).max(100),
  userName: z.string().min(1).max(80),
  userEmail: z.string().email().optional().nullable(),
  isGuest: z.boolean().optional().default(false),
});

// ─── Admin Order Status Update ────────────────────────────────────────────────

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().max(100).optional().nullable(),
  note: z.string().max(500).optional().nullable(),
});

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Parse and validate a request body against a Zod schema.
 * Returns { data } on success or { error: Response } on failure.
 */
export async function validateBody(request, schema) {
  let raw;
  try {
    raw = await request.json();
  } catch {
    return {
      error: new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    return {
      error: new Response(
        JSON.stringify({ success: false, error: 'Validation failed', details: messages }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  return { data: result.data };
}
