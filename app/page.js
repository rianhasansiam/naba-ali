

import Cards from './componets/cards/Cards';
import Hero from './componets/hero/Hero';
import Navbar from './componets/navbar/Navbar';
import FeaturedProducts from './componets/featuredProducts/FeaturedProducts';
import Category from './componets/category/Category';
import Review from './componets/review/Review';

export default function Home() {


const products = [
  {
    id: 1,
    name: "Premium Sneakers",
    category: "Footwear",
    price: 299,
    originalPrice: 399,
    image: "/product1.jpg",
    rating: 4.5,
    reviews: 127,
    isNew: true,
    isOnSale: true
  }
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Hero />
      <Category />
      <FeaturedProducts />
      <Review />
    </div>
  );
}
