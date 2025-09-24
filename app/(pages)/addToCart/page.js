import AddToCartPageClient from './AddToCartPageClient';

// Metadata for SEO (Server-side)
export async function generateMetadata() {
  return {
    title: "Shopping Cart - NABA ALI | Premium Fashion",
    description: "Review your selected premium fashion items, adjust quantities, and proceed to secure checkout at NABA ALI.",
    keywords: "shopping cart, fashion checkout, NABA ALI cart, premium clothing cart",
    openGraph: {
      title: "Shopping Cart - NABA ALI | Premium Fashion",
      description: "Review your selected premium fashion items, adjust quantities, and proceed to secure checkout at NABA ALI.",
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: "Shopping Cart - NABA ALI | Premium Fashion",
      description: "Review your selected premium fashion items, adjust quantities, and proceed to secure checkout at NABA ALI."
    }
  };
}

export default function AddToCartPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <AddToCartPageClient />
    </main>
  );
}
