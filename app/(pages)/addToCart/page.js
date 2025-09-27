import AddToCartPageWrapper from './AddToCartPageWrapper';

// Metadata for SEO (Server-side)
export async function generateMetadata() {
  return {
    title: "Shopping Cart - SkyZonee | Premium Fashion",
    description: "Review your selected premium fashion items, adjust quantities, and proceed to secure checkout at SkyZonee.",
    keywords: "shopping cart, fashion checkout, SkyZonee cart, premium clothing cart",
    openGraph: {
      title: "Shopping Cart - SkyZonee | Premium Fashion",
      description: "Review your selected premium fashion items, adjust quantities, and proceed to secure checkout at SkyZonee.",
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: "Shopping Cart - SkyZonee | Premium Fashion",
      description: "Review your selected premium fashion items, adjust quantities, and proceed to secure checkout at SkyZonee."
    }
  };
}

export default function AddToCartPage() {
  return <AddToCartPageWrapper />;
}
