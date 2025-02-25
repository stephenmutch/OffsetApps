import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { Database } from '@/lib/database.types';

type Allocation = Database['public']['Tables']['allocations']['Row'];

const configurationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  allocation_type: z.enum(['individual', 'tier']),
  title: z.string().optional(),
  message: z.string().optional(),
  confirmation_message: z.string().optional(),
  cart_min: z.number().min(0).optional(),
  cart_max: z.number().min(0).optional(),
  min_amount: z.number().min(0).optional(),
  order_discount_type: z.enum(['percentage', 'fixed']).optional(),
  order_discount_amount: z.number().min(0).optional(),
  shipping_discount_type: z.enum(['percentage', 'fixed']).optional(),
  shipping_discount_amount: z.number().min(0).optional(),
  shipping_discount_method: z.string().optional(),
});

type ConfigurationForm = z.infer<typeof configurationSchema>;

interface AllocationConfigurationProps {
  allocation: Allocation;
}

export function AllocationConfiguration({ allocation }: AllocationConfigurationProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ConfigurationForm>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      name: allocation.name,
      start_date: new Date(allocation.start_date).toISOString().slice(0, 16),
      end_date: new Date(allocation.end_date).toISOString().slice(0, 16),
      allocation_type: allocation.allocation_type || 'individual',
      title: allocation.title || '',
      message: allocation.message || '',
      confirmation_message: allocation.confirmation_message || '',
      cart_min: allocation.cart_min || 0,
      cart_max: allocation.cart_max || 0,
      min_amount: allocation.min_amount || 0,
      order_discount_type: allocation.order_discount_type || undefined,
      order_discount_amount: allocation.order_discount_amount || 0,
      shipping_discount_type: allocation.shipping_discount_type || undefined,
      shipping_discount_amount: allocation.shipping_discount_amount || 0,
      shipping_discount_method: allocation.shipping_discount_method || '',
    }
  });

  const allocationType = watch('allocation_type');

  const onSubmit = async (data: ConfigurationForm) => {
    try {
      const { error } = await supabase
        .from('allocations')
        .update(data)
        .eq('id', allocation.id);

      if (error) throw error;
      // Show success message
    } catch (error) {
      console.error('Error updating allocation:', error);
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium">Basic Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure the fundamental details of your allocation.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Allocation Name</Label>
            <Input
              id="name"
              {...register('name')}
              error={errors.name?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                type="datetime-local"
                id="start_date"
                {...register('start_date')}
                error={errors.start_date?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                type="datetime-local"
                id="end_date"
                {...register('end_date')}
                error={errors.end_date?.message}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Allocation Type</Label>
            <RadioGroup
              value={allocationType}
              onValueChange={(value) => setValue('allocation_type', value as 'individual' | 'tier')}
              className="space-y-4"
            >
              <div className="flex items-start space-x-4">
                <RadioGroupItem value="individual" id="individual" />
                <div>
                  <Label htmlFor="individual" className="font-medium">Individual</Label>
                  <p className="text-sm text-muted-foreground">
                    Customize allocations for each customer individually
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <RadioGroupItem value="tier" id="tier" />
                <div>
                  <Label htmlFor="tier" className="font-medium">Tier-based</Label>
                  <p className="text-sm text-muted-foreground">
                    Group customers into tiers with shared allocation settings
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Messaging */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium">Messaging</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure the messages your customers will see.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Allocation Title</Label>
            <Input
              id="title"
              {...register('title')}
              error={errors.title?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Allocation Message</Label>
            <Textarea
              id="message"
              rows={4}
              {...register('message')}
              error={errors.message?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation_message">Confirmation Message</Label>
            <Textarea
              id="confirmation_message"
              rows={4}
              {...register('confirmation_message')}
              error={errors.confirmation_message?.message}
            />
          </div>
        </div>
      </div>

      {/* Purchase Requirements */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium">Purchase Requirements</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Set minimum and maximum purchase requirements.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cart_min">Minimum Bottles</Label>
              <Input
                type="number"
                id="cart_min"
                min="0"
                {...register('cart_min', { valueAsNumber: true })}
                error={errors.cart_min?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cart_max">Maximum Bottles</Label>
              <Input
                type="number"
                id="cart_max"
                min="0"
                {...register('cart_max', { valueAsNumber: true })}
                error={errors.cart_max?.message}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_amount">Minimum Purchase Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                id="min_amount"
                className="pl-7"
                min="0"
                step="0.01"
                {...register('min_amount', { valueAsNumber: true })}
                error={errors.min_amount?.message}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}