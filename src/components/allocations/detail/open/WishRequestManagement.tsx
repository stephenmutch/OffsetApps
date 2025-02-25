import React, { useState } from 'react';
import { Gift, Filter, ChevronDown, Edit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface WishRequestManagementProps {
  allocation: Allocation;
}

interface WishRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  memberSince: string;
  tier: string;
  allocationAmount: number;
  completion: number;
  items: number;
  type: string;
  amount: number;
}

// Mock data - replace with actual data from Supabase
const MOCK_WISH_REQUESTS: WishRequest[] = [
  {
    id: 'wr1',
    customerId: 'c1',
    customerName: 'Brooklyn Simmons',
    customerEmail: 'deanna.curtis@example.com',
    memberSince: '23 years',
    tier: '1',
    allocationAmount: 456.32,
    completion: 100,
    items: 4,
    type: 'Wish request Origin order 3',
    amount: 1678.89
  },
  {
    id: 'wr2',
    customerId: 'c2',
    customerName: 'Macy Henderson',
    customerEmail: 'deanna.curtis@example.com',
    memberSince: '24 years',
    tier: '1',
    allocationAmount: 456.32,
    completion: 100,
    items: 4,
    type: 'Wish request Origin order 3',
    amount: 1678.89
  },
  {
    id: 'wr3',
    customerId: 'c3',
    customerName: 'Darrell Steward',
    customerEmail: 'deanna.curtis@example.com',
    memberSince: '2 years',
    tier: '1',
    allocationAmount: 576.25,
    completion: 100,
    items: 4,
    type: 'Wish request Origin order 3',
    amount: 202.87
  }
];

interface TierWishBreakdown {
  tier: string;
  requests: number;
  revenue: number;
  color: string;
  percentage: number;
}

const MOCK_TIER_BREAKDOWN: TierWishBreakdown[] = [
  { tier: 'Tier 1', requests: 6072, revenue: 3631260, color: 'rgb(239, 68, 68)', percentage: 71 },
  { tier: 'Tier 2', requests: 1956, revenue: 1205380, color: 'rgb(59, 130, 246)', percentage: 23 },
  { tier: 'Tier 3', requests: 357, revenue: 347485, color: 'rgb(147, 197, 253)', percentage: 4 },
  { tier: 'Tier 4', requests: 144, revenue: 515000, color: 'rgb(30, 41, 59)', percentage: 2 },
  { tier: 'Tier 5', requests: 0, revenue: 0, color: 'rgb(241, 245, 249)', percentage: 0 }
];

export function WishRequestManagement({ allocation }: WishRequestManagementProps) {
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalWishRequests = 8469;
  const totalBottlesRequested = 33876;
  const totalBottlesAvailable = 224399;
  const potentialRevenue = 3556980;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(new Set(MOCK_WISH_REQUESTS.map(r => r.id)));
    } else {
      setSelectedRequests(new Set());
    }
  };

  const handleSelectRequest = (requestId: string) => {
    const newSelected = new Set(selectedRequests);
    if (newSelected.has(requestId)) {
      newSelected.delete(requestId);
    } else {
      newSelected.add(requestId);
    }
    setSelectedRequests(newSelected);
  };

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Gift className="text-blue-600" size={20} />
          <div className="flex-1">
            <span className="text-blue-900">
              Grant {totalWishRequests.toLocaleString()} wishes to sell {Math.round((totalBottlesRequested/totalBottlesAvailable) * 100)}% of your remaining inventory
            </span>
          </div>
          <Button variant="outline" className="text-blue-600 hover:text-blue-700">
            VIEW WISH REQUESTS
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-6">
        {/* Tier Breakdown */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-6">Breakdown by Tier</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 h-4 overflow-hidden rounded-full">
              {MOCK_TIER_BREAKDOWN.map((tier, idx) => (
                <div
                  key={tier.tier}
                  style={{
                    width: `${tier.percentage}%`,
                    backgroundColor: tier.color
                  }}
                  className="flex flex-col justify-center"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4 mt-6">
            {MOCK_TIER_BREAKDOWN.map(tier => (
              <div key={tier.tier} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  <span className="font-medium">{tier.tier}</span>
                  <span className="text-gray-500">
                    ({tier.requests.toLocaleString()} requests)
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${tier.revenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {tier.percentage}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Total Wish Requests</h3>
            <div className="text-3xl font-semibold">
              {totalWishRequests.toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              From {(totalWishRequests * 0.8).toFixed(0)} unique customers
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Potential Revenue</h3>
            <div className="text-3xl font-semibold">
              ${potentialRevenue.toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              If all wishes are granted
            </div>
          </div>
        </div>
      </div>

      {/* Wish Requests Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Individual Wish Requests</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {totalBottlesRequested.toLocaleString()} / {totalBottlesAvailable.toLocaleString()}
              </span>
              <span className="text-sm font-medium">bottles asked for</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {MOCK_TIER_BREAKDOWN.map(tier => (
                  <SelectItem key={tier.tier} value={tier.tier}>
                    {tier.tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedRequests.size === MOCK_WISH_REQUESTS.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-500">
                {selectedRequests.size} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Selected
              </Button>
              <Button size="sm">
                <Check className="w-4 h-4 mr-2" />
                Grant Selected
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="w-8 p-4">
                  <Checkbox
                    checked={selectedRequests.size === MOCK_WISH_REQUESTS.length}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Customer</th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Member For</th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Tier</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Allocation Amount</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Completion</th>
                <th className="text-center text-sm font-medium text-gray-500 p-4">Items</th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Type</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Amount</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_WISH_REQUESTS.map(request => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedRequests.has(request.id)}
                      onCheckedChange={() => handleSelectRequest(request.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{request.customerName}</div>
                      <div className="text-sm text-gray-500">{request.customerEmail}</div>
                    </div>
                  </td>
                  <td className="p-4">{request.memberSince}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Tier {request.tier}
                    </span>
                  </td>
                  <td className="p-4 text-right">${request.allocationAmount}</td>
                  <td className="p-4 text-right">{request.completion}%</td>
                  <td className="p-4 text-center">{request.items}</td>
                  <td className="p-4">{request.type}</td>
                  <td className="p-4 text-right">${request.amount}</td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm">
                      Grant Wish
                    </Button>
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