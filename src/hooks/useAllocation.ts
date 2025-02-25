import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Allocation } from '@/types/allocation';

export function useAllocation() {
  const { id } = useParams<{ id: string }>();
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllocation() {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error('Allocation ID is required');
        }

        console.log('Fetching allocation:', id);

        const { data, error: fetchError } = await supabase
          .from('allocations')
          .select(`
            *,
            allocation_products (
              id,
              product_id,
              total_inventory,
              remaining_inventory
            ),
            allocation_tiers (
              id,
              name,
              level,
              customer_count
            )
          `)
          .eq('id', id)
          .single();

        if (fetchError) {
          console.error('Error fetching allocation:', fetchError);
          throw fetchError;
        }

        if (!data) {
          console.error('No allocation found with ID:', id);
          throw new Error('Allocation not found');
        }

        console.log('Allocation fetched successfully:', data);

        if (isMounted) {
          setAllocation(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error in fetchAllocation:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch allocation'));
          setAllocation(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAllocation();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { allocation, loading, error };
}