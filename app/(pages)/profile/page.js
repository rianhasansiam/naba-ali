import ProfilePageClient from './ProfilePageClient';

// Server-side data and configuration
const getProfileData = () => {
  return {
    seoData: {
      title: "My Profile - NABA ALI | Account Management",
      description: "Manage your NABA ALI account, view order history, update personal information, and customize your fashion preferences.",
      keywords: "profile, account, user settings, order history, NABA ALI account management"
    },
    user: {
      id: "user_123456",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b169ad4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      memberSince: "2023-01-15",
      totalOrders: 12,
      totalSpent: 2450.00,
      loyaltyPoints: 245,
      membershipTier: "Gold"
    },
    navigation: [
      {
        id: "overview",
        label: "Overview",
        iconName: "User"
      },
      {
        id: "orders",
        label: "Order History",
        iconName: "Package"
      },
      {
        id: "addresses",
        label: "Addresses",
        iconName: "MapPin"
      },
      {
        id: "payments",
        label: "Payment Methods",
        iconName: "CreditCard"
      },
      {
        id: "settings",
        label: "Account Settings",
        iconName: "Settings"
      },
      {
        id: "notifications",
        label: "Notifications",
        iconName: "Bell"
      }
    ],
    orders: [
      {
        id: "ORD-2024-001",
        date: "2024-09-10",
        status: "delivered",
        total: 299.99,
        items: 3,
        trackingNumber: "NA123456789",
        items_detail: [
          {
            name: "Premium Cotton Dress",
            image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            price: 149.99,
            quantity: 1
          },
          {
            name: "Silk Scarf",
            image: "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            price: 79.99,
            quantity: 1
          },
          {
            name: "Leather Handbag",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            price: 70.01,
            quantity: 1
          }
        ]
      },
      {
        id: "ORD-2024-002",
        date: "2024-09-05",
        status: "shipped",
        total: 189.50,
        items: 2,
        trackingNumber: "NA987654321",
        items_detail: [
          {
            name: "Designer Blouse",
            image: "https://images.unsplash.com/photo-1564257577036-9a0b1b1c6e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            price: 119.99,
            quantity: 1
          },
          {
            name: "Statement Necklace",
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            price: 69.51,
            quantity: 1
          }
        ]
      },
      {
        id: "ORD-2024-003",
        date: "2024-08-28",
        status: "processing",
        total: 459.99,
        items: 4,
        trackingNumber: null,
        items_detail: [
          {
            name: "Evening Gown",
            image: "https://images.unsplash.com/photo-1566479179817-c0e6eaac7092?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            price: 299.99,
            quantity: 1
          },
          {
            name: "High Heels",
            image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            price: 160.00,
            quantity: 1
          }
        ]
      }
    ],
    addresses: [
      {
        id: "addr_1",
        type: "home",
        label: "Home",
        name: "Sarah Johnson",
        street: "123 Fashion Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        isDefault: true
      },
      {
        id: "addr_2",
        type: "work",
        label: "Office",
        name: "Sarah Johnson",
        street: "456 Business Avenue",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        country: "United States",
        isDefault: false
      }
    ],
    paymentMethods: [
      {
        id: "card_1",
        type: "credit",
        brand: "Visa",
        last4: "4242",
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true
      },
      {
        id: "card_2",
        type: "credit",
        brand: "Mastercard",
        last4: "8888",
        expiryMonth: 8,
        expiryYear: 2027,
        isDefault: false
      }
    ],
    preferences: {
      newsletter: true,
      orderUpdates: true,
      promotions: false,
      newArrivals: true,
      styleRecommendations: true,
      language: "en",
      currency: "USD",
      timezone: "America/New_York"
    },
    stats: [
      {
        label: "Total Orders",
        value: "12",
        iconName: "Package"
      },
      {
        label: "Total Spent",
        value: "$2,450",
        iconName: "DollarSign"
      },
      {
        label: "Loyalty Points",
        value: "245",
        iconName: "Star"
      },
      {
        label: "Member Since",
        value: "Jan 2023",
        iconName: "Calendar"
      }
    ]
  };
};

// Metadata for SEO (Server-side)
export async function generateMetadata() {
  const profileData = getProfileData();
  
  return {
    title: profileData.seoData.title,
    description: profileData.seoData.description,
    keywords: profileData.seoData.keywords,
    robots: 'noindex, nofollow', // Private page
    openGraph: {
      title: profileData.seoData.title,
      description: profileData.seoData.description,
      type: 'website'
    }
  };
}

export default function ProfilePage() {
  // Server-side data fetching
  const profileData = getProfileData();

  return (
    <main className="min-h-screen bg-gray-50">
      <ProfilePageClient profileData={profileData} />
    </main>
  );
}
