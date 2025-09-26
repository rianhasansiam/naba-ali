// app/(pages)/admin/components/AdminAuthWrapper.js
'use client';

import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { Shield } from 'lucide-react';
import LoadingSpinner from '../../../componets/loading/LoadingSpinner';

const AdminLoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="mb-4">
        <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <div className="flex justify-center">
          <LoadingSpinner size="md" color="text-gray-600" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Verifying Admin Access
      </h2>
      <p className="text-gray-600 text-sm">
        Please wait while we check your permissions...
      </p>
    </div>
  </div>
);

export default function AdminAuthWrapper({ children }) {
  const { isAuthorized, isLoading, user } = useAdminAuth();

  if (isLoading) {
    return <AdminLoadingScreen />;
  }

  if (!isAuthorized) {
    // This component will not render if not authorized, 
    // as useAdminAuth handles redirects
    return null;
  }

  // User is authorized - render admin content
  return (
    <>
      {/* Admin Header with user info */}
      <div className="bg-gray-600 text-white px-6 py-2 text-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <span>Admin Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.name}</span>
            <span className="bg-black px-2 py-1 rounded text-xs">
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}