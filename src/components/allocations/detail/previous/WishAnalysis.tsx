import React from 'react';
import { Gift, Package, TrendingUp, AlertCircle } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface WishAnalysisProps {
  allocation: Allocation;
}

export function WishAnalysis({ allocation }: WishAnalysisProps) {
  // Mock data - replace with real data from API
  const metrics = {
    totalWishes: 2500,
    grantedWishes: 1875,
    potentialRevenue: 750000,
    averageWishValue: 400,
    products: [
      {
        id: 'p1',
        name: '2022 Cabernet Sauvignon',
        wishes: 850,
        granted: 637,
        remaining: 213,
        potentialRevenue: 42600
      },
      {
        id: 'p2',
        name: '2022 Chardonnay',
        wishes: 450,
        granted: 338,
        remaining: 112,
        potentialRevenue: 16800
      },
      {
        id: 'p3',
        name: '2022 Pinot Noir',
        wishes: 325,
        granted: 244,
        remaining: 81,
        potentialRevenue: 16200
      }
    ],
    tiers: [
      {
        id: 't1',
        name: 'Tier 1',
        wishes: 1000,
        granted: 750,
        conversionRate: 85
      },
      {
        id: 't2',
        name: 'Tier 2',
        wishes: 900,
        granted: 675,
        conversionRate: 75
      },
      {
        id: 't3',
        name: 'Tier 3',
        wishes: 600,
        granted: 450,
        conversionRate: 65
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Gift className="h-5 w-5" />
            <span className="text-sm">Total Wishes</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics.totalWishes.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            from all customers
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Package className="h-5 w-5" />
            <span className="text-sm">Granted Wishes</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics.grantedWishes.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {Math.round((metrics.grantedWishes / metrics.totalWishes) * 100)}% fulfillment rate
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">Potential Revenue</span>
          </div>
          <div className="text-2xl font-semibold">
            ${metrics.potentialRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            from unfulfilled wishes
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Average Wish Value</span>
          </div>
          <div className="text-2xl font-semibold">
            ${metrics.averageWishValue}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            per wish request
          </div>
        </div>
      </div>

      {/* Product Wish Analysis */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Product Wish Analysis</h3>
          <p className="mt-1 text-sm text-gray-500">
            Breakdown of wish requests by product
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 p-4">Product</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Total Wishes</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Granted</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Remaining</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Potential Revenue</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Fulfillment Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {metrics.products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-right">{product.wishes.toLocaleString()}</td>
                  <td className="p-4 text-right">{product.granted.toLocaleString()}</td>
                  <td className="p-4 text-right">{product.remaining.toLocaleString()}</td>
                  <td className="p-4 text-right">${product.potentialRevenue.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    {Math.round((product.granted / product.wishes) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Tier Performance</h3>
          <div className="space-y-4">
            {metrics.tiers.map(tier => (
              <div key={tier.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{tier.name}</span>
                  <span className="text-sm text-gray-500">
                    {tier.wishes.toLocaleString()} wishes
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(tier.granted / tier.wishes) * 100}%` }}
                  />
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {Math.round((tier.granted / tier.wishes) * 100)}% fulfillment rate
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Wish Request Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">High Conversion on Grants</p>
                <p className="mt-1 text-sm text-gray-500">
                  85% of granted wishes resulted in purchases, indicating strong purchase intent
                  from wish requesters.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Premium Product Demand</p>
                <p className="mt-1 text-sm text-gray-500">
                  Premium wines received 40% more wish requests per bottle allocated,
                  suggesting opportunity for inventory adjustment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}