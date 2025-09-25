'use client';

import React from 'react';
import { ProductCardSkeleton } from '../loading/SkeletonLoaders';
import LoadingSpinner from '../loading/LoadingSpinner';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductCardWithLoading = ({ 
  product, 
  onProductClick,
  onAddToCart,
  variant = 'default',
  isLoading = false,
  ...props 
}) => {
  // Show skeleton loader when no product data is available
  if (!product && isLoading) {
    return <ProductCardSkeleton />;
  }

  // If we have product data but it's still loading (e.g., updating), show product with loading overlay
  if (product && isLoading) {
    return (
      <div className="relative">
        {/* Import the original ProductCard component */}
        <ProductCard 
          product={product}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          variant={variant}
          {...props}
        />
        {/* Loading overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl"
        >
          <LoadingSpinner size="md" />
        </motion.div>
      </div>
    );
  }

  // Normal product card when not loading and product exists
  if (product) {
    return (
      <ProductCard 
        product={product}
        onProductClick={onProductClick}
        onAddToCart={onAddToCart}
        variant={variant}
        {...props}
      />
    );
  }

  // Fallback for no product and not loading
  return null;
};

// Re-export the original ProductCard for direct use
export { default as ProductCard } from './ProductCard';
export default ProductCardWithLoading;