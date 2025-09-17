
// Home page - server component
import Hero from './componets/hero/Hero';
import Category from './componets/category/Category';
import FeaturedProducts from './componets/featuredProducts/FeaturedProducts';
import Review from './componets/review/Review';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Hero />
      <Category />
      <FeaturedProducts />
      <Review />
    </div>
  );
}
