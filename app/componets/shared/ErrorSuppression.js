'use client';

import { useEffect } from 'react';
import { suppressMediaCSPErrors } from '@/lib/utils/errorHandlers';

export default function ErrorSuppression() {
  useEffect(() => {
    // Initialize error suppression
    const cleanup = suppressMediaCSPErrors();
    
    return cleanup; // Cleanup on unmount
  }, []);

  // This component renders nothing
  return null;
}