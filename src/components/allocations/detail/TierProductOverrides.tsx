import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];
type AllocationProduct = Database['public']['Tables']['allocation_products']['Row'];

interface TierProductOverridesProps {
  allocation: Allocation;
  tierId?: string;
  initialOverrides?: Record<string, ProductOverride>;
  onSave?: (overrides: Record<string, ProductOverride>) => void;
  onClose: () => void;
}

interface ProductOverride {
  productId: string;
  overridePrice?: number;
  minPurchase?: number;
  maxPurchase?: number;
  allowWishRequests: boolean;
  wishRequestMin?: number;
  wishRequestMax?: number;
}

export function TierProductOverrides({ 
  allocation, 
  tierId, 
  initialOverrides = {}, 
  onSave,
  onClose 
}: TierProductOverridesProps) {
  const [products, setProducts] = useState<AllocationProduct[]>([]);
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>(initialOverrides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch allocation products
        const { data: allocationProducts, error: productsError } = await supabase
          .from('allocation_products')
          .select('*')
          .eq('allocation_id', allocation.id);

        if (productsError) throw productsError;

        setProducts(allocationProducts || []);

        // If editing an existing tier, fetch its overrides
        if (tierId) {
          const { data: existingOverrides, error: overridesError } = await supabase
            .from('tier_product_overrides')
            .select('*')
            .eq('tier_id', tierId);

          if (overridesError) throw overridesError;

          // Convert existing overrides to state format
          const overridesMap: Record<string, ProductOverride> = {};
          existingOverrides?.forEach(override => {
            overridesMap[override.product_id] = {
              productId: override.product_id,
              overridePrice: override.override_price,
              minPurchase: override.min_purchase,
              maxPurchase: override.max_purchase,
              allowWishRequests: override.allow_wish_requests,
              wishRequestMin: override.wish_request_min,
              wishRequestMax: override.wish_request_max
            };
          });
          setOverrides(overridesMap);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [allocation.id, tierId]);

  const handleOverrideChange = (productId: string, field: keyof ProductOverride, value: any) => {
    setOverrides(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { productId, allowWishRequests: false }),
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (onSave) {
      // Creation mode - return overrides to parent
      onSave(overrides);
    } else if (tierId) {
      // Edit mode - save to database
      try {
        // First, delete any existing overrides
        await supabase
          .from('tier_product_overrides')
          .delete()
          .eq('tier_id', tierId);

        // Insert new overrides
        const overridesToInsert = Object.values(overrides).map(override => ({
          tier_id: tierId,
          product_id: override.productId,
          override_price: override.overridePrice,
          min_purchase: override.minPurchase,
          max_purchase: override.maxPurchase,
          allow_wish_requests: override.allowWishRequests,
          wish_request_min: override.wishRequestMin,
          wish_request_max: override.wishRequestMax
        }));

        const { error } = await supabase
          .from('tier_product_overrides')
          .insert(overridesToInsert);

        if (error) throw error;

        // Update tier_overrides to indicate product overrides exist
        await supabase
          .from('tier_overrides')
          .upsert({
            tier_id: tierId,
            has_product_overrides: true
          });

        onClose();
      } catch (error) {
        console.error('Error saving product overrides:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Product Overrides</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure product-specific settings for this tier.
        </p>
      </div>

      <div className="space-y-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 space-y-4">
            <div>
              <h4 className="font-medium">{product.product_id}</h4>
              <p className="text-sm text-muted-foreground">
                Base Price: ${product.override_price || 'Default'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Override Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={overrides[product.id]?.overridePrice || ''}
                    onChange={(e) => handleOverrideChange(
                      product.id,
                      'overridePrice',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )}
                    className="pl-7"
                    placeholder={(product.override_price || '').toString()}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Purchase</Label>
                  <Input
                    type="number"
                    value={overrides[product.id]?.minPurchase || ''}
                    onChange={(e) => handleOverrideChange(
                      product.id,
                      'minPurchase',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )}
                    placeholder={(product.min_purchase || '').toString()}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Purchase</Label>
                  <Input
                    type="number"
                    value={overrides[product.id]?.maxPurchase || ''}
                    onChange={(e) => handleOverrideChange(
                      product.id,
                      'maxPurchase',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )}
                    placeholder={(product.max_purchase || '').toString()}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`wishRequests-${product.id}`}
                  checked={overrides[product.id]?.allowWishRequests ?? product.allow_wish_requests}
                  onCheckedChange={(checked) => handleOverrideChange(
                    product.id,
                    'allowWishRequests',
                    checked
                  )}
                />
                <Label htmlFor={`wishRequests-${product.id}`}>Allow Wish Requests</Label>
              </div>

              {(overrides[product.id]?.allowWishRequests ?? product.allow_wish_requests) && (
                <div className="ml-6 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Wish Request</Label>
                    <Input
                      type="number"
                      value={overrides[product.id]?.wishRequestMin || ''}
                      onChange={(e) => handleOverrideChange(
                        product.id,
                        'wishRequestMin',
                        e.target.value ? parseInt(e.target.value) : undefined
                      )}
                      placeholder={(product.wish_request_min || '').toString()}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Wish Request</Label>
                    <Input
                      type="number"
                      value={overrides[product.id]?.wishRequestMax || ''}
                      onChange={(e) => handleOverrideChange(
                        product.id,
                        'wishRequestMax',
                        e.target.value ? parseInt(e.target.value) : undefined
                      )}
                      placeholder={(product.wish_request_max || '').toString()}
                      min="0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Save Product Overrides
        </Button>
      </div>
    </div>
  );
}