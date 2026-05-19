/**
 * lib/data/categories.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side data function for categories (with per-category product counts).
 *
 * revalidate: false — refreshes only via revalidateCategoryData().
 */

import { unstable_cache } from 'next/cache'
import { getCollection } from '@/lib/mongodb'
import { CACHE_TAGS } from '@/lib/cache/cache-tags'

async function fetchCategoriesFromDB() {
  try {
    const categoriesCol = await getCollection('allCategories')
    const productsCol   = await getCollection('allProducts')

    const [allCategories, allProducts] = await Promise.all([
      categoriesCol.find({}).toArray(),
      productsCol.find({}, { projection: { category: 1 } }).toArray(),
    ])

    // Build a count map — O(n) instead of O(n²)
    const countMap = new Map()
    for (const p of allProducts) {
      const key = p.category?.toLowerCase()?.trim()
      if (key) countMap.set(key, (countMap.get(key) || 0) + 1)
    }

    return allCategories.map(c => {
      const key   = c.name?.toLowerCase()?.trim()
      const count = countMap.get(key) || 0
      return {
        ...c,
        _id:         c._id.toString(),
        id:          c._id.toString(),
        productCount: count,
        hasProducts: count > 0,
        isActive:    Boolean(c.isActive ?? true),
      }
    })
  } catch (err) {
    console.error('❌ fetchCategoriesFromDB error:', err.message)
    return []
  }
}

export const getCategories = unstable_cache(
  fetchCategoriesFromDB,
  [CACHE_TAGS.CATEGORIES],
  {
    tags: [CACHE_TAGS.CATEGORIES],
    revalidate: false,
  }
)
