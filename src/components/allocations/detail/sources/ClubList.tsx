import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useClubs } from '@/lib/api/services';
import { useDebounce } from '@/hooks/useDebounce';

interface ClubListProps {
  selectedItems: string[];
  onItemSelect: (id: string) => void;
}

export default function ClubList({ selectedItems, onItemSelect }: ClubListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { clubs, loading, error } = useClubs();

  const filteredClubs = React.useMemo(() => 
    clubs.filter(club =>
      club.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (club.description || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    ),
    [clubs, debouncedSearch]
  );

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading clubs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Failed to load clubs</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="divide-y">
        {filteredClubs.map(club => (
          <div
            key={club.id}
            className="flex items-center gap-4 py-3"
          >
            <Checkbox
              id={club.id}
              checked={selectedItems.includes(club.id)}
              onCheckedChange={() => onItemSelect(club.id)}
            />
            <div>
              <Label htmlFor={club.id} className="font-medium">
                {club.name}
              </Label>
              {club.description && (
                <div className="text-sm text-muted-foreground">
                  {club.description}
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                {club.discount > 0 && `${club.discount}% discount`}
                {club.discount > 0 && club.free_shipping && ' • '}
                {club.free_shipping && 'Free shipping'}
              </div>
            </div>
          </div>
        ))}

        {filteredClubs.length === 0 && (
          <div className="py-4 text-center text-muted-foreground">
            No clubs found
          </div>
        )}
      </div>
    </div>
  );
}