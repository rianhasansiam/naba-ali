/**
 * lib/hooks/useMutateProduct.js
 * ─────────────────────────────────────────────────────────────────────────────
 * React Query mutation hooks for products.
 *
 * Pattern:
 *   mutationFn → POST/PUT/DELETE /api/products
 *   onSuccess  → invalidate ['products'] + ['stats']
 *
 * The server-side revalidateProductData() is called inside the API route.
 * These client-side invalidations keep the React Query cache in sync.
 */

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => axios.post('/api/products', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (err) => {
      console.error('useCreateProduct error:', err.response?.data?.error ?? err.message);
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) =>
      axios.put(`/api/products/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: [`/api/products/${id}`] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (err) => {
      console.error('useUpdateProduct error:', err.response?.data?.error ?? err.message);
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      axios.delete('/api/products', { data: { _id: id } }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (err) => {
      console.error('useDeleteProduct error:', err.response?.data?.error ?? err.message);
    },
  });
}
