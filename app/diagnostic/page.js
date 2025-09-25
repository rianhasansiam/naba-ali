'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useGetData } from '@/lib/hooks/useGetData';
import LoadingSpinner from '../componets/loading/LoadingSpinner';

export default function DataFetchDiagnostic() {
  const { data: session, status: sessionStatus } = useSession();

  // Test all the main data endpoints
  const { data: productsData, isLoading: productsLoading, error: productsError } = useGetData({
    name: 'products-test',
    api: '/api/products',
    cacheType: 'DYNAMIC'
  });

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useGetData({
    name: 'categories-test',
    api: '/api/categories',
    cacheType: 'STATIC'
  });

  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useGetData({
    name: 'reviews-test',
    api: '/api/reviews',
    cacheType: 'DYNAMIC'
  });

  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetData({
    name: 'users-test',
    api: '/api/users',
    cacheType: 'DYNAMIC'
  });

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">TanStack Query Diagnostic</h1>
      
      {/* Session Info */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Authentication Status</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p><strong>Session Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                sessionStatus === 'authenticated' ? 'bg-green-100 text-green-800' :
                sessionStatus === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {sessionStatus}
              </span>
            </p>
            <p><strong>User ID:</strong> {session?.user?.id || 'N/A'}</p>
            <p><strong>Email:</strong> {session?.user?.email || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Role:</strong> {session?.user?.role || 'N/A'}</p>
            <p><strong>Provider:</strong> {session?.user?.provider || 'N/A'}</p>
            <p><strong>Name:</strong> {session?.user?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Data Fetching Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Products */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            Products API
            {productsLoading && (
              <span className="ml-2 text-blue-500 text-sm flex items-center">
                <LoadingSpinner size="sm" className="mr-1" />
                Loading...
              </span>
            )}
            {productsError && <span className="ml-2 text-red-500 text-sm">(Error)</span>}
            {!productsLoading && !productsError && <span className="ml-2 text-green-500 text-sm">(✓)</span>}
          </h3>
          
          {productsError && (
            <div className="mb-3 p-3 bg-red-100 text-red-700 rounded text-sm">
              <strong>Error:</strong> {productsError.message}
            </div>
          )}
          
          <div className="text-sm space-y-1">
            <p><strong>Loading:</strong> {productsLoading ? 'Yes' : 'No'}</p>
            <p><strong>Data Type:</strong> {Array.isArray(productsData) ? 'Array' : typeof productsData}</p>
            <p><strong>Count:</strong> {Array.isArray(productsData) ? productsData.length : 'N/A'}</p>
            <p><strong>First Item:</strong> {productsData?.[0]?.name || productsData?.[0]?.title || 'N/A'}</p>
          </div>
        </div>

        {/* Categories */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            Categories API
            {categoriesLoading && (
              <span className="ml-2 text-blue-500 text-sm flex items-center">
                <LoadingSpinner size="sm" className="mr-1" />
                Loading...
              </span>
            )}
            {categoriesError && <span className="ml-2 text-red-500 text-sm">(Error)</span>}
            {!categoriesLoading && !categoriesError && <span className="ml-2 text-green-500 text-sm">(✓)</span>}
          </h3>
          
          {categoriesError && (
            <div className="mb-3 p-3 bg-red-100 text-red-700 rounded text-sm">
              <strong>Error:</strong> {categoriesError.message}
            </div>
          )}
          
          <div className="text-sm space-y-1">
            <p><strong>Loading:</strong> {categoriesLoading ? 'Yes' : 'No'}</p>
            <p><strong>Data Type:</strong> {Array.isArray(categoriesData) ? 'Array' : typeof categoriesData}</p>
            <p><strong>Count:</strong> {Array.isArray(categoriesData) ? categoriesData.length : 'N/A'}</p>
            <p><strong>First Item:</strong> {categoriesData?.[0]?.name || 'N/A'}</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            Reviews API
            {reviewsLoading && (
              <span className="ml-2 text-blue-500 text-sm flex items-center">
                <LoadingSpinner size="sm" className="mr-1" />
                Loading...
              </span>
            )}
            {reviewsError && <span className="ml-2 text-red-500 text-sm">(Error)</span>}
            {!reviewsLoading && !reviewsError && <span className="ml-2 text-green-500 text-sm">(✓)</span>}
          </h3>
          
          {reviewsError && (
            <div className="mb-3 p-3 bg-red-100 text-red-700 rounded text-sm">
              <strong>Error:</strong> {reviewsError.message}
            </div>
          )}
          
          <div className="text-sm space-y-1">
            <p><strong>Loading:</strong> {reviewsLoading ? 'Yes' : 'No'}</p>
            <p><strong>Data Type:</strong> {Array.isArray(reviewsData) ? 'Array' : typeof reviewsData}</p>
            <p><strong>Count:</strong> {Array.isArray(reviewsData) ? reviewsData.length : 'N/A'}</p>
            <p><strong>First Item:</strong> {reviewsData?.[0]?.comment || reviewsData?.[0]?.title || 'N/A'}</p>
          </div>
        </div>

        {/* Users */}
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            Users API
            {usersLoading && (
              <span className="ml-2 text-blue-500 text-sm flex items-center">
                <LoadingSpinner size="sm" className="mr-1" />
                Loading...
              </span>
            )}
            {usersError && <span className="ml-2 text-red-500 text-sm">(Error)</span>}
            {!usersLoading && !usersError && <span className="ml-2 text-green-500 text-sm">(✓)</span>}
          </h3>
          
          {usersError && (
            <div className="mb-3 p-3 bg-red-100 text-red-700 rounded text-sm">
              <strong>Error:</strong> {usersError.message}
            </div>
          )}
          
          <div className="text-sm space-y-1">
            <p><strong>Loading:</strong> {usersLoading ? 'Yes' : 'No'}</p>
            <p><strong>Data Type:</strong> {Array.isArray(usersData) ? 'Array' : typeof usersData}</p>
            <p><strong>Count:</strong> {Array.isArray(usersData) ? usersData.length : 'N/A'}</p>
            <p><strong>First User:</strong> {usersData?.[0]?.name || usersData?.[0]?.email || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Raw Data Preview */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Raw Data Sample (First Item Each)</h3>
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-medium mb-2">Products[0]:</h4>
            <pre className="bg-white p-3 rounded overflow-auto max-h-32">
              {JSON.stringify(productsData?.[0], null, 2) || 'No data'}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Categories[0]:</h4>
            <pre className="bg-white p-3 rounded overflow-auto max-h-32">
              {JSON.stringify(categoriesData?.[0], null, 2) || 'No data'}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Reviews[0]:</h4>
            <pre className="bg-white p-3 rounded overflow-auto max-h-32">
              {JSON.stringify(reviewsData?.[0], null, 2) || 'No data'}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Users[0]:</h4>
            <pre className="bg-white p-3 rounded overflow-auto max-h-32">
              {JSON.stringify(usersData?.[0], null, 2) || 'No data'}
            </pre>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-4">
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          ← Back to Home
        </Link>
        <Link href="/test-auth" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Authentication Test →
        </Link>
      </div>
    </div>
  );
}