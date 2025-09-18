import AllReviewsClient from './AllReviewsClient';

// Server Component - Handles data fetching
const AllReviews = () => {
  // Server-side reviews data (could come from database/API)
  const reviewsData = {
    reviews: [
      {
        id: 1,
        customerName: 'Sarah Johnson',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c605?w=100&h=100&fit=crop',
        productName: 'Premium Cotton T-Shirt',
        productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Amazing quality! The fabric is so soft and the fit is perfect.',
        date: '2025-09-15',
        status: 'approved',
        helpful: 12
      }
      // More reviews would be added here
    ],
    stats: {
      totalReviews: 1234,
      averageRating: 4.6,
      pendingReviews: 23,
      approvedReviews: 1211
    }
  };

  return <AllReviewsClient reviewsData={reviewsData} />;
};

export default AllReviews;