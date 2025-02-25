import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PurchaseRequirementsData {
  cartMin?: number;
  cartMax?: number;
  minAmount?: number;
}

interface PurchaseRequirementsProps {
  data: PurchaseRequirementsData;
  onUpdate: (data: PurchaseRequirementsData) => void;
}

export function PurchaseRequirements({ data, onUpdate }: PurchaseRequirementsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Purchase Requirements</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the purchase limits and requirements for this allocation.
        </p>
        <div className="mt-2 p-4 bg-muted/50 rounded-md">
          <p className="text-sm text-muted-foreground">
            Note: These settings can be customized at the tier level later.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cartMin">Cart Minimum (bottles)</Label>
            <Input
              type="number"
              id="cartMin"
              min="0"
              value={data.cartMin || ''}
              onChange={(e) => onUpdate({ ...data, cartMin: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cartMax">Cart Maximum (bottles)</Label>
            <Input
              type="number"
              id="cartMax"
              min="0"
              value={data.cartMax || ''}
              onChange={(e) => onUpdate({ ...data, cartMax: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minAmount">Minimum Dollar Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              type="number"
              id="minAmount"
              min="0"
              step="0.01"
              value={data.minAmount || ''}
              onChange={(e) => onUpdate({ ...data, minAmount: parseFloat(e.target.value) })}
              className="pl-7"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}