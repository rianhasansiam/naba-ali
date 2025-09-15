import WishListPageClient from './WishListPageClient';

export const metadata = {
  title: 'My Wishlist - NABA ALI | Save Your Favorite Items',
  description: 'Keep track of your favorite products from NABA ALI. Manage your wishlist and add items to cart when ready to purchase.',
  keywords: 'wishlist, favorites, NABA ALI, save items, fashion, clothing',
};

// Generate wishlist data - In real app, this would come from a database or API
const generateWishlistData = () => {
  const categories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans', 'Sneakers', 'Dress', 'Jacket'];
  const styles = ['Casual', 'Formal', 'Party', 'Gym', 'Street'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Navy', 'Beige'];
  
  const wishlistItems = [];
  
  for (let i = 1; i <= 8; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const price = Math.floor(Math.random() * 200) + 50;
    const hasDiscount = Math.random() > 0.6;
    const originalPrice = hasDiscount ? Math.floor(price * 1.3) : null;
    
    wishlistItems.push({
      id: i,
      name: `${style} ${category}`,
      category: category,
      style: style,
      price: price,
      originalPrice: originalPrice,
      image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D`,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviews: Math.floor(Math.random() * 200) + 10,
      isNew: Math.random() > 0.8,
      isOnSale: hasDiscount,
      color: color,
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: Math.random() > 0.2,
      addedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      description: `High-quality ${category.toLowerCase()} perfect for ${style.toLowerCase()} occasions.`
    });
  }
  
  return wishlistItems;
};

export default function WishListPage() {
  const wishlistItems = generateWishlistData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <WishListPageClient wishlistItems={wishlistItems} />
      </div>
    </div>
  );
}
