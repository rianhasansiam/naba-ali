'use client';

import React, { useMemo } from 'react';
import HeroClient from './HeroClient';
import { useGetData } from '@/lib/hooks/useGetData';

export default function Hero() {
  // Fetch real data from APIs
  const { data: productsData } = useGetData({ name: 'products', api: '/api/products' });
  const { data: usersData } = useGetData({ name: 'users', api: '/api/users' });
  const { data: reviewsData } = useGetData({ name: 'reviews', api: '/api/reviews' });

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
