import { useMemo } from 'react'

// 🚀 PERFORMANCE OPTIMIZATION: Advanced product filtering and search
export const useOptimizedProductFilters = (products = [], filters = {}) => {
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return []

    let filtered = [...products]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim()
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.shortDescription?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.style?.toLowerCase().includes(searchTerm)
      )
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === filters.category.toLowerCase()
      )
    }

    // Price range filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange
      filtered = filtered.filter(product => 
        product.price >= (min || 0) && product.price <= (max || Infinity)
      )
    }

    // Stock filter
    if (filters.stockStatus) {
      filtered = filtered.filter(product => {
        switch (filters.stockStatus) {
          case 'in-stock':
            return product.isInStock
          case 'low-stock':
            return product.isLowStock
          case 'out-of-stock':
            return !product.isInStock
          default:
            return true
        }
      })
    }

    // Discount filter
    if (filters.hasDiscount) {
      filtered = filtered.filter(product => product.discount > 0)
    }

    // Color filter
    if (filters.color) {
      filtered = filtered.filter(product => 
        product.colors?.some(color => 
          color.toLowerCase().includes(filters.color.toLowerCase())
        )
      )
    }

    // Size filter
    if (filters.size) {
      filtered = filtered.filter(product => 
        product.sizes?.some(size => 
          size.toLowerCase() === filters.size.toLowerCase()
        )
      )
    }

    // Sorting
    if (filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low-high':
            return a.price - b.price
          case 'price-high-low':
            return b.price - a.price
          case 'name-asc':
            return a.name?.localeCompare(b.name) || 0
          case 'name-desc':
            return b.name?.localeCompare(a.name) || 0
          case 'newest':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          case 'oldest':
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
          case 'discount':
            return b.discount - a.discount
          case 'stock':
            return b.stock - a.stock
          default:
            return 0
        }
      })
    }

    return filtered
  }, [products, filters])

  // Computed statistics
  const stats = useMemo(() => {
    return {
      total: filteredProducts.length,
      inStock: filteredProducts.filter(p => p.isInStock).length,
      outOfStock: filteredProducts.filter(p => !p.isInStock).length,
      onSale: filteredProducts.filter(p => p.discount > 0).length,
      averagePrice: filteredProducts.length > 0 
        ? filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length
        : 0,
      priceRange: filteredProducts.length > 0 
        ? {
            min: Math.min(...filteredProducts.map(p => p.price)),
            max: Math.max(...filteredProducts.map(p => p.price))
          }
        : { min: 0, max: 0 }
    }
  }, [filteredProducts])

  return {
    filteredProducts,
    stats
  }
}

// 🚀 PERFORMANCE OPTIMIZATION: Memoized product search
export const useProductSearch = (products = [], searchTerm = '') => {
  return useMemo(() => {
    if (!searchTerm.trim() || !Array.isArray(products)) return products

    const term = searchTerm.toLowerCase().trim()
    
    return products.filter(product => {
      // Primary matches (higher weight)
      const nameMatch = product.name?.toLowerCase().includes(term)
      const categoryMatch = product.category?.toLowerCase().includes(term)
      
      // Secondary matches
      const shortDescriptionMatch = product.shortDescription?.toLowerCase().includes(term)
      const descriptionMatch = product.description?.toLowerCase().includes(term)
      const styleMatch = product.style?.toLowerCase().includes(term)
      
      return nameMatch || categoryMatch || shortDescriptionMatch || descriptionMatch || styleMatch
    })
  }, [products, searchTerm])
}

// 🚀 PERFORMANCE OPTIMIZATION: Category-based product grouping
export const useProductsByCategory = (products = []) => {
  return useMemo(() => {
    if (!Array.isArray(products)) return {}

    return products.reduce((acc, product) => {
      const category = product.category || 'Uncategorized'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(product)
      return acc
    }, {})
  }, [products])
}

// 🚀 PERFORMANCE OPTIMIZATION: Featured products selection
export const useFeaturedProducts = (products = [], count = 8) => {
  return useMemo(() => {
    if (!Array.isArray(products)) return []

    return products
      .filter(product => product.isInStock)
      .sort((a, b) => {
        // Prioritize products with discounts and higher ratings
        const aScore = (a.discount || 0) + (a.rating || 0) * 10
        const bScore = (b.discount || 0) + (b.rating || 0) * 10
        return bScore - aScore
      })
      .slice(0, count)
  }, [products, count])
}

// 🚀 PERFORMANCE OPTIMIZATION: Product recommendations
export const useProductRecommendations = (currentProduct, allProducts = [], count = 4) => {
  return useMemo(() => {
    if (!currentProduct || !Array.isArray(allProducts)) return []

    return allProducts
      .filter(product => 
        product.id !== currentProduct.id &&
        product.isInStock &&
        (product.category === currentProduct.category || 
         product.style === currentProduct.style)
      )
      .sort((a, b) => {
        // Prioritize same category, then same style
        let aScore = 0
        let bScore = 0
        
        if (a.category === currentProduct.category) aScore += 10
        if (b.category === currentProduct.category) bScore += 10
        
        if (a.style === currentProduct.style) aScore += 5
        if (b.style === currentProduct.style) bScore += 5
        
        return bScore - aScore
      })
      .slice(0, count)
  }, [currentProduct, allProducts, count])
}