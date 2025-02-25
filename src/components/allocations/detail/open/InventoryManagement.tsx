import React from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface InventoryManagementProps {
  allocation: Allocation;
}

interface ProductInventory {
  id: string;
  name: string;
  sku: string;
  qtySold: number;
  revenue: number;
  qtyLeft: number;
  wishRequests: number;
  potentialRevenue: number;
}

// Mock data - replace with actual data from Supabase
const MOCK_PRODUCTS: ProductInventory[] = [
  {
    id: 'DM22CHCLO2',
    name: '2022 Chardonnay Chloe',
    sku: 'DM22CHCLO2',
    qtySold: 1383,
    revenue: 172875.00,
    qtyLeft: 12023,
    wishRequests: 1208,
    potentialRevenue: 151000.00
  },
  {
    id: 'DM22CHEST2',
    name: '2022 Chardonnay DuMOL Estate Vineyard',
    sku: 'DM22CHEST2',
    qtySold: 1209,
    revenue: 120900.00,
    qtyLeft: 1895,
    wishRequests: 1569,
    potentialRevenue: 189500.00
  },
  {
    id: 'DM22CHBRE2',
    name: '2022 Chardonnay Bressay Estate Vineyard',
    sku: 'DM22CHBRE2',
    qtySold: 955,
    revenue: 100275.00,
    qtyLeft: 12634,
    wishRequests: 1343,
    potentialRevenue: 141015.00
  },
  {
    id: 'DM22PNRYN2',
    name: '2022 Pinot Noir Ryan',
    sku: 'DM22PNRYN2',
    qtySold: 252,
    revenue: 22680.00,
    qtyLeft: 2367,
    wishRequests: 898,
    potentialRevenue: 80820.00
  },
  {
    id: 'DM22PNEST2',
    name: '2022 Pinot Noir DuMOL Estate Vineyard',
    sku: 'DM22PNEST2',
    qtySold: 633,
    revenue: 63000.00,
    qtyLeft: 897,
    wishRequests: 456,
    potentialRevenue: 45600.00
  }
];

export function InventoryManagement({ allocation }: InventoryManagementProps) {
  // Calculate totals
  const totalInventory = MOCK_PRODUCTS.reduce((sum, p) => sum + p.qtySold + p.qtyLeft, 0);
  const totalSold = MOCK_PRODUCTS.reduce((sum, p) => sum + p.qtySold, 0);
  const totalRevenue = MOCK_PRODUCTS.reduce((sum, p) => sum + p.revenue, 0);
  const totalWishRequests = MOCK_PRODUCTS.reduce((sum, p) => sum + p.wishRequests, 0);
  const totalPotentialRevenue = MOCK_PRODUCTS.reduce((sum, p) => sum + p.potentialRevenue, 0);
  
  const inventoryProgress = (totalSold / totalInventory) * 100;

  return (
    <div className="space-y-6">
      {/* Wish Requests Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Gift className="text-blue-600" size={20} />
          <div className="flex-1">
            <span className="text-blue-900">
              Grant {totalWishRequests.toLocaleString()} wishes to sell {Math.round((totalWishRequests/totalInventory) * 100)}% of your remaining inventory
            </span>
          </div>
          <Button variant="outline" className="text-blue-600 hover:text-blue-700">
            VIEW WISH REQUESTS
          </Button>
        </div>
      </div>

      {/* Inventory Overview */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium">Inventory</h3>
            <div className="mt-1 text-2xl font-semibold">
              {totalSold.toLocaleString()}
              <span className="text-sm text-gray-500 font-normal ml-2">
                of {totalInventory.toLocaleString()} total bottles
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Sold</div>
            <div className="text-lg font-medium">{Math.round(inventoryProgress)}%</div>
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${inventoryProgress}%` }}
          />
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Current Revenue</h3>
          <div className="text-3xl font-semibold">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            From {totalSold.toLocaleString()} bottles sold
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Potential Revenue</h3>
          <div className="text-3xl font-semibold">
            ${totalPotentialRevenue.toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            If all {totalWishRequests.toLocaleString()} wishes granted
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Average Price</h3>
          <div className="text-3xl font-semibold">
            ${Math.round(totalRevenue / totalSold).toLocaleString()}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Per bottle sold
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 p-4">Product</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Qty Sold</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Revenue</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Qty Left</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Wish Requests</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Potential Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_PRODUCTS.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {product.qtySold.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    {product.qtyLeft.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    {product.wishRequests.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    ${product.potentialRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t">
              <tr>
                <td className="p-4 font-medium">Totals</td>
                <td className="p-4 text-right font-medium">
                  {totalSold.toLocaleString()}
                </td>
                <td className="p-4 text-right font-medium">
                  ${totalRevenue.toLocaleString()}
                </td>
                <td className="p-4 text-right font-medium">
                  {MOCK_PRODUCTS.reduce((sum, p) => sum + p.qtyLeft, 0).toLocaleString()}
                </td>
                <td className="p-4 text-right font-medium">
                  {totalWishRequests.toLocaleString()}
                </td>
                <td className="p-4 text-right font-medium">
                  ${totalPotentialRevenue.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}