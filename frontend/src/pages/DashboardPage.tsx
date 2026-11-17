import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Plus,
  ShoppingCart,
  RefreshCw,
  Building2,
  Boxes
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import { api } from "../api/client";
import { useOrganization } from "../context/OrganizationContext";
import { DashboardCharts, DashboardStats } from "../types";

interface DashboardPageProps {
  navigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { organization, formatCurrency, currencySymbol } = useOrganization();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sData, cData] = await Promise.all([
        api.getDashboardStats(),
        api.getDashboardCharts(),
      ]);
      setStats(sData);
      setCharts(cData);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handleRefresh = () => fetchData();
    window.addEventListener("stockmind:refresh", handleRefresh);
    return () => window.removeEventListener("stockmind:refresh", handleRefresh);
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1D1D20]">
        <div>
          <div className="flex items-center space-x-2 text-apple-blue-bright text-xs font-mono mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span>•</span>
            <span>Default Currency: {currencySymbol} {organization.currency}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Executive Command Center
          </h1>
          <p className="text-xs md:text-sm text-apple-text-secondary mt-1">
            Real-time stock valuation, demand velocity, and automated replenishment in {currencySymbol} {organization.currency}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            className="apple-btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-apple-blue-bright" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate("/inventory")}
            className="apple-btn-primary text-xs py-2 px-4 flex items-center space-x-1.5 shadow-glow-blue-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => navigate("/sales")}
            className="apple-btn-secondary text-xs py-2 px-4 flex items-center space-x-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Record Sale</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl border border-apple-red/30 bg-apple-red/10 text-xs text-apple-red flex items-center justify-between">
          <span>Failed to connect to backend: {error}</span>
          <button onClick={fetchData} className="underline font-mono">Retry</button>
        </div>
      )}

      {/* Primary KPI Grid (Apple Elevated Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Stock Value */}
        <div className="apple-card p-5 md:p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-apple-text-secondary font-medium">
            <span>Total Stock Value</span>
            <span className="font-mono text-apple-blue-bright font-bold">{currencySymbol}</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono">
            {stats ? formatCurrency(stats.total_stock_value) : formatCurrency(0)}
          </div>
          <div className="text-xs text-apple-text-secondary font-mono">
            {stats?.total_products || 0} active catalog SKUs
          </div>
        </div>

        {/* 30-Day Gross Revenue */}
        <div className="apple-card p-5 md:p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-apple-text-secondary font-medium">
            <span>30-Day Revenue</span>
            <TrendingUp className="w-4 h-4 text-apple-green" />
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono">
            {stats ? formatCurrency(stats.total_revenue_30d) : formatCurrency(0)}
          </div>
          <div className="text-xs text-apple-text-secondary font-mono">
            {stats?.total_units_sold_30d || 0} units dispatched
          </div>
        </div>

        {/* Stockout Risk Count */}
        <div
          onClick={() => navigate("/recommendations")}
          className="apple-card p-5 md:p-6 space-y-2 cursor-pointer hover:border-apple-red/50 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-apple-text-secondary font-medium">
            <span>Stockout Risks</span>
            <AlertTriangle className="w-4 h-4 text-apple-red" />
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-apple-red font-mono">
            {stats?.stockout_risk_count ?? 0}
          </div>
          <div className="text-xs text-apple-red flex items-center space-x-1">
            <span>Days to stockout &lt; Lead Time</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Reorders Pending */}
        <div
          onClick={() => navigate("/recommendations")}
          className="apple-card p-5 md:p-6 space-y-2 cursor-pointer hover:border-apple-blue-bright/50 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-apple-text-secondary font-medium">
            <span>Reorders Triggered</span>
            <ShieldAlert className="w-4 h-4 text-apple-blue-bright" />
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-apple-blue-bright font-mono">
            {stats?.reorder_pending_count ?? 0}
          </div>
          <div className="text-xs text-apple-text-secondary font-mono">
            Inventory &le; Reorder Point (ROP)
          </div>
        </div>
      </div>

      {/* Main Visualizations: Demand Velocity & Stock Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 30-Day Sales Velocity */}
        <div className="lg:col-span-8 apple-card p-6 md:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                30-Day Demand Velocity & Revenue ({currencySymbol})
              </h3>
              <p className="text-xs text-apple-text-secondary mt-0.5">
                Aggregated daily sales transactions for {organization.name}
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#18181B] border border-apple-border text-apple-text-secondary">
              {currencySymbol} {organization.currency}
            </span>
          </div>

          <div className="h-64 w-full">
            {charts?.sales_trend && charts.sales_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.sales_trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="appleBlueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0A84FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1D1D22" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => v.slice(5)}
                    tick={{ fontSize: 10, fill: "#86868B" }}
                    axisLine={{ stroke: "#232327" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#86868B" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${currencySymbol}${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161618",
                      borderColor: "#28282C",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontFamily: "Inter, sans-serif",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.7)"
                    }}
                    formatter={(val: any, name: any) => [
                      String(name) === "revenue" ? formatCurrency(Number(val)) : `${val} units`,
                      String(name) === "revenue" ? "Revenue" : "Units Sold"
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0A84FF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#appleBlueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-apple-text-secondary font-mono">
                {loading ? "Aggregating sales series..." : "No sales data recorded yet."}
              </div>
            )}
          </div>
        </div>

        {/* Inventory Distribution Health */}
        <div className="lg:col-span-4 apple-card p-6 md:p-7 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Stock Health Status
            </h3>
            <p className="text-xs text-apple-text-secondary mt-0.5">
              Active stock positions evaluated against minimum thresholds
            </p>
          </div>

          <div className="space-y-4">
            {/* Healthy */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-apple-green"></span>
                  <span className="text-white font-medium">Healthy Inventory</span>
                </span>
                <span className="font-mono text-apple-text-secondary">
                  {charts?.stock_health.healthy ?? 0} SKUs
                </span>
              </div>
              <div className="w-full bg-[#18181B] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-apple-green h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((charts?.stock_health.healthy || 0) / Math.max(1, stats?.total_products || 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Low Stock */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-apple-orange"></span>
                  <span className="text-white font-medium">Low Stock Warning</span>
                </span>
                <span className="font-mono text-apple-orange">
                  {charts?.stock_health.low_stock ?? 0} SKUs
                </span>
              </div>
              <div className="w-full bg-[#18181B] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-apple-orange h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((charts?.stock_health.low_stock || 0) / Math.max(1, stats?.total_products || 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Stockout */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-apple-red"></span>
                  <span className="text-white font-medium">Stockout Active</span>
                </span>
                <span className="font-mono text-apple-red font-semibold">
                  {charts?.stock_health.out_of_stock ?? 0} SKUs
                </span>
              </div>
              <div className="w-full bg-[#18181B] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-apple-red h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((charts?.stock_health.out_of_stock || 0) / Math.max(1, stats?.total_products || 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-apple-border">
            <button
              onClick={() => navigate("/inventory")}
              className="w-full apple-btn-secondary text-xs py-2.5 flex items-center justify-center space-x-2"
            >
              <span>View Full Inventory Catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-apple-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Category Breakdown & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-6 apple-card p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white tracking-tight">
              Capital Valuation by Category
            </h3>
            <span className="text-xs text-apple-text-secondary font-mono">{organization.currency} ({currencySymbol})</span>
          </div>

          <div className="h-56 w-full">
            {charts?.category_distribution && charts.category_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.category_distribution} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1D1D22" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "#86868B" }}
                    tickFormatter={(v) => `${currencySymbol}${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                  />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: "#F5F5F7" }} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161618",
                      borderColor: "#28282C",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontFamily: "Inter, sans-serif"
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), "Capital Allocated"]}
                  />
                  <Bar dataKey="value" fill="#0A84FF" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-apple-text-secondary font-mono">
                No category data available.
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Products Table */}
        <div className="lg:col-span-6 apple-card p-6 md:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white tracking-tight">
              Top Selling Products
            </h3>
            <span className="text-xs text-apple-text-secondary font-mono">By Revenue ({currencySymbol})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#232327] text-apple-text-secondary font-mono text-[11px]">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium text-right">Units</th>
                  <th className="pb-3 font-medium text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D22]">
                {charts?.top_products && charts.top_products.length > 0 ? (
                  charts.top_products.map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#18181C] transition-colors">
                      <td className="py-3 font-medium text-white pr-3 max-w-[220px] truncate">
                        {p.name}
                      </td>
                      <td className="py-3 text-right font-mono text-apple-text-secondary">
                        {p.quantity.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono font-medium text-white">
                        {formatCurrency(p.revenue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-apple-text-secondary font-mono">
                      No order data recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
