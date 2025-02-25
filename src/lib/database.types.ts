export interface Database {
  public: {
    Tables: {
      allocations: {
        Row: {
          id: string;
          name: string;
          status: 'draft' | 'scheduled' | 'active' | 'completed';
          start_date: string;
          end_date: string;
          allocation_type: 'individual' | 'tier';
          title: string | null;
          message: string | null;
          confirmation_message: string | null;
          cart_min: number | null;
          cart_max: number | null;
          min_amount: number | null;
          order_discount_type: 'percentage' | 'fixed' | null;
          order_discount_amount: number | null;
          shipping_discount_type: 'percentage' | 'fixed' | null;
          shipping_discount_amount: number | null;
          shipping_discount_method: string | null;
          total_customers: number;
          current_revenue: number;
          expected_revenue: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['allocations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['allocations']['Insert']>;
      };
      allocation_products: {
        Row: {
          id: string;
          allocation_id: string;
          product_id: string;
          override_price: number | null;
          min_purchase: number | null;
          max_purchase: number | null;
          allow_wish_requests: boolean;
          wish_request_min: number | null;
          wish_request_max: number | null;
          total_inventory: number;
          remaining_inventory: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['allocation_products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['allocation_products']['Insert']>;
      };
    };
  };
}