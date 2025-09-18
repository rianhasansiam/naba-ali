import AllCategoryClient from './AllCategoryClient';

// Server Component - Handles data fetching
const AllCategory = () => {
  // Server-side category data (could come from database/API)
  const categoryData = {
    categories: [
      {
        id: 1,
        name: 'T-Shirts',
        description: 'Comfortable and stylish t-shirts for everyday wear',
        productCount: 45,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
        status: 'active',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'Jeans',
        description: 'Premium denim jeans with perfect fit',
        productCount: 32,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
        status: 'active',
        createdAt: '2024-01-20'
      }
      // More categories would be added here
    ],
    stats: {
      totalCategories: 12,
      activeCategories: 11,
      inactiveCategories: 1
    }
  };

  return <AllCategoryClient categoryData={categoryData} />;
};

export default AllCategory;