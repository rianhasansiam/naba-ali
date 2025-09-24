import AdminPageClient from './AdminPageClient';
import AdminAuthWrapper from './components/AdminAuthWrapper';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Star, 
  Ticket, 
  FolderOpen,
  History,
  Shield
} from 'lucide-react';

// Import admin components
import Dashboard from './adminComponents/dashboard/Dashboard';
import AllProducts from './adminComponents/allProducts/AllProducts';
import AllUsers from './adminComponents/allUsers/AllUsers';
import OrderDetails from './adminComponents/orderDetails/OrderDetails';
import AllReviews from './adminComponents/allReviews/AllReviews';
import AllCupons from './adminComponents/allCupons/AllCupons';
import AllCategory from './adminComponents/allCategory/AllCategory';
import RoleManagement from './adminComponents/roleManagement/RoleManagement';


// Metadata for SEO - Admin Panel
export const metadata = {
  title: "Admin Panel - NABA ALI | Manage Your Fashion Business",
  description: "Comprehensive admin dashboard for managing products, orders, customers, and analytics for NABA ALI premium fashion store.",
  keywords: "admin panel, dashboard, fashion management, inventory, orders, customers, analytics",
  robots: "noindex, nofollow", // Admin panel should not be indexed
  openGraph: {
    title: "Admin Panel - NABA ALI",
    description: "Business management dashboard for NABA ALI fashion store",
    type: "website",
  },
};

// Server Component - Handles data and SEO
export default function AdminPage() {
  // Server-side admin data (could come from database/API)
  const adminData = {
    brandInfo: {
      name: "NABA ALI",
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

  // Navigation items with components (server-side configuration)
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      component: Dashboard,
      description: 'Overview & Analytics'
    },
    {
      id: 'products',
      name: 'All Products',
      icon: Package,
      component: AllProducts,
      description: 'Manage Products'
    },
    {
      id: 'users',
      name: 'All Users',
      icon: Users,
      component: AllUsers,
      description: 'Customer Management'
    },
    {
      id: 'orders',
      name: 'Order Details',
      icon: ShoppingCart,
      component: OrderDetails,
      description: 'Order Management'
    },
    {
      id: 'reviews',
      name: 'Reviews',
      icon: Star,
      component: AllReviews,
      description: 'Customer Reviews'
    },
    {
      id: 'categories',
      name: 'Categories',
      icon: FolderOpen,
      component: AllCategory,
      description: 'Product Categories'
    },
    {
      id: 'coupons',
      name: 'Coupons',
      icon: Ticket,
      component: AllCupons,
      description: 'Discount Coupons'
    },
    {
      id: 'roles',
      name: 'Role Management',
      icon: Shield,
      component: RoleManagement,
      description: 'Manage User Roles'
    }
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