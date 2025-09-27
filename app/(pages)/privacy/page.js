import { Suspense } from 'react';
import PrivacyPageClient from './PrivacyPageClient';
import LoadingSpinner from '../../componets/loading/LoadingSpinner';

export const metadata = {
  title: 'Privacy Policy | SkyZonee',
  description: 'Read our privacy policy to understand how SkyZonee collects, uses, and protects your personal information when you shop with us.',
  keywords: 'privacy policy, data protection, personal information, cookies, SkyZonee, security',
};

export default function PrivacyPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-black text-center mb-8">
            <h1 className="text-6xl font-bold mb-4">SkyZonee</h1>
            <p className="text-xl mb-6">Loading Privacy Policy...</p>
          </div>
          <LoadingSpinner size="lg" color="black" />
        </div>
      }
    >
      <PrivacyPageClient />
    </Suspense>
  );
}