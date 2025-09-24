'use client';

import React, { memo } from 'react';
import CategoryClient from './CategoryClient';
import { useGetData } from '@/lib/hooks/useGetData';
import { PageLoader } from '../shared/LoadingComponents';

const Category = memo(() => {
  // ✅ Optimized: Categories rarely change, use long cache
  const { data: categoriesData, isLoading, error } = useGetData({
    name: 'homepage-categories', // Unique key for homepage categories
    api: '/api/categories',
    cacheType: 'STATIC' // Categories change very rarely
  });

  // Memoized categories processing
  const categories = React.useMemo(() => {
    if (!Array.isArray(categoriesData)) return [];
    
    return categoriesData
      .filter(category => category.status === 'active')
      .map(category => ({
        _id: category._id,
        name: category.name,
        slug: category.name.toLowerCase().replace(/\s+/g, '-'),
        image: category.image || `https://via.placeholder.com/500x500/f3f4f6/374151?text=Category`,
        productCount: category.productCount || 0,
        description: category.description || "Shop now",
        status: category.status
      }));
  }, [categoriesData]);

  // Loading state - only show loader if we're actually loading and have no data
  if (isLoading && !categoriesData) {
    return (
      <section className="pt-16 bg-gray-50">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <PageLoader message="Loading categories..." />
        </div>
      </section>
    );
  }

  // Error state - only show error if we have an error and no data to show
  if (error && !categoriesData) {
    return (
      <section className="pt-16 bg-gray-50">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">Failed to load categories</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!categories.length && !isLoading) {
    return (
      <section className="pt-16 bg-gray-50">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <div className="text-center py-16">
            <p className="text-gray-600">
              {error ? 'Unable to load categories.' : 'No categories available.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return <CategoryClient categories={categories} />;
});

Category.displayName = 'Category';

export default Category;
