// Utility functions for cart and wishlist operations
import { addToCart, addToWishlist, removeFromWishlist, removeFromCart } from '@/app/redux/slice';

export const cartUtils = {
  // Add product to cart with proper format
  addProduct: (dispatch, product, options = {}) => {
    const { quantity = 1, size = 'M', color = 'Default' } = options;
    
    dispatch(addToCart({
      product: product,
      quantity,
      size,
      color
    }));
  },

  // Remove product from cart
  removeProduct: (dispatch, productId, cartItems, options = {}) => {
    const { size = 'M', color = 'Default' } = options;
    const cartItem = cartItems.find(item => 
      item.id === productId && 
      item.size === size && 
      item.color === color
    );
    
    if (cartItem) {
      dispatch(removeFromCart({
        id: productId,
        size,
        color
      }));
    }
  },

  // Check if product is in cart
  isInCart: (productId, cartItems, options = {}) => {
    const { size = 'M', color = 'Default' } = options;
    return cartItems.some(item => 
      item.id === productId && 
      item.size === size && 
      item.color === color
    );
  }
};

export const wishlistUtils = {
  // Add product to wishlist
  addProduct: (dispatch, product) => {
    const productId = product.id || product._id;
    dispatch(addToWishlist({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.primaryImage || product.imageUrl || product.image,
      category: product.category
    }));
  },

  // Remove product from wishlist
  removeProduct: (dispatch, productId) => {
    dispatch(removeFromWishlist(productId));
  },

  // Check if product is in wishlist
  isInWishlist: (productId, wishlistItems) => {
    return wishlistItems.some(item => item.id === productId);
  }
};

// Combined utility for toggle actions
export const toggleUtils = {
  cart: (dispatch, product, cartItems, options = {}) => {
    const productId = product.id || product._id;
    const isInCart = cartUtils.isInCart(productId, cartItems, options);
    
    if (isInCart) {
      cartUtils.removeProduct(dispatch, productId, cartItems, options);
      return { action: 'removed', isInCart: false };
    } else {
      cartUtils.addProduct(dispatch, product, options);
      return { action: 'added', isInCart: true };
    }
  },

  wishlist: (dispatch, product, wishlistItems) => {
    const productId = product.id || product._id;
    const isInWishlist = wishlistUtils.isInWishlist(productId, wishlistItems);
    
    if (isInWishlist) {
      wishlistUtils.removeProduct(dispatch, productId);
      return { action: 'removed', isInWishlist: false };
    } else {
      wishlistUtils.addProduct(dispatch, product);
      return { action: 'added', isInWishlist: true };
    }
  }
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Format price with currency
export const formatPrice = (price, currency = '৳') => {
  if (typeof price !== 'number') return `${currency}0.00`;
  return `${currency}${price.toFixed(2)}`;
};

// Stock status helpers
export const stockUtils = {
  getStatus: (stockCount) => {
    if (stockCount === 0) return 'out-of-stock';
    if (stockCount < 5) return 'low-stock';
    return 'in-stock';
  },

  getStatusText: (stockCount) => {
    const status = stockUtils.getStatus(stockCount);
    switch (status) {
      case 'out-of-stock':
        return 'Out of stock';
      case 'low-stock':
        return `Only ${stockCount} left`;
      default:
        return `${stockCount} in stock`;
    }
  },

  getStatusColor: (stockCount) => {
    const status = stockUtils.getStatus(stockCount);
    switch (status) {
      case 'out-of-stock':
        return 'destructive';
      case 'low-stock':
        return 'warning';
      default:
        return 'default';
    }
  }
};