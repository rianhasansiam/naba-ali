'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function SimpleQueryTest() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['test-products'],
    queryFn: async () => {
      console.log('🔄 Fetching products...');
      const response = await axios.get('/api/products');
      console.log('✅ Products received:', response.data?.length || 0);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  console.log('Query State:', { isLoading, isFetching, hasData: !!data, error: !!error });

  if (isLoading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Simple Query Test</h2>
      <div className="bg-green-100 p-4 rounded mb-4">
        <p><strong>Status:</strong> Success</p>
        <p><strong>Data Type:</strong> {Array.isArray(data) ? 'Array' : typeof data}</p>
        <p><strong>Count:</strong> {Array.isArray(data) ? data.length : 'N/A'}</p>
        <p><strong>Is Fetching:</strong> {isFetching ? 'Yes' : 'No'}</p>
      </div>
      
      {data && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Sample Data:</h3>
          <pre className="text-xs overflow-auto max-h-32">
            {JSON.stringify(data.slice(0, 2), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}