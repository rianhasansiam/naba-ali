import AllProductsClient from './AllProductsClient';

// Server Component - Handles data fetching
const AllProducts = () => {
  // Server-side products data (could come from database/API)
  const productsData = {
    products: [
      {
        id: 1,
        name: 'Premium Cotton T-Shirt',
        category: 'T-Shirts',
        price: 49.99,
        originalPrice: 59.99,
        stock: 145,
        sold: 234,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
        status: 'active',
        createdAt: '2025-09-15',
        description: 'High-quality cotton t-shirt with modern fit'
      },
      {
        id: 2,
        name: 'Designer Jeans',
        category: 'Jeans',
        price: 129.99,
        originalPrice: 149.99,
        stock: 89,
        sold: 156,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
        status: 'active',
        createdAt: '2025-09-12',
        description: 'Stylish designer jeans with perfect fit'
      },
      {
        id: 3,
        name: 'Casual Sneakers',
        category: 'Shoes',
        price: 89.99,
        originalPrice: 99.99,
        stock: 67,
        sold: 203,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
        status: 'active',
        createdAt: '2025-09-10',
        description: 'Comfortable casual sneakers for everyday wear'
      },
      {
        id: 4,
        name: 'Summer Dress',
        category: 'Dresses',
        price: 79.99,
        originalPrice: 89.99,
        stock: 34,
        sold: 89,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
        status: 'active',
        createdAt: '2025-09-08',
        description: 'Light and comfortable summer dress'
      },
      {
        id: 5,
        name: 'Leather Jacket',
        category: 'Jackets',
        price: 249.99,
        originalPrice: 299.99,
        stock: 23,
        sold: 67,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
        status: 'active',
        createdAt: '2025-09-05',
        description: 'Premium leather jacket with modern design'
      },
      {
        id: 6,
        name: 'Winter Coat',
        category: 'Coats',
        price: 199.99,
        originalPrice: 229.99,
        stock: 12,
        sold: 45,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=300&fit=crop',
        status: 'low_stock',
        createdAt: '2025-09-03',
        description: 'Warm winter coat for cold weather'
      }
    ],
    categories: ['T-Shirts', 'Jeans', 'Shoes', 'Dresses', 'Jackets', 'Coats'],
    stats: {
      totalProducts: 156,
      totalRevenue: 45670,
      totalSold: 1234,
      lowStockCount: 8
    }
  };

  // Pass data to client component
  return <AllProductsClient productsData={productsData} />;
};

export default AllProducts;