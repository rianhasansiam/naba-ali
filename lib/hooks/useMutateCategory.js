/**
 * lib/hooks/useMutateCategory.js
 * ─────────────────────────────────────────────────────────────────────────────
 * React Query mutation hooks for categories.
 */

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.post('/api/categories', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.put('/api/categories', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      axios.delete('/api/categories', { data: { _id: id } }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
