import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Wine, Clock, Calendar, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface AllocationOverviewProps {
  allocation: Allocation;
}

interface TierSummary {
  id: string;
  name: string;
  level: number;
  customer_count: number;
  access_start: string;
  access_end: string;
}

export function AllocationOverview({ allocation }: AllocationOverviewProps) {
  const [tiers, setTiers] = useState<TierSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const daysRemaining = Math.ceil(
    (new Date(allocation.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysTotal = Math.ceil(
    (new Date(allocation.end_date).getTime() - new Date(allocation.start_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  const progress = Math.min(100, Math.max(0, ((daysTotal - daysRemaining) / daysTotal) * 100));

  useEffect(() => {
    const fetchTiers = async () => {
      if (allocation.allocation_type === 'tier') {
        try {
          const { data, error } = await supabase
            .from('allocation_tiers')
            .select('*')
            .eq('allocation_id', allocation.id)
            .order('level', { ascending: true });

          if (error) throw error;
          setTiers(data || []);
        } catch (error) {
          console.error('Error fetching tiers:', error);
        }
      }
      setLoading(false);
    };

    fetchTiers();
  }, [allocation.id, allocation.allocation_type]);

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Clock className="text-blue-600" size={20} />
          <div className="flex-1">
            <span className="text-blue-900">
              {allocation.status === 'scheduled' ? (
                `This allocation will open in ${daysRemaining} days`
              ) : allocation.status === 'active' ? (
                `${daysRemaining} days remaining in this allocation`
              ) : allocation.status === 'completed' ? (
                'This allocation has ended'
              ) : (
                'This allocation is in draft mode'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-sm">Total Customers</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">
              {allocation.total_customers?.toLocaleString() || 0}
            </span>
            <span className="text-sm text-gray-500">customers</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm">Current Revenue</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">
              ${(allocation.current_revenue || 0).toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              of ${(allocation.expected_revenue || 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Wine className="h-5 w-5" />
            <span className="text-sm">Products</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">
              {allocation.allocation_products?.length || 0}
            </span>
            <span className="text-sm text-gray-500">available</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">Duration</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{daysTotal}</span>
            <span className="text-sm text-gray-500">days total</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Allocation Progress</h3>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{new Date(allocation.start_date).toLocaleDateString()}</span>
            <span>{new Date(allocation.end_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Allocation Type Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">
          {allocation.allocation_type === 'tier' ? 'Tier Structure' : 'Individual Allocations'}
        </h3>
        
        {allocation.allocation_type === 'tier' ? (
          loading ? (
            <div className="text-center py-4 text-gray-500">Loading tiers...</div>
          ) : tiers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No tiers have been created yet. Configure tiers in the Tiers tab.
            </div>
          ) : (
            <div className="space-y-4">
              {tiers.map((tier) => (
                <div 
                  key={tier.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                      {tier.level}
                    </div>
                    <div>
                      <h4 className="font-medium">{tier.name}</h4>
                      <p className="text-sm text-gray-500">
                        {tier.customer_count.toLocaleString()} customers
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>Access Start: {new Date(tier.access_start).toLocaleDateString()}</div>
                    <div>Access End: {new Date(tier.access_end).toLocaleDateString()}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">
              This allocation is configured for individual customer allocations. Each customer can be assigned their own specific allocation settings.
            </p>
            <p className="text-gray-500 text-sm">
              Manage individual customer allocations in the Individual Allocations tab.
            </p>
          </div>
        )}
      </div>

      {/* Configuration Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Configuration Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Purchase Requirements</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Minimum Bottles:</span>
                <span>{allocation.cart_min || 'No minimum'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Maximum Bottles:</span>
                <span>{allocation.cart_max || 'No maximum'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Minimum Amount:</span>
                <span>${allocation.min_amount || 'No minimum'}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Discounts</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Discount:</span>
                <span>
                  {allocation.order_discount_amount
                    ? `${allocation.order_discount_amount}${allocation.order_discount_type === 'percentage' ? '%' : '$'}`
                    : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Discount:</span>
                <span>
                  {allocation.shipping_discount_amount
                    ? `${allocation.shipping_discount_amount}${allocation.shipping_discount_type === 'percentage' ? '%' : '$'}`
                    : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Method:</span>
                <span>{allocation.shipping_discount_method || 'Default'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}