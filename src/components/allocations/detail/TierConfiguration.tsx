import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface TierConfigurationProps {
  allocation: Allocation;
  onChange: (config: any) => void;
  value: any;
}

export function TierConfiguration({ allocation, onChange, value }: TierConfigurationProps) {
  const handleOverrideChange = (section: string, enabled: boolean) => {
    onChange({
      ...value,
      overrides: {
        ...value.overrides,
        [section]: enabled ? (value.overrides[section] || {}) : null
      }
    });
  };

  const updateOverride = (section: string, field: string, fieldValue: any) => {
    onChange({
      ...value,
      overrides: {
        ...value.overrides,
        [section]: {
          ...(value.overrides[section] || {}),
          [field]: fieldValue
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Purchase Requirements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Purchase Requirements</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="override-requirements"
              checked={!!value.overrides?.requirements}
              onCheckedChange={(checked) => handleOverrideChange('requirements', !!checked)}
            />
            <Label htmlFor="override-requirements" className="text-sm">Override defaults</Label>
          </div>
        </div>

        {value.overrides?.requirements && (
          <div className="ml-6 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Bottles</Label>
                <Input
                  type="number"
                  min="0"
                  value={value.overrides.requirements.cartMin || ''}
                  onChange={(e) => updateOverride('requirements', 'cartMin', parseInt(e.target.value))}
                  placeholder={allocation.cart_min?.toString()}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Bottles</Label>
                <Input
                  type="number"
                  min="0"
                  value={value.overrides.requirements.cartMax || ''}
                  onChange={(e) => updateOverride('requirements', 'cartMax', parseInt(e.target.value))}
                  placeholder={allocation.cart_max?.toString()}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Minimum Purchase Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-7"
                  value={value.overrides.requirements.minAmount || ''}
                  onChange={(e) => updateOverride('requirements', 'minAmount', parseFloat(e.target.value))}
                  placeholder={allocation.min_amount?.toString()}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Discounts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Order Discounts</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="override-discounts"
              checked={!!value.overrides?.discounts}
              onCheckedChange={(checked) => handleOverrideChange('discounts', !!checked)}
            />
            <Label htmlFor="override-discounts" className="text-sm">Override defaults</Label>
          </div>
        </div>

        {value.overrides?.discounts && (
          <div className="ml-6 space-y-4">
            <RadioGroup
              value={value.overrides.discounts.type || 'percentage'}
              onValueChange={(type) => updateOverride('discounts', 'type', type)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Percentage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed Amount</Label>
              </div>
            </RadioGroup>

            <div className="relative">
              {value.overrides.discounts.type === 'fixed' && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              )}
              <Input
                type="number"
                min="0"
                step={value.overrides.discounts.type === 'percentage' ? '1' : '0.01'}
                className={value.overrides.discounts.type === 'fixed' ? 'pl-7' : ''}
                value={value.overrides.discounts.amount || ''}
                onChange={(e) => updateOverride('discounts', 'amount', parseFloat(e.target.value))}
                placeholder={allocation.order_discount_amount?.toString()}
              />
              {value.overrides.discounts.type === 'percentage' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Shipping Discounts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Shipping Discounts</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="override-shipping"
              checked={!!value.overrides?.shipping}
              onCheckedChange={(checked) => handleOverrideChange('shipping', !!checked)}
            />
            <Label htmlFor="override-shipping" className="text-sm">Override defaults</Label>
          </div>
        </div>

        {value.overrides?.shipping && (
          <div className="ml-6 space-y-4">
            <div className="space-y-2">
              <Label>Shipping Method</Label>
              <Select
                value={value.overrides.shipping.method || ''}
                onValueChange={(method) => updateOverride('shipping', 'method', method)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ground">Ground Shipping</SelectItem>
                  <SelectItem value="2day">2-Day Air</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <RadioGroup
              value={value.overrides.shipping.type || 'percentage'}
              onValueChange={(type) => updateOverride('shipping', 'type', type)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="shipping-percentage" />
                <Label htmlFor="shipping-percentage">Percentage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="shipping-fixed" />
                <Label htmlFor="shipping-fixed">Fixed Amount</Label>
              </div>
            </RadioGroup>

            <div className="relative">
              {value.overrides.shipping.type === 'fixed' && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              )}
              <Input
                type="number"
                min="0"
                step={value.overrides.shipping.type === 'percentage' ? '1' : '0.01'}
                className={value.overrides.shipping.type === 'fixed' ? 'pl-7' : ''}
                value={value.overrides.shipping.amount || ''}
                onChange={(e) => updateOverride('shipping', 'amount', parseFloat(e.target.value))}
                placeholder={allocation.shipping_discount_amount?.toString()}
              />
              {value.overrides.shipping.type === 'percentage' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Overrides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Product Settings</Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="override-products"
              checked={!!value.overrides?.products}
              onCheckedChange={(checked) => handleOverrideChange('products', !!checked)}
            />
            <Label htmlFor="override-products" className="text-sm">Override defaults</Label>
          </div>
        </div>

        {value.overrides?.products && (
          <div className="ml-6 space-y-4">
            <div className="space-y-2">
              <Label>Product Selection</Label>
              <p className="text-sm text-muted-foreground">
                Configure product-specific overrides in the next step
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}