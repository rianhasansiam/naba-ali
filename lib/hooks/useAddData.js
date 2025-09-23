
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddData = ({ name, api }) => {
  const queryClient = useQueryClient();

  // ✅ POST Data with error handling
  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axios.post(api, data);
        return response.data;
      } catch (error) {
        console.error('API Error details:', error.response?.data);
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to add data');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the query to update the UI
      queryClient.invalidateQueries([name]);
    },
  });

  return { addData: mutateAsync, isLoading, error };
};







//   how to use this hook
//   const { addData, isLoading, error } = useAddData({
//     name: 'products',
//     api: '/api/products'
//   });
   



// Then in your component:
//   const handleSubmit = (formData) => {
//     addData(formData);
//   };
