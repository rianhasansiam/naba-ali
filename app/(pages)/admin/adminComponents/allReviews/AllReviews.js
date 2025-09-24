'use client';

import { useMemo } from 'react';
import AllReviewsClient from './AllReviewsClient';
import { useGetData } from '@/lib/hooks/useGetData';

// Server Component - Handles data fetching
const AllReviews = () => {
  // Fetch real review data from API
  const { data: reviews = [], isLoading, error } = useGetData({ 
    name: 'reviews', 
    api: '/api/reviews' 
  });
  const { data: products = [] } = useGetData({ 
    name: 'products', 
    api: '/api/products' 
  });

  // Process review data to match expected format
  const reviewsData = useMemo(() => {
    if (isLoading || error || !reviews.length) {
      return {
        reviews: [],
        stats: {
          totalReviews: 0,
          averageRating: 0,
          pendingReviews: 0,
          approvedReviews: 0
        }
      };
    }

    // Calculate stats
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(review => review.status === 'approved').length;
    const pendingReviews = reviews.filter(review => review.status === 'pending').length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    // Enrich reviews with product names
    const enrichedReviews = reviews.map(review => {
      const product = products.find(p => p._id === review.productId);
      return {
        ...review,
        id: review._id,
        productName: product ? product.title : 'Unknown Product',
        date: new Date(review.createdAt).toLocaleDateString(),
        status: review.status || 'pending',
        helpful: review.helpful || 0,
        verified: review.verified || false
      };
    });

    return {
      reviews: enrichedReviews,
      stats: {
        totalReviews,
        averageRating: Number(averageRating.toFixed(1)),
        pendingReviews,
        approvedReviews
      }
    };
  }, [reviews, products, isLoading, error]);

  return <AllReviewsClient reviewsData={reviewsData} isLoading={isLoading} error={error} />;
};

export default AllReviews;