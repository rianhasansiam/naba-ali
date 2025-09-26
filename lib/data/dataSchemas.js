// 🚀 Data structure optimizations based on actual API responses

// Product data structure normalization
export const normalizeProduct = (product) => {
  if (!product) return null;
  
  return {
    _id: product._id, // Preserve original _id for backwards compatibility
    id: product._id,
    name: product.name,
    category: product.category,
    style: product.style,
    price: Number(product.price),
    originalPrice: Number(product.originalPrice),
    stock: Number(product.stock),
    description: product.description,
    images: Array.isArray(product.images) ? product.images : [product.image],
    primaryImage: product.image || product.images?.[0],
    colors: Array.isArray(product.colors) ? product.colors : [product.color],
    sizes: Array.isArray(product.sizes) ? product.sizes : ['M'],
    createdAt: product.createdAt,
    // Computed properties for performance
    discount: product.originalPrice && product.price ? 
      Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
    isInStock: Number(product.stock) > 0,
    isLowStock: Number(product.stock) > 0 && Number(product.stock) < 5,
    stockStatus: Number(product.stock) === 0 ? 'out-of-stock' : 
                Number(product.stock) < 5 ? 'low-stock' : 'in-stock'
  };
};

// Order data structure normalization
export const normalizeOrder = (order) => {
  if (!order) return null;
  
  return {
    id: order._id,
    orderId: order.orderId,
    orderDate: order.orderDate,
    customer: {
      name: order.customerInfo?.name,
      email: order.customerInfo?.email,
      phone: order.customerInfo?.phone,
      address: order.customerInfo?.address
    },
    items: order.items?.map(item => ({
      productId: item.productId,
      productName: item.productName,
      price: Number(item.price),
      quantity: Number(item.quantity),
      size: item.size,
      color: item.color,
      subtotal: Number(item.subtotal)
    })) || [],
    payment: {
      type: order.paymentMethod?.type,
      name: order.paymentMethod?.name
    },
    summary: {
      subtotal: Number(order.orderSummary?.subtotal),
      shipping: Number(order.orderSummary?.shipping),
      tax: Number(order.orderSummary?.tax),
      total: Number(order.orderSummary?.total)
    },
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    // Computed properties
    totalItems: order.items?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0,
    statusColor: getOrderStatusColor(order.status)
  };
};

// Review data structure normalization
export const normalizeReview = (review) => {
  if (!review) return null;
  
  return {
    id: review._id,
    productId: review.productId,
    productName: review.productName,
    customer: {
      name: review.customerName,
      email: review.customerEmail
    },
    rating: Number(review.rating),
    comment: review.comment,
    photo: review.photo,
    title: review.title,
    status: review.status,
    verified: Boolean(review.verified),
    date: review.date,
    helpful: Number(review.helpful),
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    // Computed properties
    isApproved: review.status === 'approved',
    hasPhoto: Boolean(review.photo),
    ratingStars: Array.from({ length: 5 }, (_, i) => i < Number(review.rating))
  };
};

// Coupon data structure normalization
export const normalizeCoupon = (coupon) => {
  if (!coupon) return null;
  
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);
  const now = new Date();
  
  return {
    id: coupon._id,
    code: coupon.code,
    discount: Number(coupon.discount),
    type: coupon.type,
    description: coupon.description,
    minAmount: Number(coupon.minAmount),
    usageLimit: Number(coupon.usageLimit),
    startDate: coupon.startDate,
    endDate: coupon.endDate,
    status: coupon.status,
    used: Number(coupon.used),
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt,
    // Computed properties
    isActive: coupon.status === 'active',
    isExpired: endDate < now,
    isStarted: startDate <= now,
    isValid: coupon.status === 'active' && startDate <= now && endDate >= now,
    usagePercentage: coupon.usageLimit > 0 ? (Number(coupon.used) / Number(coupon.usageLimit)) * 100 : 0,
    daysLeft: Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)))
  };
};

// Category data structure normalization
export const normalizeCategory = (category) => {
  if (!category) return null;
  
  return {
    id: category._id,
    name: category.name,
    description: category.description,
    image: category.image,
    status: category.status,
    productCount: Number(category.productCount),
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    // Computed properties
    isActive: category.status === 'active',
    hasProducts: Number(category.productCount) > 0,
    slug: category.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  };
};

// User data structure normalization
export const normalizeUser = (user) => {
  if (!user) return null;
  
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    image: user.image || user.profileData?.picture,
    role: user.role,
    provider: user.provider,
    phone: user.phone,
    createdAt: user.createdAt,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    profileData: user.profileData,
    updatedAt: user.updatedAt,
    // Computed properties
    isAdmin: user.role === 'admin',
    isVerified: Boolean(user.emailVerified),
    hasImage: Boolean(user.image || user.profileData?.picture),
    initials: user.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U',
    displayName: user.name || 'User',
    isGoogleUser: user.provider === 'google',
    hasPhone: Boolean(user.phone)
  };
};

// Helper function for order status colors
const getOrderStatusColor = (status) => {
  const colors = {
    'pending': 'warning',
    'confirmed': 'info', 
    'processing': 'info',
    'shipped': 'primary',
    'delivered': 'success',
    'cancelled': 'destructive',
    'refunded': 'secondary'
  };
  return colors[status] || 'default';
};

// Batch normalization functions for performance
export const normalizeProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(normalizeProduct).filter(Boolean);
};

export const normalizeOrders = (orders) => {
  if (!Array.isArray(orders)) return [];
  return orders.map(normalizeOrder).filter(Boolean);
};

export const normalizeReviews = (reviews) => {
  if (!Array.isArray(reviews)) return [];
  return reviews.map(normalizeReview).filter(Boolean);
};

export const normalizeCoupons = (coupons) => {
  if (!Array.isArray(coupons)) return [];
  return coupons.map(normalizeCoupon).filter(Boolean);
};

export const normalizeCategories = (categories) => {
  if (!Array.isArray(categories)) return [];
  return categories.map(normalizeCategory).filter(Boolean);
};

export const normalizeUsers = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map(normalizeUser).filter(Boolean);
};