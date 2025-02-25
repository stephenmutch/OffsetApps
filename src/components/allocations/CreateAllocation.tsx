import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllocationStore } from '@/stores/allocationStore';
import { AllocationWizard } from './wizard/AllocationWizard';
import { ArrowLeft } from 'lucide-react';

export function CreateAllocation() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/allocations')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Allocations
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Create New Allocation</h1>
        <p className="mt-2 text-gray-600">
          Configure your allocation settings through this step-by-step wizard.
        </p>
      </div>

      <AllocationWizard />
    </div>
  );
}