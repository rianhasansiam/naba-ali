'use client';

import React, { memo } from 'react';
import CategoryClient from './CategoryClient';
import { useGetData } from '@/lib/hooks/useGetData';
import { PageLoader } from '../shared/LoadingComponents';

const Category = memo(() => {
  // Fetch categories from database
  const { data: categoriesData, isLoading, error } = useGetData({
    name: 'categories',
    api: '/api/categories'
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

  // Loading state
  if (isLoading) {
    return (
      <section className="pt-16 bg-gray-50">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <PageLoader message="Loading categories..." />
        </div>
      </section>
    );
  }

  // Error state
  if (error || !categories.length) {
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
