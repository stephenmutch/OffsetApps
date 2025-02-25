import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useDebounce } from '@/hooks/useDebounce';

interface TagListProps {
  selectedItems: string[];
  onItemSelect: (id: string) => void;
}

const MOCK_TAGS = [
  { id: 't1', name: 'VIP', count: 150 },
  { id: 't2', name: 'Collector', count: 75 },
  { id: 't3', name: 'Early Access', count: 200 }
];

export default function TagList({ selectedItems, onItemSelect }: TagListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredTags = useMemo(() => 
    MOCK_TAGS.filter(tag =>
      tag.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    ),
    [debouncedSearch]
  );

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="divide-y">
        {filteredTags.map(tag => (
          <div
            key={tag.id}
            className="flex items-center gap-4 py-3"
          >
            <Checkbox
              id={tag.id}
              checked={selectedItems.includes(tag.id)}
              onCheckedChange={() => onItemSelect(tag.id)}
            />
            <div className="flex-1">
              <Label htmlFor={tag.id} className="font-medium">
                {tag.name}
              </Label>
              <div className="text-sm text-muted-foreground">
                {tag.count} customers
              </div>
            </div>
            <div className="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium">
              {tag.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}