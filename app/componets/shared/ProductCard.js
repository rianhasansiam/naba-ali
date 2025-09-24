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
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);

  const handleError = useCallback(() => {
    setImageError(true);
    setImageSrc('https://via.placeholder.com/700x700/f3f4f6/374151?text=Product');
  }, []);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={400}
      height={400}
      className={className}
      onError={handleError}
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
          src={product.imageUrl || product.image || ''}
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
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
              ${isInWishlist || justAdded.wishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
              }
            `}
          >
            <Heart size={18} fill={isInWishlist || justAdded.wishlist ? 'currentColor' : 'none'} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickView}
            className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-all duration-200"
          >
            <Eye size={18} />
          </motion.button>
        </div>

        {/* Quick Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCartToggle}
          className={`
            absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full
            flex items-center space-x-2 transition-all duration-200
            opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
            ${isInCart || justAdded.cart
              ? 'bg-green-500 text-white' 
              : 'bg-black text-white hover:bg-gray-800'
            }
          `}
        >
          <ShoppingCart size={16} />
          <span className="text-sm font-medium">
            {isInCart ? 'In Cart' : justAdded.cart ? 'Added!' : 'Add to Cart'}
          </span>
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