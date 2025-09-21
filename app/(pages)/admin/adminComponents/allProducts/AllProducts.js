import AllProductsClient from './AllProductsClient';

// Simple Server Component - No longer handles data fetching
const AllProducts = () => {
  // Client component will fetch data using hooks
  return <AllProductsClient />;
};

export default AllProducts;