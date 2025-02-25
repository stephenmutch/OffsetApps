import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllocation } from '@/hooks/useAllocation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { OverallPerformance } from './OverallPerformance';
import { CustomerBehavior } from './CustomerBehavior';
import { ProductPerformance } from './ProductPerformance';
import { MarketingPerformance } from './MarketingPerformance';
import { WishAnalysis } from './WishAnalysis';

type TabType = 'overall' | 'customers' | 'products' | 'marketing' | 'wishes';

export function PreviousAllocationDetailPage() {
  const navigate = useNavigate();
  const { allocation, loading, error } = useAllocation();
  const [activeTab, setActiveTab] = useState<TabType>('overall');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overall', label: 'Overall Performance' },
    { id: 'customers', label: 'Customer Behavior' },
    { id: 'products', label: 'Product Performance' },
    { id: 'marketing', label: 'Marketing Performance' },
    { id: 'wishes', label: 'Wish Analysis' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <div className="text-lg font-medium text-gray-900">Loading Allocation</div>
        </div>
      </div>
    );
  }

  if (error || !allocation) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Allocation Not Found</h2>
          <p className="text-gray-500">The allocation you're looking for doesn't exist.</p>
          <Button
            variant="outline"
            onClick={() => navigate('/allocations')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Allocations
          </Button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overall':
        return <OverallPerformance allocation={allocation} />;
      case 'customers':
        return <CustomerBehavior allocation={allocation} />;
      case 'products':
        return <ProductPerformance allocation={allocation} />;
      case 'marketing':
        return <MarketingPerformance allocation={allocation} />;
      case 'wishes':
        return <WishAnalysis allocation={allocation} />;
      default:
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
            Back to All Allocations
          </button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {allocation.name}
            </h1>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Previous
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

          <div className="flex items-center gap-2">
            <Button variant="outline">
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`pb-4 text-sm font-medium relative ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}