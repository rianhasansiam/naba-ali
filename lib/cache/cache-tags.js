/**
 * lib/cache/cache-tags.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all Next.js cache tags.
 * Use these constants everywhere — in unstable_cache() and revalidateTag().
 * Never hard-code raw strings.
 */

export const CACHE_TAGS = {
  // ── Public / server-rendered data ──────────────────────────────────────────
  PRODUCTS:   'products',
  CATEGORIES: 'categories',
  REVIEWS:    'reviews',
  STATS:      'stats',
  HOME:       'home',

  // ── Private / user-scoped data ──────────────────────────────────────────────
  CART:   'cart',
  ORDERS: 'orders',
  USERS:  'users',
}

// Convenience groups for revalidating related tags together
export const CACHE_TAG_GROUPS = {
  // Everything visible on the homepage
  HOME_GROUP:    [CACHE_TAGS.HOME, CACHE_TAGS.STATS, CACHE_TAGS.PRODUCTS, CACHE_TAGS.CATEGORIES, CACHE_TAGS.REVIEWS],

  // Anything that contains product data
  PRODUCT_GROUP: [CACHE_TAGS.PRODUCTS, CACHE_TAGS.HOME, CACHE_TAGS.STATS],

  // Anything that contains category data
  CATEGORY_GROUP:[CACHE_TAGS.CATEGORIES, CACHE_TAGS.HOME, CACHE_TAGS.STATS],

  // Anything that contains review data
  REVIEW_GROUP:  [CACHE_TAGS.REVIEWS, CACHE_TAGS.HOME, CACHE_TAGS.STATS],

  // Anything that contains order data
  ORDER_GROUP:   [CACHE_TAGS.ORDERS, CACHE_TAGS.STATS],
}
