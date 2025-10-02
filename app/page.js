
// Home page - 🚀 NEXT.JS 15 Optimized Server Component
import { Suspense } from 'react'
import StructuredData from './componets/StructuredData';
import HomePageClient from './HomePageClient';
import { getHomePageData } from '@/lib/data/serverDataFetchers'
import GlobalLoadingPage from './componets/loading/GlobalLoadingPage'

// 🚀 NEXT.JS 15: Enhanced SEO with dynamic data
export async function generateMetadata() {
  try {
    const homeData = await getHomePageData()
    
    return {
      title: "SkyZonee - Premium Fashion Store | Quality Clothing & Accessories",
      description: `Discover ${homeData.stats.totalProducts} premium fashion items across ${homeData.stats.totalCategories} categories. Shop quality clothing with ${homeData.stats.averageRating.toFixed(1)}-star average rating. Free shipping on orders over ৳10,000.`,
      keywords: "fashion, clothing, premium fashion, accessories, online shopping, SkyZonee, trendy clothes",
      openGraph: {
        title: "SkyZonee - Premium Fashion Store",
        description: `Discover ${homeData.stats.totalProducts} premium fashion items with ${homeData.stats.averageRating.toFixed(1)}-star quality rating.`,
        type: "website",
        url: "https://nabaali.com",
        images: [
          {
            url: homeData.featuredProducts?.[0]?.primaryImage || "/hero.jpg",
            width: 1200,
            height: 630,
            alt: "SkyZonee Premium Fashion Collection"
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: "SkyZonee - Premium Fashion Store",
        description: `Shop ${homeData.stats.totalProducts} premium fashion items`,
        images: [homeData.featuredProducts?.[0]?.primaryImage || "/hero.jpg"]
      }
    }
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "SkyZonee - Premium Fashion Store | Quality Clothing & Accessories",
      description: "Discover premium fashion and accessories at SkyZonee. Shop quality clothing, trendy styles, and exclusive collections. Free shipping on orders over ৳10,000.",
      keywords: "fashion, clothing, premium fashion, accessories, online shopping, SkyZonee, trendy clothes",
      openGraph: {
        title: "SkyZonee - Premium Fashion Store",
        description: "Discover premium fashion and accessories at SkyZonee. Quality clothing and style for everyone.",
        type: "website",
        url: "https://nabaali.com",
        images: [
          {
            url: "/hero.jpg",
            width: 1200,
            height: 630,
            alt: "SkyZonee Premium Fashion Collection"
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: "SkyZonee - Premium Fashion Store",
        description: "Discover premium fashion and accessories at SkyZonee.",
        images: ["/hero.jpg"]
      }
    }
  }
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <Suspense fallback={
        <GlobalLoadingPage 
          message="Loading premium collection..." 
          showLogo={true}
        />
      }>
        {/* 🚀 OPTIMIZED: Client component with enhanced data handling */}
        <HomePageClient />
      </Suspense>
    </>
  );
}
