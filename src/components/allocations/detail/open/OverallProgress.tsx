import React from 'react';
import { Gift, Mail } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface OverallProgressProps {
  allocation: Allocation;
}

export function OverallProgress({ allocation }: OverallProgressProps) {
  const currentRevenue = allocation.current_revenue || 0;
  const expectedRevenue = allocation.expected_revenue || 0;
  const revenueProgress = expectedRevenue > 0 ? (currentRevenue / expectedRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Insights */}
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Gift className="text-blue-600" size={20} />
            <div className="flex-1">
              <span className="text-blue-900">
                We predict there next time you can add 7 customers from your waiting list of 213 customers to generate additional revenue of $14,000.
              </span>
            </div>
            <button className="text-blue-600 font-medium hover:text-blue-700">
              VIEW WISH REQUESTS
            </button>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Mail className="text-purple-600" size={20} />
            <div className="flex-1">
              <span className="text-purple-900">
                We predict sending an email reminder now to your 368 customers who haven't purchased would generate a projected revenue of $1,667,000.00.
              </span>
            </div>
            <button className="text-purple-600 font-medium hover:text-purple-700">
              VIEW REMINDER
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Progress */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium">Revenue</h3>
            <div className="mt-1 text-2xl font-semibold">
              ${currentRevenue.toLocaleString()}
              <span className="text-sm text-gray-500 font-normal ml-2">
                of ${expectedRevenue.toLocaleString()} expected
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-lg font-medium">{Math.round(revenueProgress)}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${revenueProgress}%` }}
          />
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Customer Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div className="text-gray-500">Purchasers</div>
              <div className="text-xl font-medium">1,245</div>
            </div>
            <div className="flex justify-between items-baseline">
              <div className="text-gray-500">Non-Purchasers</div>
              <div className="text-xl font-medium">2,225</div>
            </div>
            <div className="flex justify-between items-baseline">
              <div className="text-gray-500">Completion Rate</div>
              <div className="text-xl font-medium">35.8%</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">High-Value Customers</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div className="text-gray-500">Total Orders</div>
              <div className="text-xl font-medium">425</div>
            </div>
            <div className="flex justify-between items-baseline">
              <div className="text-gray-500">Average Order Value</div>
              <div className="text-xl font-medium">$2,450</div>
            </div>
            <div className="flex justify-between items-baseline">
              <div className="text-gray-500">Revenue Share</div>
              <div className="text-xl font-medium">45%</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Inventory Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div className="text-gray-500">Bottles Sold</div>
              <div className="text-xl font-medium">3,567</div>
            </div>
            <div className="flex justify-between items-baseline">
              <div className="text-gray-500">Remaining</div>
              <div className="text-xl font-medium">1,433</div>
            </div>
            <div className="flex justify-between items-baseline">
              <div className="text-gray-500">Sell-Through Rate</div>
              <div className="text-xl font-medium">71.3%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Insights */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Waitlist Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-3xl font-semibold">213</div>
            <div className="text-gray-500 mt-1">Customers Waiting</div>
            <div className="text-sm text-gray-500 mt-2">
              Average wait time: 45 days
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold">$425,000</div>
            <div className="text-gray-500 mt-1">Potential Revenue</div>
            <div className="text-sm text-gray-500 mt-2">
              Based on average order value
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}