/**
 * lib/cache/revalidate.js
 * ─────────────────────────────────────────────────────────────────────────────
 * On-demand revalidation helpers.
 *
 * Call these inside API Route Handlers (or Server Actions) AFTER every
 * successful MongoDB mutation.  They tell Next.js to purge the affected
 * cached pages and tags so the next request re-fetches fresh data.
 *
 * Pattern:
 *   1. Write to MongoDB  ✅
 *   2. Call the matching revalidate*() helper  ✅
 *   3. Emit Socket.io event  ✅
 *   4. Return success response  ✅
 */

import { revalidateTag, revalidatePath } from 'next/cache'
import { CACHE_TAGS } from './cache-tags'

// ─── Products ─────────────────────────────────────────────────────────────────
/**
 * Call after: product create / update / delete
 */
export function revalidateProductData() {
  revalidateTag(CACHE_TAGS.PRODUCTS)
  revalidateTag(CACHE_TAGS.HOME)
  revalidateTag(CACHE_TAGS.STATS)
  revalidatePath('/', 'page')
  revalidatePath('/products', 'page')
  revalidatePath('/admin/products', 'page')
}

// ─── Categories ───────────────────────────────────────────────────────────────
/**
 * Call after: category create / update / delete
 */
export function revalidateCategoryData() {
  revalidateTag(CACHE_TAGS.CATEGORIES)
  revalidateTag(CACHE_TAGS.HOME)
  revalidateTag(CACHE_TAGS.STATS)
  revalidatePath('/', 'page')
  revalidatePath('/products', 'page')
  revalidatePath('/admin/categories', 'page')
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
/**
 * Call after: review create / update / delete / approve
 */
export function revalidateReviewData() {
  revalidateTag(CACHE_TAGS.REVIEWS)
  revalidateTag(CACHE_TAGS.HOME)
  revalidateTag(CACHE_TAGS.STATS)
  revalidatePath('/', 'page')
  revalidatePath('/admin/reviews', 'page')
}

// ─── Orders ───────────────────────────────────────────────────────────────────
/**
 * Call after: order create / update / delete
 */
export function revalidateOrderData() {
  revalidateTag(CACHE_TAGS.ORDERS)
  revalidateTag(CACHE_TAGS.STATS)
  revalidatePath('/admin/orders', 'page')
}

// ─── Home / Stats ─────────────────────────────────────────────────────────────
/**
 * Nuclear option: revalidate everything on the homepage.
 * Use sparingly — prefer the more specific helpers above.
 */
export function revalidateHomeData() {
  revalidateTag(CACHE_TAGS.HOME)
  revalidateTag(CACHE_TAGS.STATS)
  revalidateTag(CACHE_TAGS.PRODUCTS)
  revalidateTag(CACHE_TAGS.CATEGORIES)
  revalidateTag(CACHE_TAGS.REVIEWS)
  revalidatePath('/', 'page')
}
