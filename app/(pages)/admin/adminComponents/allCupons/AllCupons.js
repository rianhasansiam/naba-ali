import AllCuponsClient from './AllCuponsClient';

// Server Component - Handles data fetching
const AllCupons = () => {
  // Server-side coupons data (could come from database/API)
  const cuponsData = {
    coupons: [
      {
        id: 1,
        code: 'WELCOME20',
        title: 'Welcome Discount',
        description: '20% off on first purchase',
        discountType: 'percentage',
        discountValue: 20,
        minOrder: 50,
        maxDiscount: 100,
        usageCount: 234,
        usageLimit: 1000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: 'active'
      },
      {
        id: 2,
        code: 'SAVE50',
        title: 'Fixed Discount',
        description: '$50 off on orders above $200',
        discountType: 'fixed',
        discountValue: 50,
        minOrder: 200,
        maxDiscount: 50,
        usageCount: 89,
        usageLimit: 500,
        startDate: '2025-06-01',
        endDate: '2025-09-30',
        status: 'active'
      }
      // More coupons would be added here
    ],
    stats: {
      totalCoupons: 15,
      activeCoupons: 12,
      expiredCoupons: 3,
      totalSavings: 15670
    }
  };

  return <AllCuponsClient cuponsData={cuponsData} />;
};

export default AllCupons;