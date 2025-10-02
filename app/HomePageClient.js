'use client';

import { useGetData } from '@/lib/hooks/useGetData';
import GlobalLoadingPage from './componets/loading/GlobalLoadingPage';
import Hero from './componets/hero/Hero';
import Category from './componets/category/Category';
import FeaturedProducts from './componets/featuredProducts/FeaturedProducts';
import Review from './componets/review/Review';

export default function HomePageClient() {
  // 🚀 OPTIMIZED: Use standardized query keys for data deduplication
  const { data: productsData, isLoading: productsLoading, error: productsError } = useGetData({
    name: 'products', // Standardized query key
    api: '/api/products',
    cacheType: 'STATIC'
  });

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetData({
    name: 'categories', // Standardized query key  
    api: '/api/categories',
    cacheType: 'STATIC'
  });

  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useGetData({
    name: 'reviews', // Standardized query key
    api: '/api/reviews',
    cacheType: 'DYNAMIC'
  });

  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetData({
    name: 'users', // Standardized query key
    api: '/api/users',
    cacheType: 'DYNAMIC'
  });

  // Show loading state at page level while critical data is loading
  const isLoading = productsLoading || categoriesLoading || reviewsLoading || usersLoading;
  const hasError = productsError || categoriesError || reviewsError || usersError;

  // Keep showing loading until ALL data is ready (not just checking if data exists)
  if (isLoading) {
    return (
      <GlobalLoadingPage 
        message="Loading premium collection..." 
        showLogo={true}
      />
    );
  }

  if (hasError && (!productsData && !categoriesData && !reviewsData && !usersData)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to load content</h2>
          <p className="text-gray-600 mb-6">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // All data loaded - render all components together with opacity animation
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 opacity-0 animate-fadeIn">
      <Hero 
        productsData={productsData} 
        usersData={usersData} 
        reviewsData={reviewsData} 
      />
      <Category categoriesData={categoriesData} />
      <FeaturedProducts productsData={productsData} />
      <Review reviewsData={reviewsData} />
    </div>
  );
}