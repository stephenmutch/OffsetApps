import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllocation } from '@/hooks/useAllocation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { OverallProgress } from './OverallProgress';
import { CustomerProgress } from './CustomerProgress';
import { InventoryManagement } from './InventoryManagement';
import { WishRequestManagement } from './WishRequestManagement';
import { TierPerformance } from './TierPerformance';
import { CampaignManagement } from './CampaignManagement';

type TabType = 'overall' | 'customers' | 'inventory' | 'wishes' | 'tiers' | 'campaigns';

export function OpenAllocationDetailPage() {
  const { allocation, loading, error } = useAllocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overall');

  console.log('[Debug] OpenAllocationDetailPage - Initial render');
  console.log('[Debug] Loading state:', loading);
  console.log('[Debug] Error state:', error);
  console.log('[Debug] Allocation data:', allocation);

  if (loading) {
    console.log('[Debug] Rendering loading state');
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (error || !allocation) {
    console.log('[Debug] Rendering error state:', error);
    return <div>Error loading allocation</div>;
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overall', label: 'Overall Progress' },
    { id: 'customers', label: 'Customer Progress' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'wishes', label: 'Wish Request Management' },
    { id: 'tiers', label: 'Tier Performance' },
    { id: 'campaigns', label: 'Campaigns' }
  ];

  console.log('[Debug] Available tabs:', tabs);
  console.log('[Debug] Current active tab:', activeTab);

  const renderTabContent = () => {
    console.log('[Debug] Rendering tab content for:', activeTab);
    switch (activeTab) {
      case 'overall':
        return <OverallProgress allocation={allocation} />;
      case 'customers':
        return <CustomerProgress allocation={allocation} />;
      case 'inventory':
        return <InventoryManagement allocation={allocation} />;
      case 'wishes':
        return <WishRequestManagement allocation={allocation} />;
      case 'tiers':
        return <TierPerformance allocation={allocation} />;
      case 'campaigns':
        return <CampaignManagement allocation={allocation} />;
      default:
        console.log('[Debug] No matching tab content for:', activeTab);
        return null;
    }
  };

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
            Back to All Allocations...
          </button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {allocation.name}
            </h1>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {allocation.status.charAt(0).toUpperCase() + allocation.status.slice(1)}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">
                  {new Date(allocation.start_date).toLocaleDateString()} - {new Date(allocation.end_date).toLocaleDateString()}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">
                  {allocation.total_customers?.toLocaleString()} customers
                </span>
              </div>
            </div>
          </div>

          <Button onClick={() => navigate(`/allocations/${allocation.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Allocation
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          {tabs.map(tab => {
            console.log('[Debug] Rendering tab:', tab.id, 'Active:', activeTab === tab.id);
            return (
              <button
                key={tab.id}
                className={`pb-4 text-sm font-medium relative ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => {
                  console.log('[Debug] Tab clicked:', tab.id);
                  setActiveTab(tab.id);
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}