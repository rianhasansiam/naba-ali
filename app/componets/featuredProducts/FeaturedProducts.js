'use client';

import React, { useMemo } from 'react';
import FeaturedProductsClient from './FeaturedProductsClient';
import { useGetData } from '@/lib/hooks/useGetData';
import { PageLoader } from '../shared/LoadingComponents';

export default function FeaturedProducts() {
  // Fetch real products from database
  const { data: productsData, isLoading, error } = useGetData({
    name: 'products',
    api: '/api/products'
  });

  // Select featured products from real data
  const featuredProducts = useMemo(() => {
    if (!Array.isArray(productsData)) return [];

    // Get the first 4 products or filter by featured flag if it exists
    return productsData
      .filter(product => product.featured === true || productsData.indexOf(product) < 4)
      .slice(0, 4)
      .map(product => ({
        _id: product._id,
        id: product._id,
        name: product.name || product.title || `Product ${product._id}`,
        category: product.category || 'Fashion',
        style: product.style || 'Casual',
        price: product.price || product.discountPrice || 99,
        originalPrice: product.originalPrice && product.originalPrice > product.price ? product.originalPrice : null,
        image: product.image || product.images?.[0] || "https://via.placeholder.com/700x700/f3f4f6/374151?text=Product",
        rating: product.rating || 4.5,
        reviews: product.reviews || product.reviewCount || Math.floor(Math.random() * 50) + 10,
        isNew: product.isNew || false,
        isOnSale: product.originalPrice > product.price,
        color: product.color || product.colors?.[0] || 'Black',
        sizes: product.sizes || ['S', 'M', 'L', 'XL'],
        description: product.description || `High-quality ${product.category || 'product'} with premium materials.`
      }));
  }, [productsData]);

  // Loading state
  if (isLoading) {
    return (
      <section className="pt-10 bg-white">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <PageLoader message="Loading featured products..." />
        </div>
      </section>
    );
  }

  // Error state
  if (error || featuredProducts.length === 0) {
    return (
      <section className="pt-10 bg-white">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <div className="text-center py-16">
            <p className="text-gray-600">
              {error ? 'Unable to load featured products.' : 'No featured products available.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-10 bg-white">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <FeaturedProductsClient products={featuredProducts} />
      </div>
    </section>
  );
}
