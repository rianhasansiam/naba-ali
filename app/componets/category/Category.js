'use client';

import CategoryClient from './CategoryClient';
import { useGetData } from '@/lib/hooks/useGetData';

export default function Category() {
  // Fetch categories from database
  const { data: categoriesData, isLoading, error } = useGetData({
    name: 'categories',
    api: '/api/categories'
  });

  // Simple loading state
  if (isLoading) {
    return (
      <section className="pt-16 bg-gray-50">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <div className="text-center py-16">
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  // Simple error state
  if (error || !categoriesData?.Data) {
    return (
      <section className="pt-16 bg-gray-50">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <div className="text-center py-16">
            <p className="text-gray-600">Unable to load categories.</p>
          </div>
        </div>
      </section>
    );
  }

  // Format categories for display
  const categories = categoriesData.Data
    .filter(category => category.status === 'active')
    .map(category => ({
      id: category._id,
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
      image: category.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop&auto=format",
      itemCount: 0, // Simplified - no product counting
      description: category.description || "Shop now"
    }));

  return (
    <section className="pt-16 bg-gray-50">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <CategoryClient categories={categories} />
      </div>
    </section>
  );
}
