import AllReviewsClient from './AllReviewsClient';

// Server Component - Handles data fetching
const AllReviews = () => {
  // Fallback static data for initial display (will be replaced by live data from API)
  const fallbackReviewsData = {
    reviews: [
      {
        id: 1,
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        productName: 'Premium Cotton T-Shirt',
        rating: 5,
        title: 'Excellent Quality!',
        comment: 'Amazing quality! The fabric is so soft and the fit is perfect.',
        date: '2025-09-15',
        status: 'approved',
        helpful: 12,
        verified: true
      }
    ],
    stats: {
      totalReviews: 1,
      averageRating: 5.0,
      pendingReviews: 0,
      approvedReviews: 1
    }
  };

  return <AllReviewsClient reviewsData={fallbackReviewsData} />;
};

export default AllReviews;