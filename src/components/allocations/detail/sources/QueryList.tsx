import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useDebounce } from '@/hooks/useDebounce';

interface QueryListProps {
  selectedItems: string[];
  onItemSelect: (id: string) => void;
}

const MOCK_QUERIES = [
  { id: 'q1', name: 'High Value Customers', description: 'Customers with lifetime value > $10,000' },
  { id: 'q2', name: 'Recent Purchasers', description: 'Customers who purchased in last 30 days' },
  { id: 'q3', name: 'Club Members', description: 'Active wine club members' }
];

export default function QueryList({ selectedItems, onItemSelect }: QueryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredQueries = useMemo(() => 
    MOCK_QUERIES.filter(query =>
      query.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      query.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    ),
    [debouncedSearch]
  );

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="divide-y">
        {filteredQueries.map(query => (
          <div
            key={query.id}
            className="flex items-center gap-4 py-3"
          >
            <Checkbox
              id={query.id}
              checked={selectedItems.includes(query.id)}
              onCheckedChange={() => onItemSelect(query.id)}
            />
            <div>
              <Label htmlFor={query.id} className="font-medium">
                {query.name}
              </Label>
              <div className="text-sm text-muted-foreground">
                {query.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}