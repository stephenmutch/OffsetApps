import React, { useState, useEffect } from 'react';
import { Gift, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface TierPerformanceProps {
  allocation: Allocation;
}

interface TierMetrics {
  id: string;
  name: string;
  level: number;
  customerCount: number;
  purchasedCount: number;
  revenue: number;
  targetRevenue: number;
  averageOrder: number;
  products: {
    id: string;
    name: string;
    allocated: number;
    purchased: number;
    remaining: number;
    revenue: number;
    wishRequests: number;
    potentialRevenue: number;
  }[];
  insights: {
    type: 'success' | 'warning' | 'info';
    message: string;
  }[];
}

export function TierPerformance({ allocation }: TierPerformanceProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<TierMetrics[]>([]);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const { data: tiersData, error: tiersError } = await supabase
          .from('allocation_tiers')
          .select(`
            *,
            customer_tiers (
              id,
              has_purchased
            )
          `)
          .eq('allocation_id', allocation.id)
          .order('level', { ascending: true });

        if (tiersError) throw tiersError;

        // Transform the data into our TierMetrics format
        const transformedTiers: TierMetrics[] = (tiersData || []).map(tier => {
          const purchasedCount = tier.customer_tiers?.filter(ct => ct.has_purchased).length || 0;
          const customerCount = tier.customer_count || 0;
          const completionRate = customerCount > 0 ? (purchasedCount / customerCount) * 100 : 0;

          // Generate insights based on metrics
          const insights = [];
          if (completionRate > 75) {
            insights.push({
              type: 'success',
              message: `${completionRate.toFixed(0)}% of customers have completed their purchase`
            });
          } else if (completionRate < 25) {
            insights.push({
              type: 'warning',
              message: `Only ${completionRate.toFixed(0)}% of customers have made a purchase`
            });
          }

          // Mock some revenue data since we don't have it in the database yet
          const revenue = purchasedCount * 1500; // Average order value of $1,500
          const targetRevenue = customerCount * 2000; // Target of $2,000 per customer

          return {
            id: tier.id,
            name: tier.name,
            level: tier.level,
            customerCount,
            purchasedCount,
            revenue,
            targetRevenue,
            averageOrder: purchasedCount > 0 ? revenue / purchasedCount : 0,
            products: [], // We'll add real product data when available
            insights
          };
        });

        setTiers(transformedTiers);
        setError(null);
      } catch (err) {
        console.error('Error fetching tiers:', err);
        setError('Failed to load tier data');
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, [allocation.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Loading Tiers</div>
          <div className="mt-2 text-sm text-gray-500">Please wait...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <div className="flex-1">
            <span className="text-red-900">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      {tiers.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Gift className="text-blue-600" size={20} />
            <div className="flex-1">
              <span className="text-blue-900">
                {tiers[0].customerCount} customers across {tiers.length} tiers
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tier Cards */}
      <div className="space-y-6">
        {tiers.map(tier => (
          <div key={tier.id} className="bg-white rounded-lg border">
            {/* Tier Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                      {tier.level}
                    </div>
                    <h3 className="text-lg font-medium">{tier.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {tier.customerCount.toLocaleString()} total customers
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold">
                    ${tier.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    of ${tier.targetRevenue.toLocaleString()} target
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Customer Purchases</span>
                    <span className="text-sm font-medium">
                      {Math.round((tier.purchasedCount / tier.customerCount) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(tier.purchasedCount / tier.customerCount) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {tier.purchasedCount.toLocaleString()} of {tier.customerCount.toLocaleString()} customers have purchased
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Revenue Progress</span>
                    <span className="text-sm font-medium">
                      {Math.round((tier.revenue / tier.targetRevenue) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${(tier.revenue / tier.targetRevenue) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Average order value: ${tier.averageOrder.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="mt-6 space-y-2">
                {tier.insights.map((insight, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center gap-2 text-sm ${
                      insight.type === 'success' ? 'text-green-600' :
                      insight.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{insight.message}</span>
                  </div>
                ))}
              </div>

              {/* View Details Button */}
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/allocations/${id}/open/tier/${tier.id}`)}
                  className="gap-2"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {tiers.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border">
            <p className="text-gray-500">No tiers found for this allocation.</p>
          </div>
        )}
      </div>
    </div>
  );
}