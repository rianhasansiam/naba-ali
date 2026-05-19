/**
 * lib/hooks/useDeleteData.js
 * Generic DELETE mutation hook — React Query v5 compatible.
 */

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteData = ({ name, api }) => {
  const qc = useQueryClient();

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.delete(`${api}/${id}`);
        return response.data;
      } catch (err) {
        throw new Error(err.response?.data?.error || err.response?.data?.message || 'Failed to delete data');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [name] });
    },
  });

  return { deleteData: mutate, deleteDataAsync: mutateAsync, isLoading: isPending, error };
};