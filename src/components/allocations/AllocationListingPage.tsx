import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, DollarSign, Calendar, Wine, Copy } from 'lucide-react';
import { useAllocationStore } from '@/stores/allocationStore';
import { DuplicateAllocationDialog } from './DuplicateAllocationDialog';

export function AllocationListingPage() {
  const navigate = useNavigate();
  const { 
    allocations, 
    stats, 
    filters,
    loading,
    fetchAllocations, 
    setFilters 
  } = useAllocationStore();

  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<any>(null);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  const handleDuplicate = (allocation: any) => {
    setSelectedAllocation(allocation);
    setDuplicateDialogOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Allocations</h1>
          <p className="mt-1 text-gray-500">Manage your wine allocations</p>
        </div>
        <Button 
          size="lg"
          onClick={() => navigate('/allocations/new')}
        >
          Create Allocation
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Wine className="h-5 w-5" />
            <span className="text-sm">Total Allocations</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{stats.totalAllocations}</span>
            <span className="text-sm text-gray-500">{stats.activeAllocations} active</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm">Total Revenue</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">
              ${(stats.totalRevenue / 1000000).toFixed(1)}M
            </span>
            <span className="text-sm text-green-600">
              +{stats.revenueChange}% from last year
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="h-5 w-5" />
            <span className="text-sm">Total Customers</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">
              {stats.totalCustomers.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">Across all allocations</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">Avg. Duration</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{stats.avgDuration} days</span>
            <span className="text-sm text-gray-500">Per allocation</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select 
            value={filters.status}
            onValueChange={(value) => setFilters({ status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="previous">Previous</SelectItem>
            </SelectContent>
          </Select>

          <Input 
            placeholder="Filter by product" 
            value={filters.product}
            onChange={(e) => setFilters({ product: e.target.value })}
          />
          
          <Input 
            type="date" 
            value={filters.date}
            onChange={(e) => setFilters({ date: e.target.value })}
          />
        </div>
      </div>

      {/* Allocation List */}
      <div className="space-y-4">
        {allocations.map((allocation) => (
          <AllocationCard
            key={allocation.id}
            id={allocation.id}
            name={allocation.name}
            status={allocation.status}
            dateRange={`${new Date(allocation.start_date).toLocaleDateString()} - ${new Date(allocation.end_date).toLocaleDateString()}`}
            progress={calculateProgress(allocation)}
            customers={allocation.total_customers}
            revenue={allocation.current_revenue}
            products={allocation.allocation_products.map((p: any) => p.product_id)}
            type={allocation.allocation_type}
            onDuplicate={() => handleDuplicate(allocation)}
          />
        ))}

        {allocations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">No allocations found</p>
          </div>
        )}
      </div>

      <DuplicateAllocationDialog
        allocation={selectedAllocation}
        isOpen={duplicateDialogOpen}
        onClose={() => {
          setDuplicateDialogOpen(false);
          setSelectedAllocation(null);
        }}
      />
    </div>
  );
}

function calculateProgress(allocation: any): number {
  const start = new Date(allocation.start_date).getTime();
  const end = new Date(allocation.end_date).getTime();
  const now = Date.now();

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
}

interface AllocationCardProps {
  id: string;
  name: string;
  status: string;
  dateRange: string;
  progress: number;
  customers: number;
  revenue: number;
  products: string[];
  type: 'individual' | 'tier';
  onDuplicate: () => void;
}

function AllocationCard({
  id,
  name,
  status,
  dateRange,
  progress,
  customers,
  revenue,
  products,
  type,
  onDuplicate
}: AllocationCardProps) {
  const navigate = useNavigate();
  
  const statusColors = {
    upcoming: 'bg-yellow-100 text-yellow-800',
    open: 'bg-green-100 text-green-800',
    previous: 'bg-blue-100 text-blue-800'
  };

  const handleView = () => {
    switch (status) {
      case 'open':
        navigate(`/allocations/${id}/open`);
        break;
      case 'previous':
        navigate(`/allocations/${id}/previous`);
        break;
      default:
        navigate(`/allocations/${id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold">{name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{dateRange}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onDuplicate}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" onClick={handleView}>View Details</Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Allocation Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Customers</span>
            <p className="text-lg font-medium">{customers?.toLocaleString() || 0}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Revenue</span>
            <p className="text-lg font-medium">
              ${(revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div>
          <span className="text-sm text-gray-500">Products</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {products.map(product => (
              <span 
                key={product}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {product}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm text-gray-500">Type</span>
          <p className="text-sm font-medium mt-1">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </p>
        </div>
      </div>
    </div>
  );
}