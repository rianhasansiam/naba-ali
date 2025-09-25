'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../componets/loading/LoadingSpinner';
import OrderSummaryPageClient from './OrderSummaryPageClient';

export default function OrderSummaryPageWrapper() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get order data from URL params
    const orderDataParam = searchParams.get('orderData');
    
    if (orderDataParam) {
      try {
        const parsedOrderData = JSON.parse(decodeURIComponent(orderDataParam));
        setOrderData(parsedOrderData);
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600">The order information could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <OrderSummaryPageClient orderData={orderData} />
    </main>
  );
}