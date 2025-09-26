'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetData } from '../../../lib/hooks/useGetData';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Star, 
  Ticket, 
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Shield
} from 'lucide-react';

// Import admin components directly (no wrapper layers)
import Dashboard from './adminComponents/dashboard/Dashboard';
import AllProductsClient from './adminComponents/allProducts/AllProductsClient';
import AllUsersClient from './adminComponents/allUsers/AllUsersClient';
import OrderDetails from './adminComponents/orderDetails/OrderDetails';
import AllReviews from './adminComponents/allReviews/AllReviews';
import AllCuponsClient from './adminComponents/allCupons/AllCuponsClient';
import AllCategoryClient from './adminComponents/allCategory/AllCategoryClient';
import ShippingTaxSettings from './adminComponents/shippingTax/ShippingTaxSettings';


const AdminPageClient = ({ adminData, navigationItems }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Centralized data fetching for all admin components
  const { data: products = [], isLoading: productsLoading } = useGetData({ name: 'products', api: '/api/products' });
  const { data: users = [], isLoading: usersLoading } = useGetData({ name: 'users', api: '/api/users' });
  const { data: orders = [], isLoading: ordersLoading } = useGetData({ name: 'orders', api: '/api/orders' });
  const { data: reviews = [], isLoading: reviewsLoading } = useGetData({ name: 'reviews', api: '/api/reviews' });
  
  // Shared loading state
  const isLoading = productsLoading || usersLoading || ordersLoading || reviewsLoading;
  
  // Shared data object to pass to components
  const sharedData = {
    products,
    users, 
    orders,
    reviews,
    isLoading
  };

  // Icon mapping for client-side use
  const iconMap = {
    'dashboard': LayoutDashboard,
    'products': Package,
    'users': Users,
    'orders': ShoppingCart,
    'reviews': Star,
    'categories': FolderOpen,
    'coupons': Ticket,
    'shipping-tax': Settings,
  };

  // Component mapping for client-side use (direct client components)
  const componentMap = {
    'dashboard': Dashboard,
    'products': AllProductsClient,
    'users': AllUsersClient,
    'orders': OrderDetails,
    'reviews': AllReviews,
    'categories': AllCategoryClient,
    'coupons': AllCuponsClient,
    'shipping-tax': ShippingTaxSettings,
  };

  const currentComponent = componentMap[activeTab] || Dashboard;
  const CurrentComponent = currentComponent;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed lg:relative z-30 w-80 bg-gradient-to-b from-gray-900 to-black shadow-xl lg:shadow-lg h-screen overflow-y-auto "
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">NA</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{adminData.brandInfo.name}</h1>
                    <p className="text-sm text-gray-300">{adminData.brandInfo.tagline}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = iconMap[item.id] || LayoutDashboard;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(window.innerWidth >= 1024);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={20} />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-xs ${activeTab === item.id ? 'text-gray-300' : 'text-gray-400'}`}>
                        {item.description}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </nav>

           
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
                </h1>
                <p className="text-gray-600">
                  {navigationItems.find(item => item.id === activeTab)?.description || 'Overview & Analytics'}
                </p>
              </div>
            </div>

          
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <CurrentComponent {...sharedData} />
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPageClient;