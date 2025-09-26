import { useMemo } from 'react'

// 🚀 PERFORMANCE OPTIMIZATION: Advanced order filtering and analysis
export const useOrderAnalytics = (orders = []) => {
  return useMemo(() => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        statusBreakdown: {},
        monthlyTrends: [],
        topCustomers: [],
        recentOrders: [],
        paymentMethodBreakdown: {}
      }
    }

    // Basic metrics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (order.summary?.total || 0), 0)
    const averageOrderValue = totalRevenue / totalOrders

    // Status breakdown
    const statusBreakdown = orders.reduce((acc, order) => {
      const status = order.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    // Monthly trends (last 12 months)
    const monthlyTrends = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, orders: 0, revenue: 0 }
      }
      
      acc[monthKey].orders += 1
      acc[monthKey].revenue += order.summary?.total || 0
      
      return acc
    }, {})

    // Convert to array and sort by month
    const monthlyTrendsArray = Object.values(monthlyTrends)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12) // Last 12 months

    // Top customers by order value
    const customerTotals = orders.reduce((acc, order) => {
      const customerEmail = order.customer?.email
      if (customerEmail) {
        if (!acc[customerEmail]) {
          acc[customerEmail] = {
            email: customerEmail,
            name: order.customer.name,
            totalSpent: 0,
            totalOrders: 0
          }
        }
        acc[customerEmail].totalSpent += order.summary?.total || 0
        acc[customerEmail].totalOrders += 1
      }
      return acc
    }, {})

    const topCustomers = Object.values(customerTotals)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    // Recent orders (last 10)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)

    // Payment method breakdown
    const paymentMethodBreakdown = orders.reduce((acc, order) => {
      const method = order.payment?.type || 'unknown'
      acc[method] = (acc[method] || 0) + 1
      return acc
    }, {})

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusBreakdown,
      monthlyTrends: monthlyTrendsArray,
      topCustomers,
      recentOrders,
      paymentMethodBreakdown
    }
  }, [orders])
}

// 🚀 PERFORMANCE OPTIMIZATION: User-specific order filtering
export const useUserOrders = (orders = [], userId) => {
  return useMemo(() => {
    if (!userId || !Array.isArray(orders)) return []

    return orders
      .filter(order => 
        order.customer?.email === userId || 
        order.customerId === userId ||
        order.customer?.id === userId
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, userId])
}

// 🚀 PERFORMANCE OPTIMIZATION: Order status filtering
export const useOrdersByStatus = (orders = []) => {
  return useMemo(() => {
    if (!Array.isArray(orders)) return {}

    return orders.reduce((acc, order) => {
      const status = order.status || 'unknown'
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(order)
      return acc
    }, {})
  }, [orders])
}

// 🚀 PERFORMANCE OPTIMIZATION: Review analytics
export const useReviewAnalytics = (reviews = []) => {
  return useMemo(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {},
        approvedReviews: 0,
        pendingReviews: 0,
        verifiedReviews: 0,
        recentReviews: [],
        topRatedProducts: []
      }
    }

    const totalReviews = reviews.length
    const approvedReviews = reviews.filter(r => r.isApproved).length
    const pendingReviews = reviews.filter(r => r.status === 'pending').length
    const verifiedReviews = reviews.filter(r => r.verified).length

    // Average rating
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    // Rating distribution
    const ratingDistribution = reviews.reduce((acc, review) => {
      const rating = review.rating
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {})

    // Recent reviews
    const recentReviews = [...reviews]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)

    // Top rated products
    const productRatings = reviews.reduce((acc, review) => {
      const productId = review.productId
      if (!acc[productId]) {
        acc[productId] = {
          productId,
          productName: review.productName,
          ratings: [],
          totalRating: 0,
          reviewCount: 0
        }
      }
      
      acc[productId].ratings.push(review.rating)
      acc[productId].totalRating += review.rating
      acc[productId].reviewCount += 1
      
      return acc
    }, {})

    const topRatedProducts = Object.values(productRatings)
      .map(product => ({
        ...product,
        averageRating: product.totalRating / product.reviewCount
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 10)

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      approvedReviews,
      pendingReviews,
      verifiedReviews,
      recentReviews,
      topRatedProducts
    }
  }, [reviews])
}

// 🚀 PERFORMANCE OPTIMIZATION: User analytics
export const useUserAnalytics = (users = []) => {
  return useMemo(() => {
    if (!Array.isArray(users) || users.length === 0) {
      return {
        totalUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
        verifiedUsers: 0,
        googleUsers: 0,
        credentialUsers: 0,
        recentUsers: [],
        userGrowth: []
      }
    }

    const totalUsers = users.length
    const adminUsers = users.filter(u => u.isAdmin).length
    const regularUsers = totalUsers - adminUsers
    const verifiedUsers = users.filter(u => u.isVerified).length
    const googleUsers = users.filter(u => u.isGoogleUser).length
    const credentialUsers = users.filter(u => u.provider === 'credentials').length

    // Recent users
    const recentUsers = [...users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)

    // User growth (monthly)
    const userGrowth = users.reduce((acc, user) => {
      const date = new Date(user.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, newUsers: 0 }
      }
      
      acc[monthKey].newUsers += 1
      
      return acc
    }, {})

    const userGrowthArray = Object.values(userGrowth)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12) // Last 12 months

    return {
      totalUsers,
      adminUsers,
      regularUsers,
      verifiedUsers,
      googleUsers,
      credentialUsers,
      recentUsers,
      userGrowth: userGrowthArray
    }
  }, [users])
}