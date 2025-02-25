import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllocation } from '@/hooks/useAllocation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy } from 'lucide-react';
import { AllocationConfiguration } from './AllocationConfiguration';
import { AllocationTiers } from './AllocationTiers';
import { IndividualAllocations } from './IndividualAllocations';
import { DuplicateAllocationDialog } from '../DuplicateAllocationDialog';
import { AllocationOverview } from './AllocationOverview';

export function AllocationDetailPage() {
  const { allocation, loading, error } = useAllocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'configuration' | 'customers'>('overview');
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (error || !allocation) {
    return <div>Error loading allocation</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/allocations')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to All Allocations
          </button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {allocation.name}
            </h1>
            <p className="mt-1 text-gray-500">
              {allocation.status === 'draft' ? 'Configure allocation details before opening' : 'Manage your allocation'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setDuplicateDialogOpen(true)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline">Save Draft</Button>
            <Button>Publish Allocation</Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          <button
            className={`pb-4 text-sm font-medium relative ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`pb-4 text-sm font-medium relative ${
              activeTab === 'configuration'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('configuration')}
          >
            Configuration
          </button>
          <button
            className={`pb-4 text-sm font-medium relative ${
              activeTab === 'customers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('customers')}
          >
            {allocation.allocation_type === 'tier' ? 'Tiers' : 'Individual Allocations'}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'overview' ? (
          <AllocationOverview allocation={allocation} />
        ) : activeTab === 'configuration' ? (
          <AllocationConfiguration allocation={allocation} />
        ) : allocation.allocation_type === 'tier' ? (
          <AllocationTiers allocation={allocation} />
        ) : (
          <IndividualAllocations allocation={allocation} />
        )}
      </div>

      <DuplicateAllocationDialog
        allocation={allocation}
        isOpen={duplicateDialogOpen}
        onClose={() => setDuplicateDialogOpen(false)}
      />
    </div>
  );
}