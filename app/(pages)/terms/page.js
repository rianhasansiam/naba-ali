import { Suspense } from 'react';
import TermsPageClient from './TermsPageClient';
import LoadingSpinner from '../../componets/loading/LoadingSpinner';

export const metadata = {
  title: 'Terms and Conditions | SkyZonee',
  description: 'Read our terms and conditions for shopping at SkyZonee. Learn about our policies, user agreements, and legal information.',
  keywords: 'terms and conditions, legal, policy, user agreement, SkyZonee',
};

export default function TermsPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-black text-center mb-8">
            <h1 className="text-6xl font-bold mb-4">SkyZonee</h1>
            <p className="text-xl mb-6">Loading Terms and Conditions...</p>
          </div>
          <LoadingSpinner size="lg" color="black" />
        </div>
      }
    >
      <TermsPageClient />
    </Suspense>
  );
}