import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const useGetData = ({name, api}) => { 
  // ✅ GET Data with error handling
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [name],
    queryFn: async () => {
      try {
        const response = await axios.get(api);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch data');
      }
    },
  });

  return { data, isLoading, error, refetch };
}



//   how to use this hook
//   const { data, isLoading, error } = useGetData({name: 'products', api: '/api/products' // your API endpoint});


