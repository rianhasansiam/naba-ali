/**
 * lib/data/reviews.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side data function for approved public reviews.
 *
 * revalidate: false — refreshes only via revalidateReviewData().
 */

import { unstable_cache } from 'next/cache'
import { getCollection } from '@/lib/mongodb'
import { CACHE_TAGS } from '@/lib/cache/cache-tags'

async function fetchApprovedReviewsFromDB() {
  try {
    const col = await getCollection('allReviews')

    // Only return approved reviews for public display
    const reviews = await col
      .find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(50)   // cap for homepage; admin routes query directly
      .toArray()

    return reviews.map(r => ({
      ...r,
      _id:        r._id.toString(),
      id:         r._id.toString(),
      isApproved: true,
      rating:     Number(r.rating) || 0,
    }))
  } catch (err) {
    console.error('❌ fetchApprovedReviewsFromDB error:', err.message)
    return []
  }
}

/**
 * Returns only approved reviews — safe for public server rendering.
 * For admin view (all reviews with pagination), query the DB directly in the
 * admin API route; do NOT cache admin-specific review lists here.
 */
export const getApprovedReviews = unstable_cache(
  fetchApprovedReviewsFromDB,
  [CACHE_TAGS.REVIEWS],
  {
    tags: [CACHE_TAGS.REVIEWS],
    revalidate: false,
  }
)
