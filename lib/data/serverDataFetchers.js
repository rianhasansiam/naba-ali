import { cache } from 'react'
import { 
  normalizeProducts, 
  normalizeCategories, 
  normalizeReviews,
  normalizeUsers
} from '@/lib/data/dataSchemas'

// 🚀 NEXT.JS 15 OPTIMIZATION: Server-side cached data fetching
const getProducts = cache(async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`, {
      next: { 
        revalidate: 30 * 60, // 30 minutes cache
        tags: ['products'] 
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch products')
    
    const data = await response.json()
    return normalizeProducts(data)
  } catch (error) {
    console.error('Server: Failed to fetch products:', error)
    return []
  }
})

const getCategories = cache(async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories`, {
      next: { 
        revalidate: 30 * 60, // 30 minutes cache
        tags: ['categories']
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch categories')
    
    const data = await response.json()
    return normalizeCategories(data)
  } catch (error) {
    console.error('Server: Failed to fetch categories:', error)
    return []
  }
})

const getReviews = cache(async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reviews`, {
      next: { 
        revalidate: 5 * 60, // 5 minutes cache
        tags: ['reviews']
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch reviews')
    
    const data = await response.json()
    return normalizeReviews(data)
  } catch (error) {
    console.error('Server: Failed to fetch reviews:', error)
    return []
  }
})

const getUsers = cache(async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/users`, {
      next: { 
        revalidate: 5 * 60, // 5 minutes cache
        tags: ['users']
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch users')
    
    const data = await response.json()
    return normalizeUsers(data)
  } catch (error) {
    console.error('Server: Failed to fetch users:', error)
    return []
  }
})

// Server Actions for data revalidation
export async function revalidateProducts() {
  'use server'
  
  const { revalidateTag } = await import('next/cache')
  revalidateTag('products')
}

export async function revalidateCategories() {
  'use server'
  
  const { revalidateTag } = await import('next/cache')
  revalidateTag('categories')
}

export async function revalidateReviews() {
  'use server'
  
  const { revalidateTag } = await import('next/cache')
  revalidateTag('reviews')
}

export async function revalidateUsers() {
  'use server'
  
  const { revalidateTag } = await import('next/cache')
  revalidateTag('users')
}

// Main data fetcher that runs on server
export async function getHomePageData() {
  // 🚀 NEXT.JS 15: Parallel data fetching on server
  const [products, categories, reviews, users] = await Promise.all([
    getProducts(),
    getCategories(),
    getReviews(),
    getUsers()
  ])

  return {
    products,
    categories, 
    reviews,
    users,
    // Computed data for better performance
    featuredProducts: products.filter(p => p.isInStock).slice(0, 8),
    activeCategories: categories.filter(c => c.isActive && c.hasProducts),
    approvedReviews: reviews.filter(r => r.isApproved).slice(0, 10),
    stats: {
      totalProducts: products.length,
      inStockProducts: products.filter(p => p.isInStock).length,
      totalCategories: categories.filter(c => c.isActive).length,
      totalReviews: reviews.filter(r => r.isApproved).length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0
    }
  }
}