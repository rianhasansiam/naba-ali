

import BreadcrumbShop from './filters/BreadcrumbShop';
import ProductsPageClient from './ProductsPageClient';

// Mock data - In real app, this would come from a database or API


export default function AllProductsPage() {

  return (
    <main className="pb-20 container mx-auto">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <ProductsPageClient />
      </div>
    </main>
  );
}
