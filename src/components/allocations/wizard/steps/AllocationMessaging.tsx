import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AllocationMessagingData {
  title?: string;
  message?: string;
  confirmationMessage?: string;
}

interface AllocationMessagingProps {
  data: AllocationMessagingData;
  onUpdate: (data: AllocationMessagingData) => void;
}

export function AllocationMessaging({ data, onUpdate }: AllocationMessagingProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Allocation Messaging</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure the messages your customers will see during the allocation.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Allocation Title</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => onUpdate({ ...data, title: e.target.value })}
            placeholder="Fall 2024 Wine Release"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Allocation Message</Label>
          <Textarea
            id="message"
            rows={4}
            value={data.message || ''}
            onChange={(e) => onUpdate({ ...data, message: e.target.value })}
            placeholder="Welcome to our Fall 2024 allocation..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmationMessage">Purchase Confirmation Message</Label>
          <Textarea
            id="confirmationMessage"
            rows={4}
            value={data.confirmationMessage || ''}
            onChange={(e) => onUpdate({ ...data, confirmationMessage: e.target.value })}
            placeholder="Thank you for your purchase..."
          />
        </div>
      </div>
    </div>
  );
}