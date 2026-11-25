import React, { useEffect, useState } from "react";
import { RefreshCw, Building2 } from "lucide-react";
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
import { useOrganization } from "../context/OrganizationContext";
import { DashboardCharts, DashboardStats, Product, Sale } from "../types";

export const AnalyticsPage: React.FC = () => {
  const { organization, formatCurrency, currencySymbol } = useOrganization();
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cData, sData, salesList] = await Promise.all([
        api.getDashboardCharts(),
        api.getDashboardStats(),
        api.getSales({ limit: 300 }),
      ]);
      setCharts(cData);
      setStats(sData);
      setSales(salesList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const channelData: { [key: string]: number } = {};
  sales.forEach((s) => {
    const c = s.customer_type || "retail";
    channelData[c] = (channelData[c] || 0) + s.total_price;
  });
  const channelPie = Object.entries(channelData).map(([name, value]) => ({
    name: name.toUpperCase(),
    value: Math.round(value),
  }));

  const COLORS = ["#B76E79", "#D4A373", "#8FA287", "#C5808B"];

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#EFE7E4]">
        <div>
          <div className="flex items-center space-x-2 text-[#B76E79] text-xs font-mono mb-1 font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span>•</span>
            <span>Portfolio Valuation ({currencySymbol} {organization.currency})</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-apple-text tracking-tight">
            Inventory & Channel Analytics
          </h1>
          <p className="text-xs md:text-sm text-apple-text-secondary mt-1">
            Deep-dive working capital allocation, margin velocity, and multi-channel fulfillment ratios.
          </p>
        </div>

        <button
          onClick={loadData}
          className="apple-btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B76E79]" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="apple-card min-w-0 overflow-hidden p-3.5 sm:p-5 space-y-1 bg-white border border-[#EFE7E4]">
          <span className="text-[10px] sm:text-[11px] font-mono text-apple-text-secondary truncate block">Balance Sheet Valuation</span>
          <div
            className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-apple-text font-mono truncate"
            title={stats ? formatCurrency(stats.total_stock_value) : formatCurrency(0)}
          >
            {stats ? formatCurrency(stats.total_stock_value) : formatCurrency(0)}
          </div>
          <p className="text-[10px] text-apple-text-secondary font-mono truncate">Current capital in inventory</p>
        </div>

        <div className="apple-card min-w-0 overflow-hidden p-3.5 sm:p-5 space-y-1 bg-white border border-[#EFE7E4]">
          <span className="text-[10px] sm:text-[11px] font-mono text-apple-text-secondary truncate block">30-Day Revenue</span>
          <div
            className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-[#B76E79] font-mono truncate"
            title={stats ? formatCurrency(stats.total_revenue_30d) : formatCurrency(0)}
          >
            {stats ? formatCurrency(stats.total_revenue_30d) : formatCurrency(0)}
          </div>
          <p className="text-[10px] text-apple-text-secondary font-mono truncate">Gross channel throughput</p>
        </div>

        <div className="apple-card min-w-0 overflow-hidden p-3.5 sm:p-5 space-y-1 bg-white border border-[#EFE7E4]">
          <span className="text-[10px] sm:text-[11px] font-mono text-apple-text-secondary truncate block">Active SKUs</span>
          <div className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-apple-text truncate">
            {stats?.total_products || 0}
          </div>
          <p className="text-[10px] text-apple-text-secondary font-mono truncate">Tracked product lines</p>
        </div>

        <div className="apple-card min-w-0 overflow-hidden p-3.5 sm:p-5 space-y-1 bg-white border border-[#EFE7E4]">
          <span className="text-[10px] sm:text-[11px] font-mono text-apple-text-secondary truncate block">Annualized Turnover</span>
          <div className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-[#B76E79] truncate">
            {stats && stats.total_stock_value > 0
              ? (stats.total_revenue_30d / stats.total_stock_value * 12).toFixed(1)
              : "0.0"}x
          </div>
          <p className="text-[10px] text-apple-text-secondary font-mono truncate">Turn velocity benchmark</p>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-7 apple-card p-6 md:p-8 space-y-5 bg-white border border-[#EFE7E4]">
          <div>
            <h3 className="text-base font-semibold text-apple-text tracking-tight">
              Capital Allocation by Category
            </h3>
            <p className="text-xs text-apple-text-secondary mt-0.5">Total inventory value held per category</p>
          </div>

          <div className="h-64 w-full">
            {charts?.category_distribution && charts.category_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.category_distribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2ECE8" />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#8E8588" }} axisLine={{ stroke: "#EFE7E4" }} />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#8E8588" }}
                    axisLine={false}
                    tickFormatter={(v) => `${currencySymbol}${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#EFE7E4",
                      borderRadius: "12px",
                      color: "#1C191A",
                      fontSize: "11px",
                      fontFamily: "Inter, sans-serif",
                      boxShadow: "0 8px 30px -4px rgba(183, 110, 121, 0.15)"
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), "Stock Value"]}
                  />
                  <Bar dataKey="value" fill="#B76E79" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-apple-text-secondary font-mono">
                No category data available.
              </div>
            )}
          </div>
        </div>

        {/* Channel Share */}
        <div className="lg:col-span-5 apple-card p-6 md:p-8 space-y-5 bg-white border border-[#EFE7E4]">
          <div>
            <h3 className="text-base font-semibold text-apple-text tracking-tight">
              Channel Revenue Contribution
            </h3>
            <p className="text-xs text-apple-text-secondary mt-0.5">Retail vs Wholesale vs Online revenue mix</p>
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
                    innerRadius={50}
                    paddingAngle={4}
                  >
                    {channelPie.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#EFE7E4",
                      borderRadius: "12px",
                      color: "#1C191A",
                      fontSize: "11px",
                      fontFamily: "Inter, sans-serif",
                      boxShadow: "0 8px 30px -4px rgba(183, 110, 121, 0.15)"
                    }}
                    formatter={(v: any) => [formatCurrency(Number(v)), "Revenue"]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "Inter, sans-serif" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-apple-text-secondary font-mono">
                No channel orders logged.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
