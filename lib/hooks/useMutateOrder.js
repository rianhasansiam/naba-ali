/**
 * lib/hooks/useMutateOrder.js
 * ─────────────────────────────────────────────────────────────────────────────
 * React Query mutation hooks for orders.
 */

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Authenticated user — place a new order
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.post('/api/orders', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Admin — update order status / tracking
export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.put('/api/orders', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Admin — delete an order
export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      axios.delete('/api/orders', { data: { _id: id } }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
