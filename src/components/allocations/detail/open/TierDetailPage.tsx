import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, Wine, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAllocation } from '@/hooks/useAllocation';

interface TierMetrics {
  customerCount: number;
  purchasedCount: number;
  revenue: number;
  averageOrder: number;
  completionRate: number;
  inventorySold: number;
  totalInventory: number;
}

interface TierInsight {
  type: 'success' | 'warning' | 'info';
  message: string;
  metric?: string;
  trend?: 'up' | 'down';
  value?: string;
}

// Helper function to generate insights
const generateInsights = (metrics: TierMetrics): TierInsight[] => {
  const insights: TierInsight[] = [];

  if (metrics.completionRate > 75) {
    insights.push({
      type: 'success',
      message: 'Completion rate is above average',
      metric: 'Completion Rate',
      trend: 'up',
      value: `${metrics.completionRate.toFixed(1)}%`
    });
  }

  if (metrics.revenue > 1000000) {
    insights.push({
      type: 'info',
      message: 'High potential for additional revenue',
      metric: 'Potential Revenue',
      value: '$325,000'
    });
  }

  const inventoryRemaining = ((metrics.totalInventory - metrics.inventorySold) / metrics.totalInventory) * 100;
  if (inventoryRemaining < 25) {
    insights.push({
      type: 'warning',
      message: 'Inventory running low for top products',
      metric: 'Remaining Inventory',
      trend: 'down',
      value: `${inventoryRemaining.toFixed(1)}%`
    });
  }

  return insights;
};

export function TierDetailPage() {
  const { id, tierId } = useParams();
  const navigate = useNavigate();
  const { allocation, loading: allocationLoading } = useAllocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tier, setTier] = useState<any>(null);
  const [metrics, setMetrics] = useState<TierMetrics | null>(null);
  const [insights, setInsights] = useState<TierInsight[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchTierData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parameter validation
        if (!id || !tierId) {
          throw new Error('Missing required parameters');
        }

        // Fetch tier data
        const { data: tierData, error: tierError } = await supabase
          .from('allocation_tiers')
          .select(`
            *,
            customer_tiers (
              customer_id,
              has_purchased,
              last_engagement,
              pvn_score
            ),
            tier_overrides (
              requirements,
              discounts,
              shipping
            )
          `)
          .eq('id', tierId)
          .eq('allocation_id', id)
          .maybeSingle();

        if (tierError) throw tierError;
        if (!tierData) throw new Error('Tier not found');

        // Validate tier belongs to allocation
        if (tierData.allocation_id !== id) {
          throw new Error('Tier does not belong to this allocation');
        }

        setTier(tierData);

        // Calculate metrics
        const customerCount = tierData.customer_count || 0;
        const purchasedCount = tierData.customer_tiers?.filter((ct: any) => ct.has_purchased).length || 0;
        
        const metrics: TierMetrics = {
          customerCount,
          purchasedCount,
          revenue: 1250000, // Mock data
          averageOrder: 2500, // Mock data
          completionRate: customerCount > 0 ? (purchasedCount / customerCount) * 100 : 0,
          inventorySold: 750, // Mock data
          totalInventory: 1000, // Mock data
        };

        setMetrics(metrics);
        setInsights(generateInsights(metrics));

        // Set mock data
        setRecentCustomers([
          { id: 1, name: 'John Doe', email: 'john@example.com', lastPurchase: '2024-02-20', totalSpent: 5200 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', lastPurchase: '2024-02-19', totalSpent: 3800 },
          { id: 3, name: 'Bob Wilson', email: 'bob@example.com', lastPurchase: '2024-02-18', totalSpent: 4500 }
        ]);

        setTopProducts([
          { id: 1, name: '2022 Cabernet Sauvignon', sold: 250, revenue: 125000, remaining: 50 },
          { id: 2, name: '2022 Chardonnay', sold: 180, revenue: 72000, remaining: 120 },
          { id: 3, name: '2022 Pinot Noir', sold: 160, revenue: 88000, remaining: 90 }
        ]);

      } catch (error) {
        console.error('Error in fetchTierData:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTierData();
  }, [id, tierId]);

  // Show loading state while allocation is loading
  if (allocationLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <div className="text-lg font-medium text-gray-900">Loading Allocation</div>
        </div>
      </div>
    );
  }

  // Show error if allocation is not found
  if (!allocation) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Allocation Not Found</h2>
          <p className="text-gray-500">The allocation you're looking for doesn't exist.</p>
          <Button
            variant="outline"
            onClick={() => navigate('/allocations')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Allocations
          </Button>
        </div>
      </div>
    );
  }

  // Loading state for tier data
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/allocations/${id}/open`)}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to Allocation
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <div className="text-lg font-medium text-gray-900">Loading Tier Data</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !tier) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/allocations/${id}/open`)}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to Allocation
            </button>
          </div>
        </div>

        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">Error Loading Tier</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {error || 'Unable to load tier data. Please try again.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/allocations/${id}/open`)}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to Allocation
          </button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {tier.name}
            </h1>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Level {tier.level}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">
                  {new Date(tier.access_start).toLocaleDateString()} - {new Date(tier.access_end).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border ${
              insight.type === 'success' ? 'bg-green-50 border-green-100' :
              insight.type === 'warning' ? 'bg-yellow-50 border-yellow-100' :
              'bg-blue-50 border-blue-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className={`
                ${insight.type === 'success' ? 'text-green-600' :
                  insight.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'}
              `} size={20} />
              <div className="flex-1">
                <span className={`
                  ${insight.type === 'success' ? 'text-green-900' :
                    insight.type === 'warning' ? 'text-yellow-900' :
                    'text-blue-900'}
                `}>
                  {insight.message}
                </span>
                {insight.metric && (
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-sm font-medium">{insight.metric}:</span>
                    <span className="text-lg font-semibold">{insight.value}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-sm">Customers</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics?.customerCount.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {metrics?.purchasedCount.toLocaleString()} purchased
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm">Revenue</span>
          </div>
          <div className="text-2xl font-semibold">
            ${metrics?.revenue.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            ${metrics?.averageOrder.toLocaleString()} avg. order
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Wine className="h-5 w-5" />
            <span className="text-sm">Inventory</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics?.inventorySold.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            bottles sold
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">Completion</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics?.completionRate.toFixed(1)}%
          </div>
          <div className="mt-1 text-sm text-gray-500">
            of customers purchased
          </div>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Recent Customers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 p-4">Customer</th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Last Purchase</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Total Spent</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    {new Date(customer.lastPurchase).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Top Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 p-4">Product</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Sold</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Revenue</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{product.name}</div>
                  </td>
                  <td className="p-4 text-right">
                    {product.sold.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    {product.remaining.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}