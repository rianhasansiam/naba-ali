'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldX, ArrowLeft, User, Lock } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access the admin panel.
          </p>
          
          {session?.user && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-2">
                <User className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">
                  Current Role: {session.user.role || 'User'}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <Lock className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm text-red-700">
                  Required Role: Admin
                </span>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            Contact your system administrator if you believe this is an error.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Return to Homepage
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            If you need admin access, please contact the system administrator with your email: {session?.user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}