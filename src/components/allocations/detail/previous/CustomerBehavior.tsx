import React from 'react';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface CustomerBehaviorProps {
  allocation: Allocation;
}

export function CustomerBehavior({ allocation }: CustomerBehaviorProps) {
  // Mock data - replace with real data from API
  const metrics = {
    totalCustomers: allocation.total_customers || 0,
    purchasedCustomers: Math.round((allocation.total_customers || 0) * 0.75),
    newCustomers: Math.round((allocation.total_customers || 0) * 0.3),
    returningCustomers: Math.round((allocation.total_customers || 0) * 0.45),
    averageSpend: 2500,
    retentionRate: 85,
    dropOffRate: 15,
    segments: [
      { name: 'High Value', count: 250, revenue: 875000, avgOrder: 3500 },
      { name: 'Regular', count: 1500, revenue: 2250000, avgOrder: 1500 },
      { name: 'Occasional', count: 750, revenue: 750000, avgOrder: 1000 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-sm">Total Customers</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics.totalCustomers.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {metrics.newCustomers.toLocaleString()} new customers
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <UserCheck className="h-5 w-5" />
            <span className="text-sm">Purchased</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics.purchasedCustomers.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {Math.round((metrics.purchasedCustomers / metrics.totalCustomers) * 100)}% conversion
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">Average Spend</span>
          </div>
          <div className="text-2xl font-semibold">
            ${metrics.averageSpend.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            per customer
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <UserX className="h-5 w-5" />
            <span className="text-sm">Drop-off Rate</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics.dropOffRate}%
          </div>
          <div className="mt-1 text-sm text-gray-500">
            of allocated customers
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Customer Segments</h3>
          <p className="mt-1 text-sm text-gray-500">
            Breakdown of customer performance by segment
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 p-4">Segment</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Customers</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Revenue</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Avg. Order</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {metrics.segments.map(segment => (
                <tr key={segment.name} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{segment.name}</td>
                  <td className="p-4 text-right">{segment.count.toLocaleString()}</td>
                  <td className="p-4 text-right">${segment.revenue.toLocaleString()}</td>
                  <td className="p-4 text-right">${segment.avgOrder.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    {Math.round((segment.count / metrics.totalCustomers) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Retention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Retention Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Retention Rate</span>
                <span className="text-sm font-medium">{metrics.retentionRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${metrics.retentionRate}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {metrics.returningCustomers.toLocaleString()} returning customers
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Drop-off Rate</span>
                <span className="text-sm font-medium">{metrics.dropOffRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${metrics.dropOffRate}%` }}
                />
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {Math.round(metrics.totalCustomers * (metrics.dropOffRate / 100)).toLocaleString()} lost customers
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Customer Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Strong Retention</p>
                <p className="mt-1 text-sm text-gray-500">
                  85% of customers from previous allocations made a purchase,
                  indicating high customer loyalty.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">High Value Growth</p>
                <p className="mt-1 text-sm text-gray-500">
                  The High Value segment grew by 25% compared to the previous allocation,
                  showing successful customer development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}