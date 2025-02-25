import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AllocationBasicInfoData {
  name?: string;
  startDate?: string;
  endDate?: string;
  allocationType?: 'individual' | 'tier';
}

interface AllocationBasicInfoProps {
  data: AllocationBasicInfoData;
  onUpdate: (data: AllocationBasicInfoData) => void;
}

export function AllocationBasicInfo({ data, onUpdate }: AllocationBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Basic Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up the fundamental details of your allocation.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Allocation Name</Label>
          <Input
            id="name"
            value={data.name || ''}
            onChange={(e) => onUpdate({ ...data, name: e.target.value })}
            placeholder="Fall 2024 Release"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="datetime-local"
              id="startDate"
              value={data.startDate || ''}
              onChange={(e) => onUpdate({ ...data, startDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="datetime-local"
              id="endDate"
              value={data.endDate || ''}
              onChange={(e) => onUpdate({ ...data, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Allocation Type</Label>
          <RadioGroup
            value={data.allocationType}
            onValueChange={(value) => onUpdate({ ...data, allocationType: value as 'individual' | 'tier' })}
            className="space-y-4"
          >
            <div className="flex items-start space-x-4">
              <RadioGroupItem value="individual" id="individual" className="mt-1" />
              <div>
                <Label htmlFor="individual" className="font-medium">Individual</Label>
                <p className="text-sm text-muted-foreground">
                  Customize allocations for each customer individually
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <RadioGroupItem value="tier" id="tier" className="mt-1" />
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
  );
}