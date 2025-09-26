import { cache, unstable_cache } from 'next/cache'
import { 
  normalizeProducts, 
  normalizeCategories, 
  normalizeReviews,
  normalizeUsers,
  normalizeOrders,
  normalizeCoupons
} from '@/lib/data/dataSchemas'

// 🚀 NEXT.JS 15: Advanced caching with unstable_cache for persistent server-side caching

// Cache configuration for different data types
const CACHE_CONFIGS = {
  STATIC: {
    revalidate: 30 * 60, // 30 minutes
    tags: ['static-data']
  },
  DYNAMIC: {
    revalidate: 5 * 60, // 5 minutes  
    tags: ['dynamic-data']
  },
  USER_SPECIFIC: {
    revalidate: 1 * 60, // 1 minute
    tags: ['user-data']
  },
  REAL_TIME: {
    revalidate: 30, // 30 seconds
    tags: ['real-time-data']
  }
}

// Base API URL helper
const getApiUrl = (endpoint) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  return `${baseUrl}${endpoint}`
}

// 🚀 OPTIMIZED: Cached product fetching with multiple strategies
export const getCachedProducts = unstable_cache(
  async () => {
    try {
      console.log('🔄 Server: Fetching products from API...')
      const response = await fetch(getApiUrl('/api/products'), {
        next: { 
          revalidate: CACHE_CONFIGS.STATIC.revalidate,
          tags: ['products', ...CACHE_CONFIGS.STATIC.tags]
        }
      })
      
      if (!response.ok) {
        throw new Error(`Products API error: ${response.status}`)
      }
      
      const data = await response.json()
      const normalizedData = normalizeProducts(data)
      
      console.log(`✅ Server: Products loaded (${normalizedData.length} items)`)
      return normalizedData
    } catch (error) {
      console.error('❌ Server: Products fetch failed:', error.message)
      return []
    }
  },
  ['products'], // Cache key
  {
    revalidate: CACHE_CONFIGS.STATIC.revalidate,
    tags: ['products']
  }
)

// 🚀 OPTIMIZED: Cached categories with auto-invalidation
export const getCachedCategories = unstable_cache(
  async () => {
    try {
      console.log('🔄 Server: Fetching categories from API...')
      const response = await fetch(getApiUrl('/api/categories'), {
        next: { 
          revalidate: CACHE_CONFIGS.STATIC.revalidate,
          tags: ['categories', ...CACHE_CONFIGS.STATIC.tags]
        }
      })
      
      if (!response.ok) {
        throw new Error(`Categories API error: ${response.status}`)
      }
      
      const data = await response.json()
      const normalizedData = normalizeCategories(data)
      
      console.log(`✅ Server: Categories loaded (${normalizedData.length} items)`)
      return normalizedData
    } catch (error) {
      console.error('❌ Server: Categories fetch failed:', error.message)
      return []
    }
  },
  ['categories'],
  {
    revalidate: CACHE_CONFIGS.STATIC.revalidate,
    tags: ['categories']
  }
)

// 🚀 OPTIMIZED: Cached reviews with shorter revalidation
export const getCachedReviews = unstable_cache(
  async () => {
    try {
      console.log('🔄 Server: Fetching reviews from API...')
      const response = await fetch(getApiUrl('/api/reviews'), {
        next: { 
          revalidate: CACHE_CONFIGS.DYNAMIC.revalidate,
          tags: ['reviews', ...CACHE_CONFIGS.DYNAMIC.tags]
        }
      })
      
      if (!response.ok) {
        throw new Error(`Reviews API error: ${response.status}`)
      }
      
      const data = await response.json()
      const normalizedData = normalizeReviews(data)
      
      console.log(`✅ Server: Reviews loaded (${normalizedData.length} items)`)
      return normalizedData
    } catch (error) {
      console.error('❌ Server: Reviews fetch failed:', error.message)
      return []
    }
  },
  ['reviews'],
  {
    revalidate: CACHE_CONFIGS.DYNAMIC.revalidate,
    tags: ['reviews']
  }
)

// 🚀 OPTIMIZED: Cached users (admin data)
export const getCachedUsers = unstable_cache(
  async () => {
    try {
      console.log('🔄 Server: Fetching users from API...')
      const response = await fetch(getApiUrl('/api/users'), {
        next: { 
          revalidate: CACHE_CONFIGS.DYNAMIC.revalidate,
          tags: ['users', ...CACHE_CONFIGS.DYNAMIC.tags]
        }
      })
      
      if (!response.ok) {
        throw new Error(`Users API error: ${response.status}`)
      }
      
      const data = await response.json()
      const normalizedData = normalizeUsers(data)
      
      console.log(`✅ Server: Users loaded (${normalizedData.length} items)`)
      return normalizedData
    } catch (error) {
      console.error('❌ Server: Users fetch failed:', error.message)
      return []
    }
  },
  ['users'],
  {
    revalidate: CACHE_CONFIGS.DYNAMIC.revalidate,
    tags: ['users']
  }
)

// 🚀 OPTIMIZED: Cached orders
export const getCachedOrders = unstable_cache(
  async () => {
    try {
      console.log('🔄 Server: Fetching orders from API...')
      const response = await fetch(getApiUrl('/api/orders'), {
        next: { 
          revalidate: CACHE_CONFIGS.USER_SPECIFIC.revalidate,
          tags: ['orders', ...CACHE_CONFIGS.USER_SPECIFIC.tags]
        }
      })
      
      if (!response.ok) {
        throw new Error(`Orders API error: ${response.status}`)
      }
      
      const data = await response.json()
      const normalizedData = normalizeOrders(data)
      
      console.log(`✅ Server: Orders loaded (${normalizedData.length} items)`)
      return normalizedData
    } catch (error) {
      console.error('❌ Server: Orders fetch failed:', error.message)
      return []
    }
  },
  ['orders'],
  {
    revalidate: CACHE_CONFIGS.USER_SPECIFIC.revalidate,
    tags: ['orders']
  }
)

// 🚀 OPTIMIZED: Cached coupons
export const getCachedCoupons = unstable_cache(
  async () => {
    try {
      console.log('🔄 Server: Fetching coupons from API...')
      const response = await fetch(getApiUrl('/api/coupons'), {
        next: { 
          revalidate: CACHE_CONFIGS.DYNAMIC.revalidate,
          tags: ['coupons', ...CACHE_CONFIGS.DYNAMIC.tags]
        }
      })
      
      if (!response.ok) {
        throw new Error(`Coupons API error: ${response.status}`)
      }
      
      const data = await response.json()
      const normalizedData = normalizeCoupons(data)
      
      console.log(`✅ Server: Coupons loaded (${normalizedData.length} items)`)
      return normalizedData
    } catch (error) {
      console.error('❌ Server: Coupons fetch failed:', error.message)
      return []
    }
  },
  ['coupons'],
  {
    revalidate: CACHE_CONFIGS.DYNAMIC.revalidate,
    tags: ['coupons']
  }
)

// 🚀 NEXT.JS 15: Specific product fetcher with individual caching
export const getCachedProduct = cache(async (productId) => {
  if (!productId) return null
  
  try {
    console.log(`🔄 Server: Fetching product ${productId} from API...`)
    const response = await fetch(getApiUrl(`/api/products/${productId}`), {
      next: { 
        revalidate: CACHE_CONFIGS.STATIC.revalidate,
        tags: [`product-${productId}`, 'products']
      }
    })
    
    if (!response.ok) {
      throw new Error(`Product API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log(`✅ Server: Product ${productId} loaded`)
    return data
  } catch (error) {
    console.error(`❌ Server: Product ${productId} fetch failed:`, error.message)
    return null
  }
})

// 🚀 NEXT.JS 15: Comprehensive homepage data with parallel fetching
export const getOptimizedHomePageData = cache(async () => {
  console.log('🚀 Server: Starting optimized homepage data fetch...')
  const startTime = performance.now()
  
  try {
    // Parallel data fetching with individual caching
    const [products, categories, reviews, users] = await Promise.all([
      getCachedProducts(),
      getCachedCategories(),  
      getCachedReviews(),
      getCachedUsers()
    ])

    // Computed data for better performance
    const featuredProducts = products.filter(p => p.isInStock).slice(0, 8)
    const activeCategories = categories.filter(c => c.isActive && c.hasProducts)
    const approvedReviews = reviews.filter(r => r.isApproved).slice(0, 10)
    
    // Performance statistics
    const stats = {
      totalProducts: products.length,
      inStockProducts: products.filter(p => p.isInStock).length,
      totalCategories: activeCategories.length,
      totalReviews: approvedReviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0
    }

    const endTime = performance.now()
    console.log(`✅ Server: Homepage data loaded in ${(endTime - startTime).toFixed(2)}ms`)

    return {
      products,
      categories,
      reviews,
      users,
      featuredProducts,
      activeCategories,
      approvedReviews,
      stats,
      performance: {
        loadTime: endTime - startTime,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('❌ Server: Homepage data fetch failed:', error)
    
    // Return fallback data structure
    return {
      products: [],
      categories: [],
      reviews: [],
      users: [],
      featuredProducts: [],
      activeCategories: [],
      approvedReviews: [],
      stats: {
        totalProducts: 0,
        inStockProducts: 0,
        totalCategories: 0,
        totalReviews: 0,
        averageRating: 0
      },
      performance: {
        loadTime: performance.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error.message
      }
    }
  }
})

// 🚀 Cache invalidation helpers
export async function invalidateProductsCache() {
  'use server'
  const { revalidateTag } = await import('next/cache')
  revalidateTag('products')
  console.log('♻️ Products cache invalidated')
}

export async function invalidateCategoriesCache() {
  'use server'
  const { revalidateTag } = await import('next/cache')
  revalidateTag('categories')
  console.log('♻️ Categories cache invalidated')
}

export async function invalidateReviewsCache() {
  'use server'
  const { revalidateTag } = await import('next/cache')
  revalidateTag('reviews')
  console.log('♻️ Reviews cache invalidated')
}

export async function invalidateAllCache() {
  'use server'
  const { revalidateTag } = await import('next/cache')
  revalidateTag('static-data')
  revalidateTag('dynamic-data')
  revalidateTag('user-data')
  console.log('♻️ All cache invalidated')
}