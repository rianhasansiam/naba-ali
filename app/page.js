
// Home page - server component
import Hero from './componets/hero/Hero';
import Category from './componets/category/Category';
import FeaturedProducts from './componets/featuredProducts/FeaturedProducts';
import Review from './componets/review/Review';
import StructuredData from './componets/StructuredData';

// SEO Metadata for Homepage
export const metadata = {
  title: "NABA ALI - Premium Fashion Store | Quality Clothing & Accessories",
  description: "Discover premium fashion and accessories at NABA ALI. Shop quality clothing, trendy styles, and exclusive collections. Free shipping on orders over $100.",
  keywords: "fashion, clothing, premium fashion, accessories, online shopping, NABA ALI, trendy clothes",
  openGraph: {
    title: "NABA ALI - Premium Fashion Store",
    description: "Discover premium fashion and accessories at NABA ALI. Quality clothing and style for everyone.",
    type: "website",
    url: "https://nabaali.com",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "NABA ALI Premium Fashion Collection"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "NABA ALI - Premium Fashion Store",
    description: "Discover premium fashion and accessories at NABA ALI.",
    images: ["/hero.jpg"]
  }
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Hero />
        <Category />
        <FeaturedProducts />
        <Review />
      </div>
    </>
  );
}
