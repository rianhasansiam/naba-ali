'use client';

import { useGetData } from "@/lib/hooks/useGetData";
import LoadingSpinner from "../../componets/loading/LoadingSpinner";
import BreadcrumbShop from './filters/BreadcrumbShop';
import ProductsPageClient from './ProductsPageClient';

export default function AllProductsPageClient() {
  // 🚀 OPTIMIZED: Use standardized query keys for data deduplication
  const { data: productsData, isLoading, error } = useGetData({
    name: "products", // Standardized query key
    api: "/api/products",
    cacheType: 'STATIC'
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useGetData({
    name: "categories", // Standardized query key
    api: "/api/categories", 
    cacheType: 'STATIC'
  });

  // Show loading state at page level
  const pageLoading = isLoading || categoriesLoading;

  if (pageLoading && !productsData && !categoriesData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-black text-center mb-8">
          <h1 className="text-6xl font-bold mb-4">NABA ALI</h1>
          <p className="text-xl mb-6">Loading products...</p>
        </div>
        <LoadingSpinner size="lg" color="black" />
      </div>
    );
  }

  if (error && !productsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to load products</h2>
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

  return (
    <main className="pb-20 container mx-auto">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <ProductsPageClient 
          productsData={productsData} 
          categoriesData={categoriesData} 
        />
      </div>
    </main>
  );
}