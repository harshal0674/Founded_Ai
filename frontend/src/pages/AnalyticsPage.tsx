import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, PieChart as PieIcon, RefreshCw, DollarSign, Layers } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { api } from "../api/client";
import { DashboardCharts, DashboardStats, Product, Sale } from "../types";

export const AnalyticsPage: React.FC = () => {
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cData, sData, salesList, prodsList] = await Promise.all([
        api.getDashboardCharts(),
        api.getDashboardStats(),
        api.getSales({ limit: 300 }),
        api.getProducts(),
      ]);
      setCharts(cData);
      setStats(sData);
      setSales(salesList);
      setProducts(prodsList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Channel breakdown
  const channelData: { [key: string]: number } = {};
  sales.forEach((s) => {
    const c = s.customer_type || "retail";
    channelData[c] = (channelData[c] || 0) + s.total_price;
  });
  const channelPie = Object.entries(channelData).map(([name, value]) => ({
    name: name.toUpperCase(),
    value: Math.round(value),
  }));

  const COLORS = ["var(--color-accent)", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[var(--container)] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-rule">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">
            Inventory & Channel Analytics
          </h1>
          <p className="text-xs md:text-sm text-ink-2 mt-0.5">
            Deep-dive financial metrics, margin contribution, working capital velocity, and channel distribution.
          </p>
        </div>

        <button
          onClick={loadData}
          className="keycap text-xs py-2 px-3 text-ink-2 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-paper rounded-card border border-rule shadow-card">
          <span className="text-[11px] font-mono text-muted">Total Stock Valuation</span>
          <div className="font-display font-semibold text-2xl text-ink mt-1">
            ${stats?.total_stock_value.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
          </div>
          <p className="text-[10px] text-muted font-mono mt-0.5">Cost value on balance sheet</p>
        </div>

        <div className="p-4 bg-paper rounded-card border border-rule shadow-card">
          <span className="text-[11px] font-mono text-muted">30-Day Gross Revenue</span>
          <div className="font-display font-semibold text-2xl text-ink mt-1">
            ${stats?.total_revenue_30d.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
          </div>
          <p className="text-[10px] text-muted font-mono mt-0.5">All order streams</p>
        </div>

        <div className="p-4 bg-paper rounded-card border border-rule shadow-card">
          <span className="text-[11px] font-mono text-muted">Active Product SKUs</span>
          <div className="font-display font-semibold text-2xl text-ink mt-1">
            {stats?.total_products || 0}
          </div>
          <p className="text-[10px] text-muted font-mono mt-0.5">Catalog breadth</p>
        </div>

        <div className="p-4 bg-paper rounded-card border border-rule shadow-card">
          <span className="text-[11px] font-mono text-muted">Inventory Turnover Est.</span>
          <div className="font-display font-semibold text-2xl text-accent mt-1">
            {stats && stats.total_stock_value > 0
              ? (stats.total_revenue_30d / stats.total_stock_value * 12).toFixed(1)
              : "0.0"}x
          </div>
          <p className="text-[10px] text-muted font-mono mt-0.5">Annualized turn velocity</p>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-7 p-5 rounded-card border border-rule bg-paper shadow-card space-y-4">
          <div>
            <h3 className="font-display font-semibold text-base text-ink">
              Capital Distribution Across Categories
            </h3>
            <p className="text-xs text-muted">Total inventory dollar value held per category</p>
          </div>

          <div className="h-64 w-full">
            {charts?.category_distribution && charts.category_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.category_distribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-rule)" />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: "var(--color-muted)" }} axisLine={{ stroke: "var(--color-rule)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-graphite)",
                      borderColor: "var(--color-graphite-2)",
                      borderRadius: "6px",
                      color: "var(--color-graphite-ink)",
                      fontSize: "11px",
                      fontFamily: "var(--font-outlier)"
                    }}
                    formatter={(val: any) => [`$${Number(val).toFixed(2)}`, "Stock Value"]}
                  />
                  <Bar dataKey="value" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted font-mono">
                No category data available.
              </div>
            )}
          </div>
        </div>

        {/* Channel Share */}
        <div className="lg:col-span-5 p-5 rounded-card border border-rule bg-paper shadow-card space-y-4">
          <div>
            <h3 className="font-display font-semibold text-base text-ink">
              Channel Revenue Contribution
            </h3>
            <p className="text-xs text-muted">Retail vs Wholesale vs Online volume split</p>
          </div>

          <div className="h-64 w-full">
            {channelPie.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {channelPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-graphite)",
                      borderColor: "var(--color-graphite-2)",
                      borderRadius: "6px",
                      color: "var(--color-graphite-ink)",
                      fontSize: "11px",
                      fontFamily: "var(--font-outlier)"
                    }}
                    formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-outlier)" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted font-mono">
                No channel orders logged.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
