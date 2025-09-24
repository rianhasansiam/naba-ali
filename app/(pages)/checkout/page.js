import { Suspense } from 'react';
import CheckoutPageClient from './CheckoutPageClient';

export const metadata = {
  title: 'Checkout - Complete Your Order | Your Store',
  description: 'Review your order and complete your purchase securely. Fast checkout with multiple payment options.',
  keywords: 'checkout, payment, order, shopping cart, secure payment',
  openGraph: {
    title: 'Secure Checkout - Complete Your Order',
    description: 'Review your order details and complete your purchase with our secure checkout process.',
    type: 'website',
  },
};

// Loading component for checkout
const CheckoutLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutPageClient />
    </Suspense>
  );
}