import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AllocationStats {
  totalAllocations: number;
  activeAllocations: number;
  totalRevenue: number;
  revenueChange: number;
  totalCustomers: number;
  avgDuration: number;
}

interface AllocationFilters {
  status: string;
  product: string;
  date: string;
}

interface AllocationStore {
  allocations: any[];
  stats: AllocationStats;
  filters: AllocationFilters;
  loading: boolean;
  error: Error | null;
  fetchAllocations: () => Promise<void>;
  setFilters: (filters: Partial<AllocationFilters>) => void;
}

export const useAllocationStore = create<AllocationStore>((set, get) => ({
  allocations: [],
  stats: {
    totalAllocations: 0,
    activeAllocations: 0,
    totalRevenue: 0,
    revenueChange: 0,
    totalCustomers: 0,
    avgDuration: 0,
  },
  filters: {
    status: 'all',
    product: '',
    date: '',
  },
  loading: false,
  error: null,

  fetchAllocations: async () => {
    set({ loading: true });
    try {
      // Fetch allocations with filters
      const { filters } = get();
      let query = supabase
        .from('allocations')
        .select(`
          *,
          allocation_products (
            product_id,
            total_inventory,
            remaining_inventory
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.date) {
        query = query.gte('start_date', filters.date);
      }

      const { data: allocations, error } = await query;

      if (error) throw error;

      // Calculate stats
      const stats = {
        totalAllocations: allocations?.length || 0,
        activeAllocations: allocations?.filter(a => a.status === 'active').length || 0,
        totalRevenue: allocations?.reduce((sum, a) => sum + (a.current_revenue || 0), 0) || 0,
        revenueChange: 12.3, // This would need to be calculated based on historical data
        totalCustomers: allocations?.reduce((sum, a) => sum + (a.total_customers || 0), 0) || 0,
        avgDuration: 30, // This would need to be calculated from start/end dates
      };

      set({ allocations: allocations || [], stats, error: null });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().fetchAllocations();
  },
}));