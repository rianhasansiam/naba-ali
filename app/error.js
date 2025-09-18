'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Header with Logo */}
      <header className="w-full px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">NA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NABA ALI</h1>
              <p className="text-xs text-gray-600">Premium Fashion</p>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/allProducts" className="text-gray-700 hover:text-gray-900 transition-colors">
              Shop
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Visual */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-8xl md:text-9xl font-bold text-gray-200 select-none mb-4">
                ⚠️
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <span className="text-white text-4xl">💔</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Something Went Wrong
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We&apos;re experiencing a temporary hiccup in our fashion universe. 
              Our team is working to fix this issue. Please try again in a moment.
            </p>
            
            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
                <h3 className="text-red-800 font-semibold mb-2">Error Details (Development Mode):</h3>
                <pre className="text-sm text-red-700 overflow-auto">
                  {error.message || 'An unexpected error occurred'}
                </pre>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={reset}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="mr-2">🔄</span>
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-white text-gray-800 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="mr-2">🏠</span>
              Back to Home
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              What Can You Do?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Refresh the Page</h4>
                <p className="text-sm text-gray-600">Click &quot;Try Again&quot; to reload the page</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Continue Shopping</h4>
                <p className="text-sm text-gray-600">Browse our latest fashion collections</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
                <p className="text-sm text-gray-600">Get help from our customer service team</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/allProducts"
                  className="inline-flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="mr-2">🛍️</span>
                  Browse Products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="mr-2">📧</span>
                  Contact Us
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="mr-2">ℹ️</span>
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            Having trouble? <Link href="/contact" className="text-gray-900 hover:underline">Contact our support team</Link>
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <Link href="/about" className="hover:text-gray-700 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-gray-700 transition-colors">Contact</Link>
            <Link href="/allProducts" className="hover:text-gray-700 transition-colors">Shop</Link>
            <Link href="/profile" className="hover:text-gray-700 transition-colors">My Account</Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            © 2025 NABA ALI. Premium Fashion Store.
          </p>
        </div>
      </footer>
    </div>
  );
}