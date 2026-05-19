// app/page.js — Server Component
// ─────────────────────────────────────────────────────────────────────────────
// Single server-side data fetch → passes initialData to HomePageClient.
// generateMetadata reuses the SAME cached result (React cache() deduplication).
// No duplicate fetch; no all-or-nothing client spinner.

import StructuredData from './componets/StructuredData';
import HomePageClient from './HomePageClient';
import { getHomePageData } from '@/lib/data/home.data';

// ── SEO ───────────────────────────────────────────────────────────────────────
export async function generateMetadata() {
  try {
    const { stats, featuredProducts } = await getHomePageData();

    return {
      title: 'SkyZonee - Premium Fashion Store | Quality Clothing & Accessories',
      description: `Discover ${stats.totalProducts} premium fashion items across ${stats.activeCategories} categories. Shop quality clothing with ${stats.averageRating}-star average rating. Free shipping on orders over ৳10,000.`,
      keywords: 'fashion, clothing, premium fashion, accessories, online shopping, SkyZonee, trendy clothes',
      openGraph: {
        title: 'SkyZonee - Premium Fashion Store',
        description: `Discover ${stats.totalProducts} premium fashion items with ${stats.averageRating}-star quality rating.`,
        type: 'website',
        url: 'https://skyzonee.com',
        images: [
          {
            url: featuredProducts?.[0]?.primaryImage || '/hero.jpg',
            width: 1200,
            height: 630,
            alt: 'SkyZonee Premium Fashion Collection',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'SkyZonee - Premium Fashion Store',
        description: `Shop ${stats.totalProducts} premium fashion items`,
        images: [featuredProducts?.[0]?.primaryImage || '/hero.jpg'],
      },
    };
  } catch {
    return {
      title: 'SkyZonee - Premium Fashion Store | Quality Clothing & Accessories',
      description: 'Discover premium fashion and accessories at SkyZonee. Free shipping on orders over ৳10,000.',
    };
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
// 🚀 Server Component: fetches data once, renders immediately.
// HomePageClient receives initialData → React Query hydrates without extra fetch.
export default async function Home() {
  // getHomePageData() is deduped with generateMetadata() via React cache()
  const initialData = await getHomePageData();

  return (
    <>
      <StructuredData />
      {/*
        Pass server data as initialData.
        HomePageClient uses it to hydrate React Query without a loading spinner.
      */}
      <HomePageClient initialData={initialData} />
    </>
  );
}
