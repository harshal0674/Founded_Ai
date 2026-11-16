import React, { useEffect, useState } from "react";
import {
  Boxes,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Plus,
  ShoppingCart,
  RefreshCw
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
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { api } from "../api/client";
import { DashboardCharts, DashboardStats } from "../types";

interface DashboardPageProps {
  navigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
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

  const healthColors = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[var(--container)] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-rule">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">
            Executive Inventory Command
          </h1>
          <p className="text-xs md:text-sm text-ink-2 mt-0.5">
            Real-time multi-echelon stock telemetry, automated replenishment triggers, and ML demand projections.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchData}
            className="keycap text-xs py-2 px-3 text-ink-2 flex items-center space-x-1.5"
            title="Refresh metrics from backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate("/inventory")}
            className="keycap keycap-primary text-xs py-2 px-3.5 flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => navigate("/sales")}
            className="keycap text-xs py-2 px-3.5 text-ink-2 flex items-center space-x-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Record Sale</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-card border border-danger/30 bg-danger/5 text-xs text-danger flex items-center justify-between">
          <span>Failed to connect to backend server: {error}</span>
          <button onClick={fetchData} className="underline font-mono">Retry</button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock Value */}
        <div className="p-4 md:p-5 rounded-card border border-rule bg-paper shadow-card space-y-2">
          <div className="flex items-center justify-between text-muted text-xs">
            <span className="font-medium">Total Stock Value</span>
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <div className="font-display font-semibold text-2xl md:text-3xl text-ink">
            ${stats ? stats.total_stock_value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
          </div>
          <div className="text-[11px] text-muted font-mono flex items-center space-x-1">
            <span>{stats?.total_products || 0} active SKUs tracked</span>
          </div>
        </div>

        {/* 30-Day Revenue */}
        <div className="p-4 md:p-5 rounded-card border border-rule bg-paper shadow-card space-y-2">
          <div className="flex items-center justify-between text-muted text-xs">
            <span className="font-medium">30-Day Revenue</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="font-display font-semibold text-2xl md:text-3xl text-ink">
            ${stats ? stats.total_revenue_30d.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
          </div>
          <div className="text-[11px] text-muted font-mono">
            {stats?.total_units_sold_30d || 0} units dispatched
          </div>
        </div>

        {/* Stockout Risk Count */}
        <div 
          onClick={() => navigate("/recommendations")} 
          className="p-4 md:p-5 rounded-card border border-rule bg-paper shadow-card space-y-2 cursor-pointer hover:border-danger/40 transition-colors"
        >
          <div className="flex items-center justify-between text-muted text-xs">
            <span className="font-medium">Stockout Risks</span>
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <div className="font-display font-semibold text-2xl md:text-3xl text-danger">
            {stats?.stockout_risk_count ?? 0}
          </div>
          <div className="text-[11px] text-danger font-medium flex items-center space-x-1">
            <span>Days &lt; Lead Time</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Reorders Pending */}
        <div 
          onClick={() => navigate("/recommendations")} 
          className="p-4 md:p-5 rounded-card border border-rule bg-paper shadow-card space-y-2 cursor-pointer hover:border-accent/40 transition-colors"
        >
          <div className="flex items-center justify-between text-muted text-xs">
            <span className="font-medium">Reorders Triggered</span>
            <ShieldAlert className="w-4 h-4 text-accent" />
          </div>
          <div className="font-display font-semibold text-2xl md:text-3xl text-accent">
            {stats?.reorder_pending_count ?? 0}
          </div>
          <div className="text-[11px] text-muted font-mono">
            Stock &le; Reorder Point (ROP)
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Revenue Trend (30 Days) */}
        <div className="lg:col-span-8 p-5 rounded-card border border-rule bg-paper shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-base text-ink">
                30-Day Sales Velocity & Revenue
              </h3>
              <p className="text-xs text-muted">
                Daily aggregated orders and volume across all sales channels
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-paper-2 border border-rule text-muted">
              Daily
            </span>
          </div>

          <div className="h-64 w-full">
            {charts?.sales_trend && charts.sales_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.sales_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-rule)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(v) => v.slice(5)} 
                    tick={{ fontSize: 10, fill: "var(--color-muted)" }}
                    axisLine={{ stroke: "var(--color-rule)" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: "var(--color-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-graphite)",
                      borderColor: "var(--color-graphite-2)",
                      borderRadius: "6px",
                      color: "var(--color-graphite-ink)",
                      fontSize: "11px",
                      fontFamily: "var(--font-outlier)"
                    }}
                    formatter={(val: any, name: any) => [
                      String(name) === "revenue" ? `$${Number(val).toFixed(2)}` : `${val} units`,
                      String(name) === "revenue" ? "Revenue" : "Units Sold"
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted font-mono">
                {loading ? "Aggregating sales series..." : "No sales data found. Click 'Reload Demo Data' to populate."}
              </div>
            )}
          </div>
        </div>

        {/* Stock Health Status */}
        <div className="lg:col-span-4 p-5 rounded-card border border-rule bg-paper shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-base text-ink">
              Inventory Health Status
            </h3>
            <p className="text-xs text-muted">
              Current stock level distribution against minimum thresholds
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                <span className="text-ink font-medium">Healthy Stock</span>
              </span>
              <span className="font-mono text-ink font-semibold">
                {charts?.stock_health.healthy ?? 0} SKUs
              </span>
            </div>
            <div className="w-full bg-paper-3 h-2 rounded-full overflow-hidden">
              <div
                className="bg-success h-full"
                style={{
                  width: `${((charts?.stock_health.healthy || 0) / Math.max(1, stats?.total_products || 1)) * 100}%`
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-ink font-medium">Low Stock Warning</span>
              </span>
              <span className="font-mono text-amber-600 font-semibold">
                {charts?.stock_health.low_stock ?? 0} SKUs
              </span>
            </div>
            <div className="w-full bg-paper-3 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full"
                style={{
                  width: `${((charts?.stock_health.low_stock || 0) / Math.max(1, stats?.total_products || 1)) * 100}%`
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-danger"></span>
                <span className="text-ink font-medium">Stockout (Zero Units)</span>
              </span>
              <span className="font-mono text-danger font-semibold">
                {charts?.stock_health.out_of_stock ?? 0} SKUs
              </span>
            </div>
            <div className="w-full bg-paper-3 h-2 rounded-full overflow-hidden">
              <div
                className="bg-danger h-full"
                style={{
                  width: `${((charts?.stock_health.out_of_stock || 0) / Math.max(1, stats?.total_products || 1)) * 100}%`
                }}
              ></div>
            </div>
          </div>

          <div className="pt-4 border-t border-rule">
            <button
              onClick={() => navigate("/inventory")}
              className="w-full keycap text-xs py-2 text-ink-2 flex items-center justify-center space-x-1.5"
            >
              <span>Manage Inventory Grid</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Category Breakdown & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-6 p-5 rounded-card border border-rule bg-paper shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-base text-ink">
              Inventory Capital by Category
            </h3>
            <span className="text-xs text-muted font-mono">Valuation</span>
          </div>

          <div className="h-56 w-full">
            {charts?.category_distribution && charts.category_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.category_distribution} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-rule)" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "var(--color-muted)" }} tickFormatter={(v) => `$${v}`} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: "var(--color-ink)" }} width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-graphite)",
                      borderColor: "var(--color-graphite-2)",
                      borderRadius: "6px",
                      color: "var(--color-graphite-ink)",
                      fontSize: "11px",
                      fontFamily: "var(--font-outlier)"
                    }}
                    formatter={(val: any) => [`$${Number(val).toFixed(2)}`, "Capital Allocated"]}
                  />
                  <Bar dataKey="value" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted font-mono">
                No category data available.
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="lg:col-span-6 p-5 rounded-card border border-rule bg-paper shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-base text-ink">
              Top Selling Products
            </h3>
            <span className="text-xs text-muted font-mono">By Revenue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-rule text-muted font-mono text-[11px]">
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium text-right">Units Sold</th>
                  <th className="pb-2 font-medium text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-body">
                {charts?.top_products && charts.top_products.length > 0 ? (
                  charts.top_products.map((p, idx) => (
                    <tr key={idx} className="hover:bg-paper-2 transition-colors">
                      <td className="py-2.5 font-medium text-ink pr-3 max-w-[200px] truncate">
                        {p.name}
                      </td>
                      <td className="py-2.5 text-right font-mono text-ink-2">
                        {p.quantity.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono font-medium text-ink">
                        ${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted font-mono">
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
