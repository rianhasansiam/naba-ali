'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingCart, User, Menu, ChevronDown, Heart } from 'lucide-react';
import { useAppSelector } from '@/app/redux/reduxHooks';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from './actions';

const NavbarClient = ({ navItems, shopCategories }) => {
  // Get cart and wishlist counts from Redux store
  const cartTotalQuantity = useAppSelector((state) => state.user.cart.totalQuantity);
  const wishlistTotalItems = useAppSelector((state) => state.user.wishlist.totalItems);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300  ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl' : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3 cursor-pointer">
              <div className="w-16 h-14 rounded-xl flex items-center justify-center">
                <Image src="/logo.png" alt="NABA ALI Logo" width={100} height={100} className="w-[95%] h-[90%]" />
              </div>
              <div className='flex flex-col'>
                <h1 className="text-2xl font-bold">NABA ALI</h1>
                <span className="text-gray-500 text-sm">Premium Fashion</span>
              </div>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <motion.button
                    onMouseEnter={() => setIsShopDropdownOpen(true)}
                    onMouseLeave={() => setIsShopDropdownOpen(false)}
                    whileHover={{ y: -2 }}
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

                {/* Smooth Dropdown */}
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
                        className="absolute top-full left-0 mt-3 w-[50vw] bg-white border rounded-2xl shadow-2xl"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-bold mb-4">Shop Categories</h3>
                          <div className="grid grid-cols-3 gap-3">
                            {shopCategories.map((category, index) => (
                              <Link key={category.title || `category-${index}`} href={category.href}>
                                <motion.div
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.08, duration: 0.4 }}
                                  whileHover={{ y: -4, scale: 1.02 }}
                                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 group cursor-pointer"
                                >
                                  <div className="flex items-start space-x-3">
                                    <span className="text-2xl">{category.icon}</span>
                                    <div>
                                      <h4 className="font-semibold">{category.title}</h4>
                                      <p className="text-sm text-gray-600">{category.description}</p>
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

          {/* Search */}
          <div className="hidden md:flex flex-1 min-w-0 mx-4">
            <div className="relative w-full">
              <div className="bg-white border rounded-2xl shadow-lg overflow-hidden">
                <div className="flex items-center px-4 py-2">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 ml-4 outline-none min-w-0"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
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

            <div className="relative group">
              <motion.button whileHover={{ y: -2 }} className="p-3 hover:bg-gray-100 rounded-xl">
                <User className="w-5 h-5" />
              </motion.button>
              
              {/* User Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign In
                  </Link>
                  <Link href="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign Up
                  </Link>
                  <hr className="my-2" />
                  <form action={signOutAction}>
                    <button type="submit" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <motion.button
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
                {navItems.map((item, index) => (
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
                      <div className="flex items-center space-x-3 cursor-pointer">
                        <span>{item.icon}</span>
                        <span className={`font-medium ${
                          pathname === item.href || (item.hasDropdown && pathname.startsWith('/shop'))
                            ? 'text-black' 
                            : 'text-gray-700'
                        }`}>{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile User Menu */}
                <div className="border-t pt-4 mt-4">
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
                  
                  <Link href="/login">
                    <motion.div 
                      initial={{ opacity: 0, x: -25 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
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
                      transition={{ delay: 0.6, duration: 0.4 }}
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
