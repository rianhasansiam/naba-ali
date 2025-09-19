
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteData = ({ name, api }) => {
  const queryClient = useQueryClient();

  // ✅ DELETE Data with error handling
  const { mutate, isLoading, error } = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.delete(`${api}/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete data');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the query to update the UI
      queryClient.invalidateQueries([name]);
    },
  });

  return { deleteData: mutate, isLoading, error };
};





//   how to use this hook
//   const { deleteData, isLoading, error } = useDeleteData({
//     name: 'products',
//     api: '/api/products'
//   });
//   


// Then in your component:
//   const handleDelete = (id) => {
//     deleteData(id);
//   };