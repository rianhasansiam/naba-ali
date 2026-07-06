import AdminPageClient from './AdminPageClient';
import AdminAuthWrapper from './components/AdminAuthWrapper';


// Metadata for SEO - Admin Panel
export const metadata = {
  title: "Admin Panel - SkyZonee | Manage Your Fashion Business",
  description: "Comprehensive admin dashboard for managing products, orders, customers, and analytics for SkyZonee premium fashion store.",
  keywords: "admin panel, dashboard, fashion management, inventory, orders, customers, analytics",
  robots: "noindex, nofollow", // Admin panel should not be indexed
  openGraph: {
    title: "Admin Panel - SkyZonee",
    description: "Business management dashboard for SkyZonee fashion store",
    type: "website",
  },
};

// Server Component - Handles data and SEO
export default function AdminPage() {
  // Server-side admin data (could come from database/API)
  const adminData = {
    brandInfo: {
      name: "SkyZonee",
      tagline: "Admin Panel",
      description: "Manage your premium fashion business"
    },
    user: {
      name: "Admin User",
      role: "Administrator",
      initials: "AU",
      email: "admin@nabaali.com"
    },
    notifications: {
      count: 3,
      items: [
        { id: 1, message: "New order received", type: "order", time: "2 min ago" },
        { id: 2, message: "Low stock alert", type: "inventory", time: "1 hour ago" },
        { id: 3, message: "Customer review pending", type: "review", time: "3 hours ago" }
      ]
    },
    businessStats: {
      totalRevenue: 124500,
      totalOrders: 1250,
      totalCustomers: 845,
      averageOrder: 99.6
    },
    systemStatus: {
      operational: true,
      lastUpdate: new Date().toISOString(),
      uptime: "99.9%"
    }
  };

  // Navigation metadata only; tab components are lazy-loaded in AdminPageClient.
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Overview & Analytics'
    },
    {
      id: 'products',
      name: 'All Products',
      description: 'Manage Products'
    },
    {
      id: 'users',
      name: 'All Users',
      description: 'Customer Management'
    },
    {
      id: 'orders',
      name: 'Order Details',
      description: 'Order Management'
    },
    {
      id: 'reviews',
      name: 'Reviews',
      description: 'Customer Reviews'
    },
    {
      id: 'categories',
      name: 'Categories',
      description: 'Product Categories'
    },
    {
      id: 'coupons',
      name: 'Coupons',
      description: 'Discount Coupons'
    },
    {
      id: 'shipping-tax',
      name: 'Shipping & Tax',
      description: 'Configure Shipping & Tax Settings'
    },
    {
      id: 'messages',
      name: 'Messages',
      description: 'Customer Messages'
    },
    // {
    //   id: 'chat',
    //   name: 'Live Chat',
    //   icon: MessageCircle,
    //   component: AdminChatPanel,
    //   description: 'Customer Support Chat'
    // },
    
  ];

  // Create serializable navigation data for client (without icons and components)
  const clientNavigationItems = navigationItems.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description
  }));

  // Pass server-side data to client component with authentication wrapper
  return (
    <AdminAuthWrapper>
      <AdminPageClient 
        adminData={adminData} 
        navigationItems={clientNavigationItems}
      />
    </AdminAuthWrapper>
  );
}
