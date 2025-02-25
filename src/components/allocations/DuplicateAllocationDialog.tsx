import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

interface DuplicateAllocationDialogProps {
  allocation?: Allocation;
  onClose: () => void;
  isOpen: boolean;
}

export function DuplicateAllocationDialog({
  allocation,
  onClose,
  isOpen
}: DuplicateAllocationDialogProps) {
  const navigate = useNavigate();
  const [name, setName] = React.useState(allocation ? `Copy of ${allocation.name}` : '');
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState({
    duplicateProducts: true,
    duplicateTiers: true,
    duplicateCustomers: false,
    duplicateDiscounts: true,
    duplicateMessages: true
  });

  if (!isOpen) return null;

  const handleDuplicate = async () => {
    try {
      setLoading(true);

      // Create new allocation
      const { data: newAllocation, error: allocationError } = await supabase
        .from('allocations')
        .insert({
          name,
          status: 'draft',
          start_date: allocation?.start_date,
          end_date: allocation?.end_date,
          allocation_type: allocation?.allocation_type,
          title: options.duplicateMessages ? allocation?.title : null,
          message: options.duplicateMessages ? allocation?.message : null,
          confirmation_message: options.duplicateMessages ? allocation?.confirmation_message : null,
          cart_min: allocation?.cart_min,
          cart_max: allocation?.cart_max,
          min_amount: allocation?.min_amount,
          order_discount_type: options.duplicateDiscounts ? allocation?.order_discount_type : null,
          order_discount_amount: options.duplicateDiscounts ? allocation?.order_discount_amount : null,
          shipping_discount_type: options.duplicateDiscounts ? allocation?.shipping_discount_type : null,
          shipping_discount_amount: options.duplicateDiscounts ? allocation?.shipping_discount_amount : null,
          shipping_discount_method: options.duplicateDiscounts ? allocation?.shipping_discount_method : null,
        })
        .select()
        .single();

      if (allocationError) throw allocationError;

      if (options.duplicateProducts && allocation) {
        // Duplicate products
        const { data: products } = await supabase
          .from('allocation_products')
          .select('*')
          .eq('allocation_id', allocation.id);

        if (products && products.length > 0) {
          const newProducts = products.map(product => ({
            ...product,
            id: undefined,
            allocation_id: newAllocation.id,
            created_at: undefined,
            updated_at: undefined
          }));

          const { error: productsError } = await supabase
            .from('allocation_products')
            .insert(newProducts);

          if (productsError) throw productsError;
        }
      }

      if (options.duplicateTiers && allocation && allocation.allocation_type === 'tier') {
        // Duplicate tiers
        const { data: tiers } = await supabase
          .from('allocation_tiers')
          .select('*')
          .eq('allocation_id', allocation.id);

        if (tiers && tiers.length > 0) {
          const newTiers = tiers.map(tier => ({
            ...tier,
            id: undefined,
            allocation_id: newAllocation.id,
            created_at: undefined
          }));

          const { error: tiersError } = await supabase
            .from('allocation_tiers')
            .insert(newTiers);

          if (tiersError) throw tiersError;

          if (options.duplicateCustomers) {
            // Duplicate customer tier assignments
            const { data: customerTiers } = await supabase
              .from('customer_tiers')
              .select('*')
              .eq('allocation_id', allocation.id);

            if (customerTiers && customerTiers.length > 0) {
              const newCustomerTiers = customerTiers.map(ct => ({
                ...ct,
                id: undefined,
                allocation_id: newAllocation.id,
                created_at: undefined
              }));

              const { error: customerTiersError } = await supabase
                .from('customer_tiers')
                .insert(newCustomerTiers);

              if (customerTiersError) throw customerTiersError;
            }
          }
        }
      }

      // Navigate to the new allocation
      navigate(`/allocations/${newAllocation.id}`);
    } catch (error) {
      console.error('Error duplicating allocation:', error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Copy className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Duplicate Allocation</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">New Allocation Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter allocation name"
            />
          </div>

          <div className="space-y-3">
            <Label>What to duplicate?</Label>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="products"
                  checked={options.duplicateProducts}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, duplicateProducts: checked as boolean }))
                  }
                />
                <Label htmlFor="products">Products and configurations</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tiers"
                  checked={options.duplicateTiers}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, duplicateTiers: checked as boolean }))
                  }
                />
                <Label htmlFor="tiers">Tiers and tier settings</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="customers"
                  checked={options.duplicateCustomers}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, duplicateCustomers: checked as boolean }))
                  }
                />
                <Label htmlFor="customers">Customer assignments</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="discounts"
                  checked={options.duplicateDiscounts}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, duplicateDiscounts: checked as boolean }))
                  }
                />
                <Label htmlFor="discounts">Discounts and pricing</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="messages"
                  checked={options.duplicateMessages}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, duplicateMessages: checked as boolean }))
                  }
                />
                <Label htmlFor="messages">Messages and notifications</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleDuplicate} 
            disabled={!name.trim() || loading}
          >
            {loading ? 'Duplicating...' : 'Duplicate Allocation'}
          </Button>
        </div>
      </div>
    </div>
  );
}