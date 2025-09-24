'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingCart, User, Menu, ChevronDown, Heart, LogOut, Shield } from 'lucide-react';
import { useAppSelector } from '@/app/redux/reduxHooks';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarClient = ({ navItems, shopCategories }) => {
  // Get authentication data
  const { data: session, status } = useSession();
  
  // Get cart and wishlist counts from Redux store
  const cartTotalQuantity = useAppSelector((state) => state.user.cart.totalQuantity);
  const wishlistTotalItems = useAppSelector((state) => state.user.wishlist.totalItems);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.label === 'Admin') {
      // Only show admin link if user is logged in and has admin role
      return session?.user?.role?.toLowerCase() === 'admin';
    }
    return true;
  });

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    setIsUserDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl' : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <Image
                src="/logo1.png"
                alt="NABA ALI"
                width={50}
                height={50}
                className="rounded-lg"
                priority
              />
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
                  NABA ALI
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Premium Fashion</p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation - Use filtered items */}
          <nav className="hidden lg:flex items-center space-x-4">
            {filteredNavItems.map((item) => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <motion.button
                    onMouseEnter={() => setIsShopDropdownOpen(true)}
                    onMouseLeave={() => setIsShopDropdownOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors duration-300 ${
                      pathname.startsWith('/shop') 
                        ? 'text-black bg-gray-100 rounded-lg' 
                        : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={`flex items-center gap-2 px-4 py-2 font-medium cursor-pointer transition-colors duration-300 ${
                        pathname === item.href 
                          ? 'bg-gray-200 rounded-xl font' 
                          : 'text-gray-700 hover:text-black'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                )}

                {/* Shop Dropdown */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {isShopDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.96 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        onMouseEnter={() => setIsShopDropdownOpen(true)}
                        onMouseLeave={() => setIsShopDropdownOpen(false)}
                        className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-2xl shadow-2xl z-50"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop Categories</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {shopCategories.map((category) => (
                              <Link 
                                key={category.name} 
                                href={category.href}
                                className="group"
                              >
                                <motion.div 
                                  whileHover={{ scale: 1.02, backgroundColor: '#f3f4f6' }}
                                  className="p-3 rounded-xl border border-gray-100 transition-all duration-300"
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{category.icon}</span>
                                    <div>
                                      <h4 className="font-medium text-gray-800 group-hover:text-black transition-colors">
                                        {category.name}
                                      </h4>
                                      <p className="text-xs text-gray-500">{category.count} items</p>
                                    </div>
                                  </div>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Link href="/wishList">
              <motion.button whileHover={{ y: -2 }} className="relative p-3 hover:bg-gray-100 rounded-xl">
                <Heart className="w-5 h-5" />
                {wishlistTotalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistTotalItems}
                  </span>
                )}
              </motion.button>
            </Link>

            <Link href="/addToCart">
              <motion.button whileHover={{ y: -2 }} className="relative p-3 bg-black text-white rounded-xl">
                <ShoppingCart className="w-5 h-5" />
                {cartTotalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartTotalQuantity}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* User Section - Show avatar if logged in, otherwise show user icon */}
            <div className="relative group">
              {session?.user ? (
                // Logged in user - show avatar
                <motion.button 
                  whileHover={{ y: -2 }} 
                  className="relative p-1 hover:bg-gray-100 rounded-xl"
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium">
                      {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  {/* Admin badge */}
                  {session.user.role?.toLowerCase() === 'admin' && (
                    <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      <Shield className="w-2.5 h-2.5" />
                    </div>
                  )}
                </motion.button>
              ) : (
                // Not logged in - show user icon
                <motion.button whileHover={{ y: -2 }} className="p-3 hover:bg-gray-100 rounded-xl">
                  <User className="w-5 h-5" />
                </motion.button>
              )}
              
              {/* User Dropdown */}
              <AnimatePresence>
                {(isUserDropdownOpen || !session?.user) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-lg z-50"
                    onMouseEnter={() => setIsUserDropdownOpen(true)}
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="py-2">
                      {session?.user ? (
                        // Logged in user options
                        <>
                          <div className="px-4 py-2 border-b">
                            <p className="text-sm font-medium text-gray-900">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {session.user.email}
                            </p>
                            {session.user.role?.toLowerCase() === 'admin' && (
                              <p className="text-xs text-purple-600 font-medium mt-1 flex items-center">
                                <Shield className="w-3 h-3 mr-1" />
                                Administrator
                              </p>
                            )}
                          </div>
                          <Link href="/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            My Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </>
                      ) : (
                        // Not logged in options
                        <>
                          <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Sign In
                          </Link>
                          <Link href="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 hover:bg-gray-100 rounded-xl"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="lg:hidden border-t bg-white"
            >
              <nav className="py-6 space-y-2">
                {filteredNavItems.map((item, index) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={`px-6 py-4 rounded-xl transition-colors duration-300 ${
                      pathname === item.href || (item.hasDropdown && pathname.startsWith('/shop'))
                        ? 'bg-gray-100' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Link href={item.href}>
                      <div className="flex items-center space-x-3">
                        <span>{item.icon}</span>
                        <span className={`font-medium ${
                          pathname === item.href ? 'text-black' : 'text-gray-700'
                        }`}>{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile User Menu */}
                <div className="border-t pt-4 mt-4">
                  {session?.user ? (
                    // Logged in user - mobile
                    <>
                      <div className="px-6 py-4 bg-gray-50 rounded-xl mb-2">
                        <div className="flex items-center space-x-3">
                          {session.user.image ? (
                            <Image
                              src={session.user.image}
                              alt={session.user.name || 'User'}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium text-sm">
                              {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {session.user.email}
                            </p>
                            {session.user.role?.toLowerCase() === 'admin' && (
                              <p className="text-xs text-purple-600 font-medium flex items-center">
                                <Shield className="w-3 h-3 mr-1" />
                                Administrator
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Link href="/profile">
                        <motion.div 
                          initial={{ opacity: 0, x: -25 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                          className={`px-6 py-4 rounded-xl cursor-pointer transition-colors duration-300 ${
                            pathname === '/profile' ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5" />
                            <span className={`font-medium ${
                              pathname === '/profile' ? 'text-black' : 'text-gray-700'
                            }`}>My Profile</span>
                          </div>
                        </motion.div>
                      </Link>
                      
                      <motion.button
                        onClick={handleLogout}
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="w-full px-6 py-4 rounded-xl cursor-pointer transition-colors duration-300 hover:bg-red-50"
                      >
                        <div className="flex items-center space-x-3">
                          <LogOut className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-600">Logout</span>
                        </div>
                      </motion.button>
                    </>
                  ) : (
                    // Not logged in - mobile
                    <>
                      <Link href="/login">
                        <motion.div 
                          initial={{ opacity: 0, x: -25 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                          className={`px-6 py-4 rounded-xl cursor-pointer transition-colors duration-300 ${
                            pathname === '/login' ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span>🔑</span>
                            <span className={`font-medium ${
                              pathname === '/login' ? 'text-black' : 'text-gray-700'
                            }`}>Sign In</span>
                          </div>
                        </motion.div>
                      </Link>
                      
                      <Link href="/signup">
                        <motion.div 
                          initial={{ opacity: 0, x: -25 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.4 }}
                          className={`px-6 py-4 rounded-xl cursor-pointer transition-colors duration-300 ${
                            pathname === '/signup' ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span>📝</span>
                            <span className={`font-medium ${
                              pathname === '/signup' ? 'text-black' : 'text-gray-700'
                            }`}>Sign Up</span>
                          </div>
                        </motion.div>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default NavbarClient;