import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Allocation } from '@/types/allocation';

interface AllocationHeaderProps {
  allocation: Allocation;
}

export function AllocationHeader({ allocation }: AllocationHeaderProps) {
  const daysRemaining = Math.ceil(
    (new Date(allocation.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link 
          to="/allocations" 
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to All Allocations
        </Link>
      </div>
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{allocation.name}</h1>
          <div className="mt-1 text-gray-500">
            {allocation.totalCustomers.toLocaleString()} customers
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {daysRemaining} days remaining
          </div>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Edit Allocation
          </button>
        </div>
      </div>
    </div>
  );
}