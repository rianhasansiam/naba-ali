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
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().positive().max(100),
  size: z.string().trim().max(20).optional().nullable(),
  color: z.string().trim().max(50).optional().nullable(),
  // Legacy clients may still send these fields. They are ignored by the
  // order route because product name, image, and price are resolved server-side.
  name: z.unknown().optional(),
  price: z.unknown().optional(),
  image: z.unknown().optional(),
}).strict();

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email('Invalid email address').toLowerCase().optional().nullable(),
  address: z.string().trim().min(5).max(200),
  city: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(1).max(20),
  country: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(20),
}).strict();

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1).max(50),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['cash_on_delivery', 'stripe', 'paypal']).default('cash_on_delivery'),
  couponCode: z.string().max(50).optional().nullable(),
  // NOTE: totalPrice, status, isPaid, isDelivered are calculated server-side
}).strict();

// ─── Review ───────────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().trim().max(200).optional().nullable(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(150).optional().nullable(),
  comment: z.string().min(5).max(1000),
  photo: z.string().trim().max(2048).optional().nullable(),
  // NOTE: userName, userEmail, userId are derived from session server-side
});

// ─── Chat ─────────────────────────────────────────────────────────────────────

const chatAttachmentSchema = z.object({
  type: z.enum(['image', 'file']),
  filename: z.string().min(1).max(255),
  url: z.string().url(),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  mimetype: z.string().min(1).max(120),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
}).strict();

export const chatMessageSchema = z.object({
  conversationId: z.string().min(1).max(100),
  message: z.string().trim().min(1).max(2000, 'Message cannot exceed 2000 characters'),
  clientMessageId: z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/).optional(),
  requestId: z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/).optional(),
  attachments: z.array(chatAttachmentSchema).max(5).optional().default([]),
  guestToken: z.string().max(512).optional(),
  // userId and userName are accepted only for legacy guest clients (validated separately)
  userId: z.string().max(100).optional(),
  userName: z.string().max(80).optional(),
}).strict();

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
export async function validateBody(request, schema, options = {}) {
  const validationStatus = options.validationStatus || 422;
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
    const messages = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    return {
      error: new Response(
        JSON.stringify({ success: false, error: 'Validation failed', details: messages }),
        { status: validationStatus, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  return { data: result.data };
}
