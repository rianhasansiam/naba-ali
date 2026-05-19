/**
 * lib/hooks/useUpdateData.js
 * Generic PUT mutation hook — React Query v5 compatible.
 */

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateData = ({ name, api }) => {
  const qc = useQueryClient();

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const response = await axios.put(`${api}/${id}`, data);
        return response.data;
      } catch (err) {
        throw new Error(err.response?.data?.error || err.response?.data?.message || 'Failed to update data');
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [name] });
    },
  });

  return { updateData: mutate, updateDataAsync: mutateAsync, isLoading: isPending, error };
};
