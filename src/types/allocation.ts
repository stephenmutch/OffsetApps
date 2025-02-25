export interface Allocation {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  startDate: Date;
  endDate: Date;
  totalCustomers: number;
  currentRevenue: number;
  expectedRevenue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AllocationTier {
  id: string;
  allocationId: string;
  name: string;
  level: number;
  accessStart: Date;
  accessEnd: Date;
  customerCount: number;
  createdAt: Date;
}

export interface AllocationProduct {
  id: string;
  allocationId: string;
  productId: string;
  totalInventory: number;
  remainingInventory: number;
  tierRestrictions: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerTier {
  id: string;
  allocationId: string;
  customerId: string;
  tierId: string;
  pvnScore: number;
  hasPurchased: boolean;
  lastEngagement: Date;
  createdAt: Date;
}

export interface AllocationRequest {
  id: string;
  allocationId: string;
  customerId: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'approved' | 'denied';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AllocationMetrics {
  id: string;
  allocationId: string;
  metricDate: Date;
  dailyRevenue: number;
  dailyOrders: number;
  dailyCustomers: number;
  inventoryDepletion: number;
  engagementRate: number;
  createdAt: Date;
}