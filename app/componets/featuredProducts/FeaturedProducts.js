import FeaturedProductsClient from './FeaturedProductsClient';

// Mock featured products data - In real app, this would come from a database or API
const generateFeaturedProducts = () => {
  const categories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans', 'Sneakers', 'Dress', 'Jacket'];
  const styles = ['Casual', 'Formal', 'Party', 'Gym', 'Street'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Navy', 'Beige'];
  
  const products = [];
  
  for (let i = 1; i <= 4; i++) {
    products.push({
          id: i,
      name: `Product ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      style: styles[Math.floor(Math.random() * styles.length)],
      price: Math.floor(Math.random() * 200) + 50,
      originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 250 : null,
      image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D`,
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

export default function FeaturedProducts() {
  const featuredProducts = generateFeaturedProducts();

  return (
    <section className="pt-10 bg-white">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <FeaturedProductsClient products={featuredProducts} />
      </div>
    </section>
  );
}
