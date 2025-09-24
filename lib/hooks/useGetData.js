import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, CACHE_CONFIG, API_ENDPOINTS } from "../queries/queryConfig";

// Enhanced hook with intelligent caching
export const useGetData = ({ 
  name, 
  api, 
  cacheType = 'STATIC', // STATIC, DYNAMIC, or USER_SPECIFIC
  enabled = true,
  customConfig = {} 
}) => { 
  // Get cache configuration based on data type
  const getCacheConfig = () => {
    switch(cacheType) {
      case 'STATIC':
        return CACHE_CONFIG.STATIC;
      case 'DYNAMIC':
        return CACHE_CONFIG.DYNAMIC;
      case 'USER_SPECIFIC':
        return CACHE_CONFIG.USER_SPECIFIC;
      default:
        return CACHE_CONFIG.STATIC;
    }
  };

  const cacheConfig = getCacheConfig();

  // ✅ Simplified query for debugging
  const { data, isLoading, error, refetch, isFetching, isStale } = useQuery({
    queryKey: [name],
    queryFn: async () => {
      console.log(`🔄 Fetching ${name}...`);
      const response = await axios.get(api);
      console.log(`✅ ${name} received:`, response.data?.length || 'non-array');
      return response.data;
    },
    enabled: !!api && enabled,
  });

  return { 
    data, 
    isLoading,
    error, 
    refetch, 
    isFetching, 
    isStale,
  };
};

// Usage example:
// const { data, isLoading, error } = useGetData({
//   name: 'products', 
//   api: '/api/products'
// });