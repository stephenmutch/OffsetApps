import React from 'react';
import { Wine, Package, TrendingUp, AlertCircle } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface ProductPerformanceProps {
  allocation: Allocation;
}

export function ProductPerformance({ allocation }: ProductPerformanceProps) {
  // Mock data - replace with real data from API
  const metrics = {
    totalProducts: 12,
    totalSold: 15000,
    totalRevenue: allocation.current_revenue || 0,
    averagePrice: 125,
    sellThroughRate: 85,
    products: [
      { 
        id: 'p1',
        name: '2022 Cabernet Sauvignon',
        allocated: 5000,
        sold: 4750,
        revenue: 950000,
        price: 200,
        wishRequests: 850
      },
      { 
        id: 'p2',
        name: '2022 Chardonnay',
        allocated: 3000,
        sold: 2850,
        revenue: 427500,
        price: 150,
        wishRequests: 450
      },
      { 
        id: 'p3',
        name: '2022 Pinot Noir',
        allocated: 2500,
        sold: 2375,
        revenue: 475000,
        price: 200,
        wishRequests: 325
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Wine className="h-5 w-5" />
            <span className="text-sm">Total Products</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics.totalProducts}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            wines offered
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Package className="h-5 w-5" />
            <span className="text-sm">Total Sold</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics.totalSold.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            bottles sold
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">Average Price</span>
          </div>
          <div className="text-2xl font-semibold">
            ${metrics.averagePrice}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            per bottle
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Sell-Through Rate</span>
          </div>
          <div className="text-2xl font-semibold">
            {metrics.sellThroughRate}%
          </div>
          <div className="mt-1 text-sm text-gray-500">
            of allocated inventory
          </div>
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Product Performance</h3>
          <p className="mt-1 text-sm text-gray-500">
            Detailed breakdown of each product's performance
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 p-4">Product</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Allocated</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Sold</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Price</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Revenue</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Sell-Through</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Wish Requests</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {metrics.products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-right">{product.allocated.toLocaleString()}</td>
                  <td className="p-4 text-right">{product.sold.toLocaleString()}</td>
                  <td className="p-4 text-right">${product.price}</td>
                  <td className="p-4 text-right">${product.revenue.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    {Math.round((product.sold / product.allocated) * 100)}%
                  </td>
                  <td className="p-4 text-right">{product.wishRequests.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Top Performers</h3>
          <div className="space-y-4">
            {metrics.products.slice(0, 2).map(product => (
              <div key={product.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-500">
                    ${product.revenue.toLocaleString()} revenue
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${(product.sold / product.allocated) * 100}%` }}
                  />
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {Math.round((product.sold / product.allocated) * 100)}% sell-through rate
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Product Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Strong Premium Performance</p>
                <p className="mt-1 text-sm text-gray-500">
                  Premium wines ($200+) showed 95% sell-through rate with high wish request volume.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Inventory Optimization</p>
                <p className="mt-1 text-sm text-gray-500">
                  High wish request volume suggests opportunity to increase allocation
                  for top-performing products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}