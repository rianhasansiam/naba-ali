'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Star, 
  Ticket, 
  FolderOpen,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';

// Import admin components
import Dashboard from './adminComponents/Dashboard';
import AllProducts from './adminComponents/AllProducts';
import AllUsers from './adminComponents/AllUsers';
import OrderDetails from './adminComponents/OrderDetails';
import AllReviews from './adminComponents/AllReviews';
import AllCupons from './adminComponents/AllCupons';
import AllCategory from './adminComponents/AllCategory';
import UserHistory from './adminComponents/UserHistory';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Navigation items
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
      id: 'orders',
      name: 'Orders',
      icon: ShoppingCart,
      component: OrderDetails,
      description: 'Order Management'
    },
    {
      id: 'customers',
      name: 'Customers',
      icon: Users,
      component: AllUsers,
      description: 'Customer Management'
    },
    {
      id: 'userhistory',
      name: 'User History',
      icon: History,
      component: UserHistory,
      description: 'Customer Purchase History'
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
    }
  ];

  const currentComponent = navigationItems.find(item => item.id === activeTab)?.component || Dashboard;
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
            className="fixed lg:relative z-30 w-80 bg-gradient-to-b from-gray-900 to-black shadow-xl  lg:shadow-lg overflow-y-auto"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">NA</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">NABA ALI</h1>
                    <p className="text-sm text-gray-300">Admin Panel</p>
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
                const Icon = item.icon;
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

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-gray-800 rounded-xl transition-colors">
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
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

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">NABA ALI</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 bg-gray-50">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <CurrentComponent />
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPage;
