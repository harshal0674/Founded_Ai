import {
  AuthResponse,
  DashboardCharts,
  DashboardStats,
  DemoAccount,
  OrganizationProfile,
  Product,
  ProductCreate,
  ProductForecast,
  RecommendationOverview,
  Sale,
  SaleCreate,
  User
} from "../types";

const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_BASE = RAW_API_URL.endsWith("/") ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  // Attach JWT Bearer token if present
  const token = localStorage.getItem("stockmind_token");
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      if (res.status === 401) {
        // If unauthorized on protected endpoint, clear stale token and notify
        if (!endpoint.includes("/auth/login") && !endpoint.includes("/auth/register")) {
          localStorage.removeItem("stockmind_token");
          localStorage.removeItem("stockmind_user");
          window.dispatchEvent(new CustomEvent("stockmind:unauthorized"));
        }
      }

      let errDetail = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson.detail) {
          errDetail = typeof errJson.detail === "string" ? errJson.detail : JSON.stringify(errJson.detail);
        }
      } catch {
        // use default statusText
      }
      throw new Error(errDetail);
    }

    return (await res.json()) as T;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth & Multi-Tenancy
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: {
    full_name: string;
    business_name: string;
    email: string;
    password: string;
    currency?: string;
    currency_symbol?: string;
    industry?: string;
  }) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => request<AuthResponse>("/api/auth/me"),

  getDemoAccounts: () => request<DemoAccount[]>("/api/auth/demo-accounts"),

  // Health
  checkHealth: () => request<{ status: string; database: { connected: boolean; mode: string } }>("/health"),

  // Products
  getProducts: (params?: { search?: string; category?: string; status?: string; low_stock_only?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.category) query.append("category", params.category);
    if (params?.status) query.append("status", params.status);
    if (params?.low_stock_only) query.append("low_stock_only", "true");
    const qs = query.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },

  getProduct: (id: string) => request<Product>(`/api/products/${id}`),

  createProduct: (data: ProductCreate) =>
    request<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: Partial<ProductCreate>) =>
    request<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/products/${id}`, {
      method: "DELETE",
    }),

  restockProduct: (id: string, quantity: number) =>
    request<Product>(`/api/products/${id}/restock`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    }),

  // Sales
  getSales: (params?: { limit?: number; product_id?: string; customer_type?: string }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.product_id) query.append("product_id", params.product_id);
    if (params?.customer_type) query.append("customer_type", params.customer_type);
    const qs = query.toString();
    return request<Sale[]>(`/api/sales${qs ? `?${qs}` : ""}`);
  },

  recordSale: (data: SaleCreate) =>
    request<Sale>("/api/sales", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Dashboard
  getDashboardStats: () => request<DashboardStats>("/api/dashboard/stats"),
  getDashboardCharts: () => request<DashboardCharts>("/api/dashboard/charts"),

  // Forecasting
  getForecast: (productId?: string, horizonDays: number = 30) => {
    const query = new URLSearchParams();
    if (productId) query.append("product_id", productId);
    query.append("horizon_days", horizonDays.toString());
    return request<ProductForecast>(`/api/forecast?${query.toString()}`);
  },

  // Recommendations
  getRecommendations: () => request<RecommendationOverview>("/api/recommendations"),

  // System & Organization
  getOrganization: () => request<OrganizationProfile>("/api/system/organization"),

  updateOrganization: (data: OrganizationProfile) =>
    request<OrganizationProfile>("/api/system/organization", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  clearCatalog: () =>
    request<{ success: boolean; message: string }>("/api/system/clear-catalog", {
      method: "POST",
    }),

  seedDemoData: () =>
    request<{ success: boolean; message: string; stats: { products: number; sales: number } }>("/api/system/seed", {
      method: "POST",
    }),
};
