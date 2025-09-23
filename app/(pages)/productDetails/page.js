'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductDetailsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dynamic product details route
    router.replace('/productDetails/1'); // Default to first product or handle appropriately
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-gray-600">Loading product details...</p>
      </div>
    </div>
  );
}