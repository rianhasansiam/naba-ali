
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateData = ({ name, api }) => {
  const queryClient = useQueryClient();

  // ✅ UPDATE Data with error handling
  const { mutate, isLoading, error } = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const response = await axios.put(`${api}/${id}`, data);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update data');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the query to update the UI
      queryClient.invalidateQueries([name]);
    },
  });

  return { updateData: mutate, isLoading, error };
};





//   how to use this hook
//   const { updateData, isLoading, error } = useUpdateData({
//     name: 'products',
//     api: '/api/products'
//   });
 



// Then in your component:
//   const handleUpdate = (id, formData) => {
//     updateData({ id, data: formData });
//   };
