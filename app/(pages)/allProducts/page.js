import BreadcrumbShop from './filters/BreadcrumbShop';
import ProductsPageClient from './ProductsPageClient';

// Mock data - In real app, this would come from a database or API
const generateMockProducts = () => {
  const categories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'];
  const styles = ['Casual', 'Formal', 'Party', 'Gym'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray'];
  
  const products = [];
  
  for (let i = 1; i <= 50; i++) {
    products.push({
      id: i,
      name: `Product ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      style: styles[Math.floor(Math.random() * styles.length)],
      price: Math.floor(Math.random() * 200) + 50,
      originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 250 : null,
      image: `https://images.unsplash.com/photo-${1523275335684 + i}?w=400&h=400&fit=crop&auto=format`,
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
      reviews: Math.floor(Math.random() * 200) + 10,
      isNew: Math.random() > 0.8,
      isOnSale: Math.random() > 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
      sizes: ['S', 'M', 'L', 'XL'],
      description: `This is a high-quality ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()} perfect for ${styles[Math.floor(Math.random() * styles.length)].toLowerCase()} wear.`
    });
  }
  
  return products;
};

export default function AllProductsPage() {
  // In a real app, you'd fetch this data from an API or database
  const products = generateMockProducts();

  return (
    <main className="pb-20 container mx-auto">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <ProductsPageClient allProducts={products} />
      </div>
    </main>
  );
}
