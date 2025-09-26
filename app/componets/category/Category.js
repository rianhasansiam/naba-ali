'use client';

import React, { memo } from 'react';
import CategoryClient from './CategoryClient';

const Category = memo(({ categoriesData }) => {
  // Memoized categories processing - now with server-calculated product counts
  const categories = React.useMemo(() => {
    if (!Array.isArray(categoriesData)) return [];
    
    console.log('Category Debug - Categories Data with counts:', categoriesData);
    
    return categoriesData
      .filter(category => category.status === 'active')
      .map(category => {
        console.log(`Category Debug - "${category.name}": ${category.productCount || 0} products`);
        
        return {
          _id: category._id,
          name: category.name,
          slug: category.name.toLowerCase().replace(/\s+/g, '-'),
          image: category.image || `https://via.placeholder.com/500x500/f3f4f6/374151?text=${encodeURIComponent(category.name)}`,
          productCount: category.productCount || 0,
          description: category.description || "Shop now",
          status: category.status
        };
      });
  }, [categoriesData]);

  // Empty state
  if (!categories.length) {
    return (
      <section className="pt-16 bg-gray-50">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <div className="text-center py-16">
            <p className="text-gray-600">No categories available.</p>
          </div>
        </div>
      </section>
    );
  }

  return <CategoryClient categories={categories} />;
});

Category.displayName = 'Category';

export default Category;
