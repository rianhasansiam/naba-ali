/**
 * lib/data/categories.data.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side data function for categories (with per-category product counts).
 *
 * revalidate: false — refreshes via category/product revalidation tags.
 */

import { unstable_cache } from 'next/cache'
import { getCollection } from '@/lib/mongodb'
import { CACHE_TAGS } from '@/lib/cache/cache-tags'

async function fetchCategoriesFromDB() {
  try {
    const categoriesCol = await getCollection('allCategories')
    const productsCol   = await getCollection('allProducts')

    const [allCategories, productCategoryCounts] = await Promise.all([
      categoriesCol.find({}).toArray(),
      productsCol.aggregate([
        {
          $project: {
            categoryKey: {
              $trim: {
                input: {
                  $toLower: {
                    $convert: {
                      input: '$category',
                      to: 'string',
                      onError: '',
                      onNull: '',
                    },
                  },
                },
              },
            },
          },
        },
        { $match: { categoryKey: { $ne: '' } } },
        { $group: { _id: '$categoryKey', count: { $sum: 1 } } },
      ]).toArray(),
    ])

    // Counts are grouped in MongoDB; only one row per category is returned here.
    const countMap = new Map()
    for (const row of productCategoryCounts) {
      if (row._id) countMap.set(row._id, row.count)
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
    tags: [CACHE_TAGS.CATEGORIES, CACHE_TAGS.PRODUCTS],
    revalidate: false,
  }
)
