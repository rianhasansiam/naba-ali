import AllUsersClient from './AllUsersClient';

// Server Component - Handles data fetching
const AllUsers = () => {
  // Server-side users data (could come from database/API)
  const usersData = {
    users: [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c605?w=100&h=100&fit=crop',
        status: 'VIP',
        totalSpent: 2450.00,
        totalOrders: 15,
        joinDate: '2024-01-15',
        lastOrder: '2025-09-15',
        location: 'New York, USA'
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        status: 'Premium',
        totalSpent: 1230.50,
        totalOrders: 8,
        joinDate: '2024-03-22',
        lastOrder: '2025-09-12',
        location: 'San Francisco, USA'
      },
      {
        id: 3,
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        status: 'Regular',
        totalSpent: 567.80,
        totalOrders: 4,
        joinDate: '2024-06-10',
        lastOrder: '2025-09-08',
        location: 'Los Angeles, USA'
      },
      {
        id: 4,
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        status: 'Premium',
        totalSpent: 1890.25,
        totalOrders: 12,
        joinDate: '2023-11-05',
        lastOrder: '2025-09-05',
        location: 'Chicago, USA'
      },
      {
        id: 5,
        name: 'Lisa Brown',
        email: 'lisa.brown@email.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        status: 'VIP',
        totalSpent: 3200.00,
        totalOrders: 22,
        joinDate: '2023-08-18',
        lastOrder: '2025-09-17',
        location: 'Miami, USA'
      }
    ],
    stats: {
      totalUsers: 845,
      vipUsers: 23,
      premiumUsers: 156,
      regularUsers: 666,
      newThisMonth: 12
    }
  };

  // Pass data to client component
  return <AllUsersClient usersData={usersData} />;
};

export default AllUsers;