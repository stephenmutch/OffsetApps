import React from 'react';
import { AllocationHeader } from './AllocationHeader';
import { AllocationTabs } from './AllocationTabs';
import { AllocationProgress } from './AllocationProgress';
import { AllocationSales } from './AllocationSales';
import { AllocationCustomers } from './AllocationCustomers';
import { AllocationInventory } from './AllocationInventory';
import { AllocationWaitlist } from './AllocationWaitlist';
import { useAllocation } from '@/hooks/useAllocation';

export function AllocationDashboard() {
  const { allocation, loading, error } = useAllocation();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading allocation</div>;
  if (!allocation) return null;

  return (
    <div className="space-y-6">
      <AllocationHeader allocation={allocation} />
      <AllocationTabs />
      
      <div className="space-y-6">
        <AllocationProgress allocation={allocation} />
        
        <div className="grid grid-cols-2 gap-6">
          <AllocationSales allocation={allocation} />
          <AllocationCustomers allocation={allocation} />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <AllocationInventory allocation={allocation} />
          <AllocationWaitlist allocation={allocation} />
        </div>
      </div>
    </div>
  );
}