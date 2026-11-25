export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  min_stock_level: number;
  unit_cost: number;
  selling_price: number;
  lead_time_days: number;
  supplier_name: string;
  supplier_email?: string;
  created_at: string;
  updated_at: string;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  total_value: number;
}

export interface ProductCreate {
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  min_stock_level: number;
  unit_cost: number;
  selling_price: number;
  lead_time_days: number;
  supplier_name?: string;
  supplier_email?: string;
}

export interface Sale {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customer_type: string;
  timestamp: string;
  notes?: string;
}

export interface SaleCreate {
  product_id: string;
  quantity: number;
  customer_type?: string;
  custom_price?: number;
  notes?: string;
}

export interface ForecastPoint {
  date: string;
  predicted_units: number;
  lower_bound: number;
  upper_bound: number;
}

export interface HistoricalPoint {
  date: string;
  units: number;
}

export interface ForecastMetrics {
  mae: number;
  rmse: number;
  mape: number;
  data_points: number;
  is_fallback: boolean;
}

export interface ProductForecast {
  product_id: string;
  product_name: string;
  sku: string;
  category: string;
  model_used: string;
  horizon_days: number;
  metrics: ForecastMetrics;
  historical_summary: {
    total_units_sold: number;
    avg_daily_demand: number;
    demand_std: number;
    avg_order_size: number;
  };
  historical: HistoricalPoint[];
  forecast: ForecastPoint[];
  generated_at: string;
}

export interface Recommendation {
  product_id: string;
  product_name: string;
  sku: string;
  category: string;
  current_stock: number;
  daily_run_rate: number;
  days_until_stockout: number;
  lead_time_days: number;
  safety_stock: number;
  reorder_point: number;
  suggested_order_qty: number;
  estimated_cost: number;
  supplier_name: string;
  supplier_email?: string;
  urgency: "critical" | "high" | "medium" | "healthy";
  reasoning: string;
  action_required: boolean;
}

export interface RecommendationOverview {
  total_recommendations: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  healthy_count: number;
  total_capital_required: number;
  items: Recommendation[];
}

export interface DashboardStats {
  total_products: number;
  total_stock_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  total_revenue_30d: number;
  total_units_sold_30d: number;
  stockout_risk_count: number;
  reorder_pending_count: number;
}

export interface SalesTrendItem {
  date: string;
  sales: number;
  revenue: number;
}

export interface CategoryDistributionItem {
  category: string;
  count: number;
  value: number;
}

export interface DashboardCharts {
  sales_trend: SalesTrendItem[];
  category_distribution: CategoryDistributionItem[];
  stock_health: {
    healthy: number;
    low_stock: number;
    out_of_stock: number;
  };
  top_products: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface OrganizationProfile {
  name: string;
  currency: string;
  currency_symbol: string;
  industry?: string;
  gstin?: string;
  address?: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  org_id: string;
  org_name: string;
  role?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
  organization: OrganizationProfile;
}

export interface DemoAccount {
  name: string;
  email: string;
  password: string;
  owner: string;
  industry: string;
  currency: string;
  description: string;
}
