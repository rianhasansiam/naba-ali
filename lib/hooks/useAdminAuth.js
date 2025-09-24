// lib/hooks/useAdminAuth.js
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAdminAuth = (redirectTo = '/login') => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      // Still checking session
      return;
    }

    if (status === 'unauthenticated') {
      // Not logged in - redirect to login
      router.replace(redirectTo);
      return;
    }

    if (session?.user) {
      // Check if user has admin role
      const userRole = session.user.role?.toLowerCase();
      
      if (userRole === 'admin') {
        setIsAuthorized(true);
        setIsLoading(false);
      } else {
        // User is logged in but not admin - redirect to unauthorized page
        router.replace('/unauthorized');
        return;
      }
    }

    setIsLoading(false);
  }, [session, status, router, redirectTo]);

  return {
    isAuthorized,
    isLoading,
    user: session?.user,
    session
  };
};