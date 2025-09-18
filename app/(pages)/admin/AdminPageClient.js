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
import Dashboard from './adminComponents/dashboard/Dashboard';
import AllProducts from './adminComponents/allProducts/AllProducts';
import AllUsers from './adminComponents/allUsers/AllUsers';
import OrderDetails from './adminComponents/orderDetails/OrderDetails';
import AllReviews from './adminComponents/allReviews/AllReviews';
import AllCupons from './adminComponents/allCupons/AllCupons';
import AllCategory from './adminComponents/allCategory/AllCategory';
import UserHistory from './adminComponents/userHistory/UserHistory';

const AdminPageClient = ({ adminData, navigationItems }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Icon mapping for client-side use
  const iconMap = {
    'dashboard': LayoutDashboard,
    'products': Package,
    'users': Users,
    'orders': ShoppingCart,
    'history': History,
    'reviews': Star,
    'categories': FolderOpen,
    'coupons': Ticket
  };

  // Component mapping for client-side use
  const componentMap = {
    'dashboard': Dashboard,
    'products': AllProducts,
    'users': AllUsers,
    'orders': OrderDetails,
    'history': UserHistory,
    'reviews': AllReviews,
    'categories': AllCategory,
    'coupons': AllCupons
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
            className="fixed lg:relative z-30 w-80 bg-gradient-to-b from-gray-900 to-black shadow-xl lg:shadow-lg h-screen overflow-y-auto"
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
                  {adminData.notifications.count}
                </span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{adminData.user.initials}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{adminData.user.name}</p>
                  <p className="text-xs text-gray-500">{adminData.user.role}</p>
                </div>
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
            <CurrentComponent />
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