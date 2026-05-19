/**
 * lib/hooks/useMutateReview.js
 * ─────────────────────────────────────────────────────────────────────────────
 * React Query mutation hooks for reviews.
 * After every mutation the server runs revalidateReviewData() + emits
 * reviews:changed. These client hooks additionally invalidate the local cache.
 */

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Authenticated user — submit a new review
export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.post('/api/reviews', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Admin — update / approve a review
export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.put('/api/reviews', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

// Admin — delete a review
export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      axios.delete('/api/reviews', { data: { _id: id } }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
