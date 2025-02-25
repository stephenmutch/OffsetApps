import React, { useState } from 'react';
import { Plus, Search, Tag, Users, FileSearch, Wine, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface IndividualAllocationsProps {
  allocation: Allocation;
}

interface CustomerSource {
  id: string;
  name: string;
  type: 'query' | 'tag' | 'group' | 'club' | 'search';
  icon: React.ElementType;
}

const CUSTOMER_SOURCES: CustomerSource[] = [
  { id: 'queries', name: 'Queries', type: 'query', icon: FileSearch },
  { id: 'tags', name: 'Tags', type: 'tag', icon: Tag },
  { id: 'groups', name: 'Groups', type: 'group', icon: Users },
  { id: 'clubs', name: 'Clubs', type: 'club', icon: Wine },
  { id: 'search', name: 'Search', type: 'search', icon: Search },
];

export function IndividualAllocations({ allocation }: IndividualAllocationsProps) {
  const [selectedSource, setSelectedSource] = useState<CustomerSource['id']>('queries');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showBatchForm, setShowBatchForm] = useState(false);

  // Mock customers for demonstration
  const customers = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleBatchAllocation = () => {
    setShowBatchForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Individual Allocations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage individual customer allocations.
          </p>
        </div>
        <Button
          onClick={handleBatchAllocation}
          disabled={selectedCustomers.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Allocation
        </Button>
      </div>

      <div className="grid grid-cols-[240px,1fr] gap-6">
        {/* Customer Source Selection */}
        <div className="space-y-4">
          <Label>Customer Source</Label>
          <RadioGroup
            value={selectedSource}
            onValueChange={setSelectedSource}
            className="space-y-2"
          >
            {CUSTOMER_SOURCES.map(source => (
              <div
                key={source.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                  ${selectedSource === source.id ? 'bg-accent border-accent-foreground/20' : 'bg-card hover:bg-accent/50'}
                `}
              >
                <RadioGroupItem value={source.id} id={source.id} className="sr-only" />
                <source.icon className="w-5 h-5" />
                <Label htmlFor={source.id} className="cursor-pointer flex-1">
                  {source.name}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Source-specific filters */}
          <div className="mt-6 space-y-4">
            <Label>Filters</Label>
            {selectedSource === 'queries' && (
              <div className="space-y-2">
                <Input placeholder="Search queries..." />
                {/* Query filters */}
              </div>
            )}
            {/* Add similar sections for other sources */}
          </div>
        </div>

        {/* Customer List */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search customers..." />
            </div>
            {selectedCustomers.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedCustomers.length} selected
              </div>
            )}
          </div>

          <div className="border rounded-lg divide-y">
            {customers.map(customer => (
              <div
                key={customer.id}
                className="flex items-center gap-4 p-4 hover:bg-accent/50"
              >
                <Checkbox
                  id={`customer-${customer.id}`}
                  checked={selectedCustomers.includes(customer.id)}
                  onCheckedChange={() => handleCustomerSelect(customer.id)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`customer-${customer.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {customer.name}
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    {customer.email}
                  </div>
                </div>
                {/* Add allocation status/actions here */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Batch Allocation Form */}
      {showBatchForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Create Allocation</h3>
              <p className="text-sm text-muted-foreground">
                Configure allocation settings for {selectedCustomers.length} selected customers.
              </p>

              {/* Allocation form fields */}
              <div className="space-y-4">
                {/* Add your allocation form fields here */}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowBatchForm(false)}>
                  Cancel
                </Button>
                <Button>
                  <Check className="w-4 h-4 mr-2" />
                  Create Allocations
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}