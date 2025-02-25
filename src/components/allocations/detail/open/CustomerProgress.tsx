import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface CustomerProgressProps {
  allocation: Allocation;
}

interface TierProgress {
  id: string;
  name: string;
  total: number;
  purchasers: number;
  viewed: number;
  completion: number;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  tier?: string;
  viewed_at?: string;
  order_status?: 'completed' | 'pending' | null;
  order_value?: number;
}

// Mock customer data generator to ensure unique IDs
const generateMockCustomer = (customerId: string, index: number): CustomerData => {
  return {
    id: `${customerId}-${index}`, // Ensure unique ID by combining customer ID and index
    name: `Customer ${index + 1}`,
    email: `customer${index + 1}@example.com`,
    viewed_at: new Date().toISOString(),
    order_status: Math.random() > 0.5 ? 'completed' : null,
    order_value: Math.random() > 0.5 ? Math.round(Math.random() * 5000) : undefined
  };
};

export function CustomerProgress({ allocation }: CustomerProgressProps) {
  const [loading, setLoading] = useState(true);
  const [tierProgress, setTierProgress] = useState<TierProgress[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tier progress data
        const { data: tiers } = await supabase
          .from('allocation_tiers')
          .select(`
            id,
            name,
            customer_count,
            customer_tiers (
              id,
              has_purchased
            )
          `)
          .eq('allocation_id', allocation.id);

        if (tiers) {
          setTierProgress(tiers.map(tier => ({
            id: tier.id,
            name: tier.name,
            total: tier.customer_count,
            purchasers: tier.customer_tiers?.filter(ct => ct.has_purchased).length || 0,
            viewed: tier.customer_tiers?.length || 0,
            completion: tier.customer_count > 0 
              ? ((tier.customer_tiers?.filter(ct => ct.has_purchased).length || 0) / tier.customer_count) * 100 
              : 0
          })));
        }

        // Fetch customer data
        const { data: customerData } = await supabase
          .from('customer_tiers')
          .select(`
            customer_id,
            tier_id,
            has_purchased,
            last_engagement,
            allocation_tiers (
              name
            )
          `)
          .eq('allocation_id', allocation.id);

        if (customerData) {
          const mockCustomers = customerData.map((customer, index) => {
            const mockCustomer = generateMockCustomer(customer.customer_id, index);
            return {
              ...mockCustomer,
              tier: customer.allocation_tiers?.name,
              viewed_at: customer.last_engagement,
              order_status: customer.has_purchased ? 'completed' : null,
              order_value: customer.has_purchased ? Math.round(Math.random() * 5000) : undefined
            };
          });
          setCustomers(mockCustomers);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [allocation.id]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'purchased' && customer.order_status === 'completed') ||
      (statusFilter === 'pending' && customer.order_status === 'pending') ||
      (statusFilter === 'not_purchased' && !customer.order_status);

    const matchesTier = tierFilter === 'all' || customer.tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  if (loading) {
    return <div className="text-center py-12">Loading customer data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Email Reminder Banner */}
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Mail className="text-purple-600" size={20} />
          <div className="flex-1">
            <span className="text-purple-900">
              2,266 customers haven't made a purchase yet. Sending a reminder email could generate $1,867,000 in revenue.
            </span>
          </div>
          <Button variant="outline" className="text-purple-600 hover:text-purple-700">
            Send Reminder
          </Button>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Tier Progress</h3>
        <div className="space-y-4">
          {tierProgress.map(tier => (
            <div key={tier.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{tier.name}</h4>
                  <p className="text-sm text-gray-500">
                    {tier.purchasers} of {tier.total} customers purchased
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{Math.round(tier.completion)}%</div>
                  <p className="text-sm text-gray-500">completion</p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${tier.completion}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Customers</h3>
          <div className="mt-4 flex gap-4">
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="purchased">Purchased</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="not_purchased">Not Purchased</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {tierProgress.map(tier => (
                  <SelectItem key={tier.id} value={tier.name}>
                    {tier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 p-4">Customer</th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Tier</th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Viewed</th>
                <th className="text-left text-sm font-medium text-gray-500 p-4">Status</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Order Value</th>
                <th className="text-right text-sm font-medium text-gray-500 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {customer.tier || 'No Tier'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {customer.viewed_at 
                      ? new Date(customer.viewed_at).toLocaleDateString()
                      : 'Not viewed'
                    }
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.order_status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : customer.order_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.order_status === 'completed'
                        ? 'Purchased'
                        : customer.order_status === 'pending'
                        ? 'Pending'
                        : 'Not Purchased'
                      }
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {customer.order_value 
                      ? `$${customer.order_value.toLocaleString()}`
                      : '-'
                    }
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
    </div>
  );
}