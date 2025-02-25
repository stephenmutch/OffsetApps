import React from 'react';
import { Gift, Mail } from 'lucide-react';
import type { Allocation } from '@/types/allocation';

interface AllocationProgressProps {
  allocation: Allocation;
}

export function AllocationProgress({ allocation }: AllocationProgressProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Gift className="text-blue-600" size={20} />
          <div className="flex-1">
            <span className="text-blue-900">
              We predict there next time you can add 7 customers from your waiting list of 213 customers to generate additional revenue of $14,000.
            </span>
          </div>
          <button className="text-blue-600 font-medium hover:text-blue-700">
            VIEW WISH REQUESTS
          </button>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Mail className="text-purple-600" size={20} />
          <div className="flex-1">
            <span className="text-purple-900">
              We predict sending an email reminder now to your 368 customers who haven't purchased would generate a projected revenue of $1,667,000.00.
            </span>
          </div>
          <button className="text-purple-600 font-medium hover:text-purple-700">
            VIEW REMINDER
          </button>
        </div>
      </div>
    </div>
  );
}