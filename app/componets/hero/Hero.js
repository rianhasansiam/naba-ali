'use client';

import React, { useMemo } from 'react';
import HeroClient from './HeroClient';
import { useGetData } from '@/lib/hooks/useGetData';

export default function Hero() {
  // ✅ Optimized data fetching with shared cache keys
  const { data: productsData, isLoading: productsLoading } = useGetData({ 
    name: 'homepage-products', // Shared key with FeaturedProducts component
    api: '/api/products',
    cacheType: 'STATIC' // Products change rarely, use long cache
  });
  const { data: usersData, isLoading: usersLoading } = useGetData({ 
    name: 'homepage-users', // Unique key for user stats
    api: '/api/users',
    cacheType: 'DYNAMIC' // User count changes more frequently
  });
  const { data: reviewsData, isLoading: reviewsLoading } = useGetData({ 
    name: 'homepage-reviews', // Shared key with Review component
    api: '/api/reviews',
    cacheType: 'DYNAMIC' // Reviews are added frequently
  });

  // Calculate real statistics from database data
  const heroStats = useMemo(() => {
    const productCount = Array.isArray(productsData) ? productsData.length : 0;
    const userCount = Array.isArray(usersData) ? usersData.length : 0;
    const reviewCount = Array.isArray(reviewsData) ? reviewsData.length : 0;

    // Calculate average rating from reviews
    const averageRating = reviewCount > 0 
      ? reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewCount
      : 0;

    const satisfactionRate = averageRating > 0 ? Math.round((averageRating / 5) * 100) : 95;

    return [
      { 
        number: productCount > 0 ? `${productCount}+` : "500+", 
        label: "Premium Products" 
      },
      { 
        number: userCount > 0 ? `${userCount > 1000 ? Math.round(userCount/1000) + 'K' : userCount}+` : "50K+", 
        label: "Happy Customers" 
      },
      { 
        number: `${satisfactionRate}%`, 
        label: "Satisfaction Rate" 
      }
    ];
  }, [productsData, usersData, reviewsData]);

  // Static hero content
  const heroData = {
    title: "Discover",
    subtitle: "Premium", 
    mainTitle: "Fashion",
    description: "Elevate your style with our curated collection of luxury items. Quality, comfort, and sophistication in every piece.",
    productName: "Premium Products",
    productPrice: "$100",
    productEmoji: "👟"
  };

  // Show loading state while any critical data is loading
  if (productsLoading && !productsData) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-pulse">
            <h1 className="text-6xl font-bold mb-4">NABA ALI</h1>
            <p className="text-xl">Loading premium collection...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <HeroClient 
      title={heroData.title}
      subtitle={heroData.subtitle}
      mainTitle={heroData.mainTitle}
      description={heroData.description}
      stats={heroStats}
      productName={heroData.productName}
      productPrice={heroData.productPrice}
      productEmoji={heroData.productEmoji}
    />
  );
}
