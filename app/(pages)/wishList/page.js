import WishListPageClient from './WishListPageClient';

export const metadata = {
  title: 'My Wishlist - SkyZonee | Save Your Favorite Items',
  description: 'Keep track of your favorite products from SkyZonee. Manage your wishlist and add items to cart when ready to purchase.',
  keywords: 'wishlist, favorites, SkyZonee, save items, fashion, clothing',
};

export default function WishListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 xl:px-0 max-w-frame">
        <WishListPageClient />
      </div>
    </div>
  );
}
