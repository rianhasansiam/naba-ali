'use client';

import React, { useMemo } from 'react';
import ReviewClient from './ReviewClient';
import { useGetData } from '@/lib/hooks/useGetData';
import { PageLoader } from '../shared/LoadingComponents';

export default function Review() {
  // ✅ Optimized: Use shared reviews data for homepage
  const { data: reviewsData, isLoading, error } = useGetData({
    name: 'homepage-reviews', // Unique key for homepage reviews
    api: '/api/reviews',
    cacheType: 'DYNAMIC' // Reviews are added frequently but not real-time
  });

  // Process real reviews data
  const customerReviews = useMemo(() => {
    if (!Array.isArray(reviewsData) || reviewsData.length === 0) {
      // Return empty array if no real reviews exist - component will handle empty state
      return [];
    }

    // Map real reviews to expected format
    return reviewsData
      .filter(review => review.rating && review.rating >= 4) // Only show good reviews on homepage
      .slice(0, 8) // Limit to 8 reviews for performance
      .map((review, index) => ({
        id: review._id || `review-${index}`,
        name: review.userName || review.customerName || review.name || `Customer ${index + 1}`,
        avatar: review.avatar || review.userAvatar || `https://ui-avatars.com/api/?name=Customer+${index + 1}&size=150&background=f3f4f6&color=374151`,
        rating: review.rating || 5,
        title: review.title || review.subject || "Great Product!",
        comment: review.comment || review.review || review.description || "Excellent experience with this product!",
        product: review.productName || review.product || "Product",
        date: review.createdAt ? 
          new Date(review.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }) : "Recently",
        verified: review.verified !== false // Default to verified unless explicitly false
      }));
  }, [reviewsData]);

  // Calculate review statistics
  const reviewStats = useMemo(() => {
    if (!Array.isArray(reviewsData) || reviewsData.length === 0) {
      return {
        averageRating: 4.8,
        totalReviews: 0,
        ratingBreakdown: {
          5: 85,
          4: 12,
          3: 2,
          2: 1,
          1: 0
        }
      };
    }

    const totalReviews = reviewsData.length;
    const averageRating = reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews;
    
    // Calculate rating breakdown
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      const rating = Math.round(review.rating || 0);
      if (breakdown[rating] !== undefined) {
        breakdown[rating]++;
      }
    });

    // Convert to percentages
    const ratingBreakdown = {};
    Object.keys(breakdown).forEach(star => {
      ratingBreakdown[star] = Math.round((breakdown[star] / totalReviews) * 100);
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
      ratingBreakdown
    };
  }, [reviewsData]);

  // Loading state - only show loader if we're actually loading and have no data
  if (isLoading && !reviewsData) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 xl:px-0 max-w-frame">
          <PageLoader message="Loading customer reviews..." />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <ReviewClient 
          reviews={customerReviews} 
          stats={reviewStats}
          error={error}
        />
      </div>
    </section>
  );
}
