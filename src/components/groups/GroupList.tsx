import React from 'react';
import { useGroups } from '@/lib/api/services';
import { Loader2, AlertCircle } from 'lucide-react';

export function GroupList() {
  const { groups, loading, error } = useGroups();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <div className="text-sm text-gray-500">Loading groups...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <div className="text-sm text-gray-500">Failed to load groups</div>
          <div className="text-xs text-gray-400">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Groups</h2>
      <div className="grid gap-4">
        {groups.map(group => (
          <div 
            key={group.id}
            className="bg-white p-4 rounded-lg border hover:border-blue-200 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{group.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{group.description || 'No description'}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {group.checkout_cart_min > 0 && (
                    <span className="text-gray-500">
                      Min: {group.checkout_cart_min} bottles
                    </span>
                  )}
                </div>
                {group.discount > 0 && (
                  <div className="text-sm text-green-600 mt-1">
                    {group.discount}% discount
                  </div>
                )}
                {group.free_shipping && (
                  <div className="text-sm text-blue-600 mt-1">
                    Free shipping
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No groups found
          </div>
        )}
      </div>
    </div>
  );
}