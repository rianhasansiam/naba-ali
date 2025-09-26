'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

// Shared loading spinner component
const LoadingSpinner = memo(({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-black',
    gray: 'border-gray-600',
    white: 'border-white',
    red: 'border-red-600'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        border-2 border-t-transparent 
        ${colorClasses[color]} 
        rounded-full animate-spin
      `}
    />
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Product card skeleton loader
const ProductCardSkeleton = memo(() => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
    <div className="aspect-square bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
    </div>
  </div>
));

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

// Products grid skeleton
const ProductGridSkeleton = memo(({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={`skeleton-${index}`} />
    ))}
  </div>
));

ProductGridSkeleton.displayName = 'ProductGridSkeleton';

// Full page loader
const PageLoader = memo(({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <LoadingSpinner size="lg" />
    <p className="text-gray-600">{message}</p>
  </div>
));

PageLoader.displayName = 'PageLoader';

// Inline loader for buttons
const ButtonLoader = memo(() => (
  <LoadingSpinner size="sm" color="white" />
));

ButtonLoader.displayName = 'ButtonLoader';

// Loading overlay for forms
const LoadingOverlay = memo(({ isLoading, children }) => (
  <div className="relative">
    {children}
    {isLoading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"
      >
        <div className="text-center space-y-2">
          <LoadingSpinner size="md" />
          <p className="text-sm text-gray-600">Please wait...</p>
        </div>
      </motion.div>
    )}
  </div>
));

LoadingOverlay.displayName = 'LoadingOverlay';

export {
  LoadingSpinner,
  ProductCardSkeleton,
  ProductGridSkeleton,
  PageLoader,
  ButtonLoader,
  LoadingOverlay
};