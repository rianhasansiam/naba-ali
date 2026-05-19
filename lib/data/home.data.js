/**
 * lib/data/home.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single server-side function that aggregates all homepage data in one call.
 *
 * Usage in app/page.js (Server Component):
 *   const homeData = await getHomePageData()
 *
 * Uses parallel fetching across the individual cached functions.
 * Each individual function has its own cache entry and its own tag,
 * so fine-grained revalidation still works.
 *
 * This composite function itself is NOT wrapped in unstable_cache because:
 *   - The underlying functions are already individually cached.
 *   - React's cache() deduplicates calls within a single render pass.
 */

import { cache } from 'react'
import { getProducts }       from './products.data'
import { getCategories }     from './categories.data'
import { getApprovedReviews } from './reviews.data'
import { getHomeStats }      from './stats.data'

/**
 * Fetches all homepage data in parallel.
 * cache() from React deduplicates within the same server request
 * (so generateMetadata + page component share the same fetch).
 */
export const getHomePageData = cache(async () => {
  const [products, categories, reviews, stats] = await Promise.all([
    getProducts(),
    getCategories(),
    getApprovedReviews(),
    getHomeStats(),
  ])

  return {
    products,
    categories,
    reviews,
    stats,
    // Derived/computed views — no extra DB round-trips
    featuredProducts:  products.filter(p => p.isInStock).slice(0, 8),
    activeCategories:  categories.filter(c => c.isActive && c.hasProducts),
    approvedReviews:   reviews.slice(0, 10), // already filtered & sorted in reviews.data.js
  }
})
