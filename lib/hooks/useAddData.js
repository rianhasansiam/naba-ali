/**
 * lib/hooks/useAddData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Generic POST mutation hook with proper query key invalidation.
 * For domain-specific invalidation (stats, related queries) use the
 * dedicated useMutate*.js hooks instead.
 */

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddData = ({ name, api }) => {
  const qc = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axios.post(api, data);
        return response.data;
      } catch (err) {
        throw new Error(
          err.response?.data?.error || err.response?.data?.message || 'Failed to add data'
        );
      }
    },
    onSuccess: () => {
      // Invalidate using array-style query key (v5 compatible)
      qc.invalidateQueries({ queryKey: [name] });
    },
  });

  return { addData: mutateAsync, isLoading: isPending, error };
};
