'use client';

import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/reduxHooks';
import { addToCart, addToWishlist, removeFromWishlist, removeFromCart } from '@/app/redux/slice';
import { toggleUtils, calculateDiscount, formatPrice, stockUtils } from '@/lib/utils/productUtils';
import Image from 'next/image';

// Shared Badge component
const Badge = memo(({ children, className, variant = 'default' }) => {
  const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-md";
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-500 text-white"
  };
  const classes = `${baseClasses} ${variantClasses[variant]} ${className || ""}`;
  
  return <span className={classes}>{children}</span>;
});

Badge.displayName = 'Badge';

// Optimized Image with fallback
const OptimizedImage = memo(({ src, alt, className, ...props }) => {
  // Use a data URL for placeholder to avoid optimization issues
  const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjE1MCIgeT0iMTUwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjEwIiBmaWxsPSIjOWNhM2FmIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+';
  const initialSrc = src && src.trim() ? src : fallbackSrc;
  
  const [imageSrc, setImageSrc] = useState(initialSrc);
  const [imageError, setImageError] = useState(!src || !src.trim());

  const handleError = useCallback(() => {
    setImageError(true);
    setImageSrc(fallbackSrc);
  }, []);

  // If using fallback, disable Next.js optimization to avoid 500 errors
  const isUsingFallback = imageSrc === fallbackSrc;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={400}
      height={400}
      className={className}
      onError={handleError}
      unoptimized={isUsingFallback}
      {...props}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Main ProductCard Component - Memoized for performance
const ProductCard = memo(({ 
  product, 
  onProductClick,
  onAddToCart,
  variant = 'default' // 'default', 'featured'
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Get current cart and wishlist state from Redux
  const cartItems = useAppSelector((state) => state.user.cart.items);
  const wishlistItems = useAppSelector((state) => state.user.wishlist.items);
  
  // Check if product is already in cart or wishlist - memoized for performance
  const isInCart = React.useMemo(() => 
    cartItems.some(item => item.id === product._id), [cartItems, product._id]
  );
  const isInWishlist = React.useMemo(() => 
    wishlistItems.some(item => item.id === product._id), [wishlistItems, product._id]
  );
  
  const [justAdded, setJustAdded] = useState({ cart: false, wishlist: false });

  // Calculate discount percentage using utility
  const discount = React.useMemo(() => 
    calculateDiscount(product.originalPrice, product.price), 
    [product.originalPrice, product.price]
  );

  // Memoized event handlers
  const handleCartToggle = useCallback((e) => {
    e.stopPropagation();
    
    try {
      const result = toggleUtils.cart(dispatch, product, cartItems);
      
      // Show feedback animation for both add and remove actions
      if (result.action === 'added') {
        setJustAdded(prev => ({ ...prev, cart: true }));
        setTimeout(() => setJustAdded(prev => ({ ...prev, cart: false })), 2000);
      }
      
      onAddToCart?.(product);
    } catch (error) {
      console.error('Error toggling cart:', error);
    }
  }, [dispatch, product, cartItems, onAddToCart]);

  const handleWishlistToggle = useCallback((e) => {
    e.stopPropagation();
    
    try {
      const result = toggleUtils.wishlist(dispatch, product, wishlistItems);
      
      // Show feedback animation for both add and remove actions
      if (result.action === 'added') {
        setJustAdded(prev => ({ ...prev, wishlist: true }));
        setTimeout(() => setJustAdded(prev => ({ ...prev, wishlist: false })), 2000);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  }, [dispatch, product, wishlistItems]);

  const handleProductClick = useCallback(() => {
    onProductClick?.();
    router.push(`/productDetails/${product._id}`);
  }, [onProductClick, router, product._id]);

  const handleQuickView = useCallback((e) => {
    e.stopPropagation();
    // Quick view modal logic could be added here
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      onClick={handleProductClick}
      className={`
        relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl 
        transition-all duration-300 cursor-pointer group border border-gray-100
        ${variant === 'featured' ? 'max-w-sm' : ''}
      `}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <OptimizedImage
          src={product.primaryImage || product.imageUrl || product.image}
          alt={product.name || 'Product'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-3 left-3 z-10">
            -{discount}%
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistToggle}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg
              ${isInWishlist 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
              }
              ${justAdded.wishlist ? 'animate-pulse' : ''}
            `}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart 
              size={18} 
              fill={isInWishlist ? 'currentColor' : 'none'}
              className="transition-all duration-200"
            />
          </motion.button>
        </div>

        {/* Quick Add to Cart Button - Toggle Style */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCartToggle}
          className={`
            absolute bottom-3 right-3 w-10 h-10 rounded-full
            flex items-center justify-center transition-all duration-200 shadow-lg
            opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
            ${isInCart 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-black text-white hover:bg-gray-800'
            }
            ${justAdded.cart ? 'animate-bounce' : ''}
          `}
          title={isInCart ? 'Remove from Cart' : 'Add to Cart'}
        >
          <ShoppingCart 
            size={18} 
            fill={isInCart ? 'currentColor' : 'none'}
            className="transition-all duration-200"
          />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {product.rating || '4.5'}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <span className="text-sm text-gray-500 capitalize">
            {product.category}
          </span>
        </div>

        {/* Stock Status */}
        {product.stockCount !== undefined && (
          <div className="mt-2">
            <Badge 
              variant={product.stockCount > 0 ? 'default' : 'destructive'}
              className="text-xs"
            >
              {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;