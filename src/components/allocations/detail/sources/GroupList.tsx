import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useGroups } from '@/lib/api/services';
import { useDebounce } from '@/hooks/useDebounce';

interface GroupListProps {
  selectedItems: string[];
  onItemSelect: (id: string) => void;
}

export default function GroupList({ selectedItems, onItemSelect }: GroupListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { groups, loading, error } = useGroups();

  const filteredGroups = React.useMemo(() => 
    groups.filter(group =>
      group.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (group.description || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    ),
    [groups, debouncedSearch]
  );

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Failed to load groups</p>
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
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="divide-y">
        {filteredGroups.map(group => (
          <div
            key={group.id}
            className="flex items-center gap-4 py-3"
          >
            <Checkbox
              id={group.id}
              checked={selectedItems.includes(group.id)}
              onCheckedChange={() => onItemSelect(group.id)}
            />
            <div>
              <Label htmlFor={group.id} className="font-medium">
                {group.name}
              </Label>
              {group.description && (
                <div className="text-sm text-muted-foreground">
                  {group.description}
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                {group.checkout_cart_min > 0 && `Min: ${group.checkout_cart_min} bottles`}
                {group.discount > 0 && ` • ${group.discount}% discount`}
                {group.free_shipping && ' • Free shipping'}
              </div>
            </div>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="py-4 text-center text-muted-foreground">
            No groups found
          </div>
        )}
      </div>
    </div>
  );
}