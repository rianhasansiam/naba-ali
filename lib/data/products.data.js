/**
 * lib/data/products.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side data function for products.
 *
 * Uses unstable_cache() with tags — data is NEVER time-refreshed.
 * It only refreshes when revalidateProductData() is called after a mutation.
 *
 * Safe to call from:
 *   - Server Components (app/page.js, generateMetadata, etc.)
 *   - API GET routes (to serve cached data)
 *   - Server Actions
 */

import { unstable_cache } from 'next/cache'
import { getCollection } from '@/lib/mongodb'
import { CACHE_TAGS } from '@/lib/cache/cache-tags'

// ── Internal DB fetcher (not exported — always go through getProducts) ─────────
async function fetchProductsFromDB() {
  try {
    const col = await getCollection('allProducts')
    const products = await col.find({}, {
      projection: {
        _id: 1,
        name: 1,
        category: 1,
        style: 1,
        price: 1,
        originalPrice: 1,
        salePrice: 1,
        stock: 1,
        isInStock: 1,
        primaryImage: 1,
        images: 1,
        image: 1,
        description: 1,
        shortDescription: 1,
        colors: 1,
        sizes: 1,
        color: 1,
        rating: 1,
        reviews: 1,
        createdAt: 1,
      }
    }).toArray()

    // Serialize MongoDB documents (ObjectId → string)
    return products.map(p => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      isInStock: Boolean(p.isInStock ?? (p.stock > 0)),
    }))
  } catch (err) {
    console.error('❌ fetchProductsFromDB error:', err.message)
    return []
  }
}

// ── Public cached function ─────────────────────────────────────────────────────
/**
 * Returns all products from cache (or DB on first hit / after revalidation).
 * revalidate: false → data NEVER expires by time; only via revalidateTag().
 */
export const getProducts = unstable_cache(
  fetchProductsFromDB,
  [CACHE_TAGS.PRODUCTS],       // unique cache key
  {
    tags: [CACHE_TAGS.PRODUCTS],
    revalidate: false,          // time-based expiry disabled; use revalidateTag()
  }
)
