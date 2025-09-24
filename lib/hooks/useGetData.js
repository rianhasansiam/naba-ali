import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const useGetData = ({ name, api }) => { 
  // ✅ GET Data with optimized error handling and caching
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [name],
    queryFn: async () => {
      try {
        const response = await axios.get(api);
        return response.data;
      } catch (error) {
        const message = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       'Failed to fetch data';
        throw new Error(message);
      }
    },
    // ✅ Add caching and retry options for better performance
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error, refetch };
};

// Usage example:
// const { data, isLoading, error } = useGetData({
//   name: 'products', 
//   api: '/api/products'
// });