'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import SimpleProfilePageClient from './SimpleProfilePageClient';
import LoadingSpinner from '@/app/componets/loading/LoadingSpinner';

export default function SimpleProfilePageWrapper() {
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      signIn(); // Redirect to login
      return;
    }
  }, [session, status]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Show loading while redirecting
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <SimpleProfilePageClient />
    </main>
  );
}