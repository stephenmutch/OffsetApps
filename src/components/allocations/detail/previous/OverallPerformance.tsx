import React from 'react';
import { Users, DollarSign, Wine, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface OverallPerformanceProps {
  allocation: Allocation;
}

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    label: string;
  };
}

function MetricCard({ title, value, subValue, icon: Icon, trend }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        <Icon className="h-5 w-5" />
        <span className="text-sm">{title}</span>
      </div>
      <div className="text-2xl font-semibold">
        {value}
      </div>
      {subValue && (
        <div className="mt-1 text-sm text-gray-500">
          {subValue}
        </div>
      )}
      {trend && (
        <div className={`mt-2 flex items-center gap-1 text-sm ${
          trend.value >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.value >= 0 ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          <span>{Math.abs(trend.value)}% {trend.label}</span>
        </div>
      )}
    </div>
  );
}

export function OverallPerformance({ allocation }: OverallPerformanceProps) {
  // Mock data - replace with real data from API
  const metrics = {
    totalRevenue: allocation.current_revenue || 0,
    expectedRevenue: allocation.expected_revenue || 0,
    totalOrders: Math.round(allocation.total_customers * 0.75), // 75% conversion rate
    averageOrder: Math.round((allocation.current_revenue || 0) / (allocation.total_customers * 0.75)),
    totalCustomers: allocation.total_customers || 0,
    conversionRate: 75,
    inventorySold: 3567,
    totalInventory: 5000,
    previousAllocation: {
      revenue: 1200000,
      customers: 2800,
      conversion: 70
    }
  };

  const revenueTrend = ((metrics.totalRevenue - metrics.previousAllocation.revenue) / metrics.previousAllocation.revenue) * 100;
  const customerTrend = ((metrics.totalCustomers - metrics.previousAllocation.customers) / metrics.previousAllocation.customers) * 100;
  const conversionTrend = metrics.conversionRate - metrics.previousAllocation.conversion;

  return (
    
    <div className="space-y-6">
      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <ArrowUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Higher Customer Retention</p>
                <p className="mt-1 text-sm text-gray-500">
                  75% of customers from the previous allocation made a purchase in this allocation,
                  up from 65% in the last period.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Increased Average Order Value</p>
                <p className="mt-1 text-sm text-gray-500">
                  Average order value increased by 15% compared to the previous allocation,
                  driven by higher-priced wine selections.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Expand Tier 1 Allocation</p>
                <p className="mt-1 text-sm text-gray-500">
                  Consider increasing inventory for Tier 1 customers as they showed 95% purchase rate
                  and generated 45% of total revenue.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Wine className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Adjust Product Mix</p>
                <p className="mt-1 text-sm text-gray-500">
                  Increase allocation of premium wines as they showed strong demand with
                  over 500 unfulfilled wish requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          subValue={`${Math.round((metrics.totalRevenue / metrics.expectedRevenue) * 100)}% of target`}
          icon={DollarSign}
          trend={{
            value: Math.round(revenueTrend),
            label: 'vs previous'
          }}
        />
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
          subValue={`$${metrics.averageOrder.toLocaleString()} avg. order`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Customers"
          value={metrics.totalCustomers.toLocaleString()}
          subValue={`${metrics.conversionRate}% conversion`}
          icon={Users}
          trend={{
            value: Math.round(customerTrend),
            label: 'vs previous'
          }}
        />
        <MetricCard
          title="Inventory Sold"
          value={`${metrics.inventorySold.toLocaleString()}`}
          subValue={`${Math.round((metrics.inventorySold / metrics.totalInventory) * 100)}% of total`}
          icon={Wine}
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium">Revenue Over Time</h3>
            <p className="mt-1 text-sm text-gray-500">
              Daily revenue progression during the allocation period
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-600">Previous</span>
            </div>
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          Revenue chart will be implemented here
        </div>
      </div>

      
    </div>
  );
}