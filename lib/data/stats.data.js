/**
 * lib/data/stats.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side function for homepage summary statistics.
 *
 * Computes stats directly from DB (lightweight aggregation).
 * revalidate: false — refreshes only via revalidateTag('stats').
 *
 * Using this instead of exposing /api/users count to the public.
 */

import { unstable_cache } from 'next/cache'
import { getCollection } from '@/lib/mongodb'
import { CACHE_TAGS } from '@/lib/cache/cache-tags'

async function fetchStatsFromDB() {
  try {
    const [productsCol, categoriesCol, reviewsCol, ordersCol] = await Promise.all([
      getCollection('allProducts'),
      getCollection('allCategories'),
      getCollection('allReviews'),
      getCollection('allOrders'),
    ])

    const [
      totalProducts,
      inStockProducts,
      totalCategories,
      activeCategories,
      totalReviews,
      approvedReviews,
      totalOrders,
      ratingAgg,
    ] = await Promise.all([
      productsCol.countDocuments({}),
      productsCol.countDocuments({ isInStock: true }),
      categoriesCol.countDocuments({}),
      categoriesCol.countDocuments({ isActive: true }),
      reviewsCol.countDocuments({}),
      reviewsCol.countDocuments({ isApproved: true }),
      ordersCol.countDocuments({}),
      reviewsCol.aggregate([
        { $match: { isApproved: true } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]).toArray(),
    ])

    const averageRating = ratingAgg[0]?.avg ?? 0

    return {
      totalProducts,
      inStockProducts,
      totalCategories,
      activeCategories,
      totalReviews,
      approvedReviews,
      totalOrders,
      averageRating: parseFloat(averageRating.toFixed(1)),
    }
  } catch (err) {
    console.error('❌ fetchStatsFromDB error:', err.message)
    return {
      totalProducts: 0,
      inStockProducts: 0,
      totalCategories: 0,
      activeCategories: 0,
      totalReviews: 0,
      approvedReviews: 0,
      totalOrders: 0,
      averageRating: 0,
    }
  }
}

export const getHomeStats = unstable_cache(
  fetchStatsFromDB,
  [CACHE_TAGS.STATS],
  {
    tags: [CACHE_TAGS.STATS],
    revalidate: false,
  }
)
