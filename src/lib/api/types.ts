/**
 * API Response Types for Offset Reporting API
 */

export interface Address {
  id: string;
  hash: string;
  created: string;
  last_update: string;
  title: string;
  first_name: string;
  last_name: string;
  birthday: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  address_2: string;
  city: string;
  state: string;
  zip: string;
  zip_ext: string;
  country: string;
  lat: string;
  long: string;
  residential: string;
  verified: string;
  customer_id: string;
  default: string;
  public: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  sort: string;
  status: string;
  description: string;
  short_description: string;
  extended_description: string;
  image: string;
}

export interface ClubMember {
  id: string;
  club_id: string;
  customer: Customer;
  address: Address;
  payment: Payment;
  authorization: string;
  error: string;
  amount: string;
  total: string;
  created: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  discount: string;
  free_shipping: string;
  club_confirmation_message: string;
  club_info_1: string;
  club_info_2: string;
  club_info_3: string;
  sort: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  state: string;
  order_count: string;
  order_total: string;
  credits_total: string;
  last_order: string;
  last_order_total: string;
  last_update: string;
  created: string;
  active_account: string;
  agreed_to_mailing_list: string;
  agreed_to_terms_privacy: string;
  birthday: string;
  consent_date: string;
  consent_time: string;
  consent_token: string;
  created_by: string;
  customer_source: string;
  customer_type: string;
  addresses: Address[];
  payment: Payment[];
  groups: Group[];
  tags: string[];
}

export interface Group {
  id: string;
  name: string;
  status: string;
  sort: string;
  allocation_message: string;
  allocation_start: string;
  allocation_end: string;
  allocation_title: string;
  checkout_cart_min: number;
  checkout_dollar_min: number;
  discount: number;
  free_shipping: number;
  description: string;
  purchase_message: string;
  allocation: Record<string, AllocationProduct>;
}

export interface AllocationProduct {
  sku: string;
  min_quantity: string;
  quantity: string;
  min_wish: string;
  max_wish: string;
}

export interface InventoryLevel {
  sku: string;
  quantity: number;
  Tastingroom: number;
  Website: number;
}

export interface InventoryMovement {
  sku: string;
  timestamp: string;
  quantity: number;
  order_number: string;
  user: string;
  note: string;
}

export interface Order {
  id: string;
  datestamp: string;
  last_update: string;
  status: string;
  subtotal: string;
  tax: string;
  shipping: string;
  discount: string;
  credits: string;
  refund: string;
  total: string;
  customer_id: string;
  products: OrderProduct[];
  // Add other order fields as needed
}

export interface OrderProduct {
  id: string;
  sku: string;
  name: string;
  type: string;
  bottle_size: string;
  retail_price: string;
  discount: string;
  discount_type: string;
  price: string;
  quantity: string;
  status: string;
  description: string;
  image: string;
  stock_status: string;
  shipped: string;
  created: string;
}

export interface Payment {
  id: string;
  uri: string;
  type: string;
  gateway: string;
  status: string;
  credit_type: string;
  account_number: string;
  total: string;
  fees: string;
  tax: string;
  shipping: string;
  credits: string;
  discount: string;
  order_id: string;
  customer_id: string;
  created: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  created: string;
  last_update: string;
  description: string;
  status: string;
  // Add other product fields as needed
}

export interface Wish {
  items: Record<string, WishItem>;
  config: WishConfig;
}

export interface WishItem {
  session: string;
  sku: string;
  retail_price: string;
  discount: string;
  discount_type: string;
  quantity: string;
  price: string;
  description: string;
  location: string;
  expires: string;
  reserve_inventory: string;
}

export interface WishConfig {
  address_id: string;
  customer_id: string;
  discount_case: string;
  order_id: string;
  original_wish_date: string;
  payment_id: string;
  saved_order: string;
  shipping_address: string;
  shipping_address_2: string;
  shipping_birthday: string;
  shipping_city: string;
  shipping_company: string;
  shipping_country: string;
  shipping_email: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_method: string;
  shipping_phone: string;
  shipping_state: string;
  shipping_zip: string;
  type: string;
  wish_only: string;
}