import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DiscountSettingsData {
  orderDiscount?: {
    type: 'percentage' | 'fixed';
    amount: number;
  };
  shippingDiscount?: {
    type: 'percentage' | 'fixed';
    amount: number;
    method: string;
  };
}

interface DiscountSettingsProps {
  data: DiscountSettingsData;
  onUpdate: (data: DiscountSettingsData) => void;
}

const SHIPPING_METHODS = [
  { id: 'ground', name: 'Ground Shipping' },
  { id: '2day', name: '2-Day Air' },
  { id: 'overnight', name: 'Overnight' },
];

export function DiscountSettings({ data, onUpdate }: DiscountSettingsProps) {
  const [hasOrderDiscount, setHasOrderDiscount] = useState(!!data.orderDiscount);
  const [hasShippingDiscount, setHasShippingDiscount] = useState(!!data.shippingDiscount);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Discount Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure order and shipping discounts for this allocation.
        </p>
        <div className="mt-2 p-4 bg-muted/50 rounded-md">
          <p className="text-sm text-muted-foreground">
            Note: These settings can be customized at the tier level later.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Discount */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasOrderDiscount"
              checked={hasOrderDiscount}
              onCheckedChange={(checked) => {
                setHasOrderDiscount(checked as boolean);
                if (!checked) {
                  onUpdate({ ...data, orderDiscount: undefined });
                }
              }}
            />
            <Label htmlFor="hasOrderDiscount">Enable Order Discount</Label>
          </div>

          {hasOrderDiscount && (
            <div className="ml-6 space-y-4">
              <RadioGroup
                value={data.orderDiscount?.type}
                onValueChange={(value) => onUpdate({
                  ...data,
                  orderDiscount: { type: value as 'percentage' | 'fixed', amount: data.orderDiscount?.amount || 0 }
                })}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="orderDiscountPercentage" />
                  <Label htmlFor="orderDiscountPercentage">Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="orderDiscountFixed" />
                  <Label htmlFor="orderDiscountFixed">Fixed Amount</Label>
                </div>
              </RadioGroup>

              <div className="relative w-48">
                {data.orderDiscount?.type === 'fixed' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                )}
                <Input
                  type="number"
                  value={data.orderDiscount?.amount || ''}
                  onChange={(e) => onUpdate({
                    ...data,
                    orderDiscount: {
                      type: data.orderDiscount?.type || 'percentage',
                      amount: parseFloat(e.target.value)
                    }
                  })}
                  className={data.orderDiscount?.type === 'fixed' ? 'pl-7' : ''}
                  placeholder="0"
                  min="0"
                  step={data.orderDiscount?.type === 'percentage' ? '1' : '0.01'}
                />
                {data.orderDiscount?.type === 'percentage' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Shipping Discount */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasShippingDiscount"
              checked={hasShippingDiscount}
              onCheckedChange={(checked) => {
                setHasShippingDiscount(checked as boolean);
                if (!checked) {
                  onUpdate({ ...data, shippingDiscount: undefined });
                }
              }}
            />
            <Label htmlFor="hasShippingDiscount">Enable Shipping Discount</Label>
          </div>

          {hasShippingDiscount && (
            <div className="ml-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shippingMethod">Shipping Method</Label>
                <Select
                  value={data.shippingDiscount?.method || ''}
                  onValueChange={(value) => onUpdate({
                    ...data,
                    shippingDiscount: {
                      type: data.shippingDiscount?.type || 'percentage',
                      amount: data.shippingDiscount?.amount || 0,
                      method: value
                    }
                  })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIPPING_METHODS.map(method => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <RadioGroup
                value={data.shippingDiscount?.type}
                onValueChange={(value) => onUpdate({
                  ...data,
                  shippingDiscount: {
                    type: value as 'percentage' | 'fixed',
                    amount: data.shippingDiscount?.amount || 0,
                    method: data.shippingDiscount?.method || ''
                  }
                })}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="shippingDiscountPercentage" />
                  <Label htmlFor="shippingDiscountPercentage">Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="shippingDiscountFixed" />
                  <Label htmlFor="shippingDiscountFixed">Fixed Amount</Label>
                </div>
              </RadioGroup>

              <div className="relative w-48">
                {data.shippingDiscount?.type === 'fixed' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                )}
                <Input
                  type="number"
                  value={data.shippingDiscount?.amount || ''}
                  onChange={(e) => onUpdate({
                    ...data,
                    shippingDiscount: {
                      type: data.shippingDiscount?.type || 'percentage',
                      amount: parseFloat(e.target.value),
                      method: data.shippingDiscount?.method || ''
                    }
                  })}
                  className={data.shippingDiscount?.type === 'fixed' ? 'pl-7' : ''}
                  placeholder="0"
                  min="0"
                  step={data.shippingDiscount?.type === 'percentage' ? '1' : '0.01'}
                />
                {data.shippingDiscount?.type === 'percentage' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}