import UserHistoryClient from './UserHistoryClient';

// Server Component - Handles data fetching
const UserHistory = () => {
  // Server-side user history data (could come from database/API)
  const userHistoryData = {
    // Demo data would be populated here from database
    customers: [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c605?w=100&h=100&fit=crop',
        status: 'vip',
        totalSpent: 2450.00,
        totalOrders: 15,
        averageOrder: 163.33,
        joinDate: '2024-01-15',
        lastOrder: '2025-09-15',
        location: 'New York, USA',
        orderHistory: [
          {
            id: '#3210',
            date: '2025-09-15',
            total: 156.90,
            status: 'delivered',
            products: [
              { name: 'Premium Cotton T-Shirt', quantity: 2, price: 49.99 },
              { name: 'Designer Jeans', quantity: 1, price: 129.99 }
            ]
          }
        ],
        wishlist: ['Premium Leather Jacket', 'Designer Sneakers'],
        preferences: ['T-Shirts', 'Jeans', 'Dresses']
      }
      // More customers would be added here
    ]
  };

  return <UserHistoryClient userHistoryData={userHistoryData} />;
};

export default UserHistory;