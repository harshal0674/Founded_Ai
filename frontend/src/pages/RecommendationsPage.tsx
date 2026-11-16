import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PackagePlus,
  RefreshCw,
  Clock,
  DollarSign,
  Truck
} from "lucide-react";
import { api } from "../api/client";
import { Recommendation, RecommendationOverview } from "../types";

export const RecommendationsPage: React.FC = () => {
  const [data, setData] = useState<RecommendationOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restockSuccess, setRestockSuccess] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRecommendations();
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load replenishment recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleInstantReorder = async (rec: Recommendation) => {
    if (!rec.suggested_order_qty || rec.suggested_order_qty <= 0) return;
    setActionLoadingId(rec.product_id);
    try {
      await api.restockProduct(rec.product_id, rec.suggested_order_qty);
      setRestockSuccess(`Inbound PO confirmed: Added ${rec.suggested_order_qty} units of ${rec.product_name} into inventory.`);
      setTimeout(() => setRestockSuccess(null), 5000);
      loadRecommendations();
      window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    } catch (err: any) {
      alert(`Restock failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1D1D20]">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Intelligent Replenishment Optimization
          </h1>
          <p className="text-xs md:text-sm text-apple-text-secondary mt-1">
            Dynamic Safety Stock (SS = Z·σ·√L) and Reorder Point (ROP) automation to eliminate stockouts while minimizing working capital.
          </p>
        </div>

        <button
          onClick={loadRecommendations}
          className="apple-btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-apple-blue-bright" : ""}`} />
          <span>Recompute Optimization</span>
        </button>
      </div>

      {/* Success Notification */}
      {restockSuccess && (
        <div className="p-3.5 bg-apple-green/10 border border-apple-green/30 rounded-xl text-xs text-apple-green flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{restockSuccess}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-apple-red/10 border border-apple-red/30 rounded-xl text-xs text-apple-red">
          {error}
        </div>
      )}

      {/* Priority Summary Cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="apple-card p-5 border-apple-red/40 space-y-1">
            <div className="flex items-center justify-between text-apple-red text-xs font-mono">
              <span>CRITICAL DEFICIT</span>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="font-bold text-3xl text-apple-red mt-1">
              {data.critical_count}
            </div>
            <p className="text-[11px] text-apple-text-secondary font-mono">Stockout or &lt; Lead Time</p>
          </div>

          <div className="apple-card p-5 border-apple-orange/40 space-y-1">
            <div className="flex items-center justify-between text-apple-orange text-xs font-mono">
              <span>REORDER TRIGGERED</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="font-bold text-3xl text-apple-orange mt-1">
              {data.high_count}
            </div>
            <p className="text-[11px] text-apple-text-secondary font-mono">Stock &le; Reorder Point</p>
          </div>

          <div className="apple-card p-5 space-y-1">
            <div className="flex items-center justify-between text-apple-text-secondary text-xs font-mono">
              <span>MONITOR CLOSELY</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-bold text-3xl text-white mt-1">
              {data.medium_count}
            </div>
            <p className="text-[11px] text-apple-text-secondary font-mono">Within 35% of ROP</p>
          </div>

          <div className="apple-card p-5 space-y-1">
            <div className="flex items-center justify-between text-apple-text-secondary text-xs font-mono">
              <span>REQUIRED CAPITAL</span>
              <DollarSign className="w-4 h-4 text-apple-blue-bright" />
            </div>
            <div className="font-bold text-2xl text-apple-blue-bright mt-1">
              ${data.total_capital_required.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-apple-text-secondary font-mono">To satisfy reorder triggers</p>
          </div>
        </div>
      )}

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-apple-text-secondary font-mono text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-apple-blue-bright mx-auto mb-2" />
            Evaluating stockout run rates across SKU catalog...
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-12 text-center text-apple-text-secondary font-mono text-xs apple-card">
            No recommendations generated.
          </div>
        ) : (
          data.items.map((rec) => {
            let urgencyBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-apple-green/10 text-apple-green border border-apple-green/20">
                Healthy
              </span>
            );
            let borderClass = "border-apple-border";

            if (rec.urgency === "critical") {
              urgencyBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-apple-red/10 text-apple-red border border-apple-red/40 font-semibold animate-pulse">
                  CRITICAL DEFICIT
                </span>
              );
              borderClass = "border-apple-red/40 bg-apple-red/[0.02]";
            } else if (rec.urgency === "high") {
              urgencyBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-apple-orange/10 text-apple-orange border border-apple-orange/40 font-semibold">
                  REORDER TRIGGERED
                </span>
              );
              borderClass = "border-apple-orange/40";
            } else if (rec.urgency === "medium") {
              urgencyBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#1E1E22] text-apple-text-secondary border border-apple-border">
                  Approaching ROP
                </span>
              );
            }

            return (
              <div
                key={rec.product_id}
                className={`p-6 rounded-2xl border ${borderClass} bg-apple-surface shadow-apple-card space-y-5 transition-all`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        {rec.product_name}
                      </h3>
                      {urgencyBadge}
                    </div>
                    <div className="font-mono text-xs text-apple-text-secondary">
                      SKU: {rec.sku} · Category: {rec.category} · Supplier: {rec.supplier_name}
                    </div>
                  </div>

                  {rec.action_required && (
                    <button
                      onClick={() => handleInstantReorder(rec)}
                      disabled={actionLoadingId === rec.product_id}
                      className="apple-btn-primary text-xs py-2 px-4 flex items-center space-x-2 self-start sm:self-auto shrink-0 shadow-glow-blue-subtle"
                    >
                      <PackagePlus className="w-3.5 h-3.5" />
                      <span>
                        {actionLoadingId === rec.product_id
                          ? "Executing PO..."
                          : `Place Reorder (${rec.suggested_order_qty} units)`}
                      </span>
                    </button>
                  )}
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3 border-t border-[#232327] font-mono text-xs">
                  <div className="p-3 bg-[#18181C] rounded-xl border border-apple-border">
                    <span className="block text-[10px] text-apple-text-secondary">Current Stock</span>
                    <span className={`text-base font-semibold ${rec.current_stock === 0 ? "text-apple-red" : "text-white"}`}>
                      {rec.current_stock} units
                    </span>
                  </div>

                  <div className="p-3 bg-[#18181C] rounded-xl border border-apple-border">
                    <span className="block text-[10px] text-apple-text-secondary">Daily Velocity</span>
                    <span className="text-base font-medium text-white">
                      {rec.daily_run_rate} /day
                    </span>
                  </div>

                  <div className="p-3 bg-[#18181C] rounded-xl border border-apple-border">
                    <span className="block text-[10px] text-apple-text-secondary">Days to Stockout</span>
                    <span className={`text-base font-semibold ${rec.days_until_stockout <= rec.lead_time_days ? "text-apple-red" : "text-white"}`}>
                      {rec.days_until_stockout} days
                    </span>
                  </div>

                  <div className="p-3 bg-[#18181C] rounded-xl border border-apple-border">
                    <span className="block text-[10px] text-apple-text-secondary">Lead Time</span>
                    <span className="text-base font-medium text-white">
                      {rec.lead_time_days} days
                    </span>
                  </div>

                  <div className="p-3 bg-[#18181C] rounded-xl border border-apple-border">
                    <span className="block text-[10px] text-apple-text-secondary">Safety Buffer</span>
                    <span className="text-base font-medium text-white">
                      {rec.safety_stock} units
                    </span>
                  </div>

                  <div className="p-3 bg-apple-blue/10 rounded-xl border border-apple-blue/30">
                    <span className="block text-[10px] text-apple-blue-bright font-semibold">Reorder Point</span>
                    <span className="text-base font-bold text-apple-blue-bright">
                      {rec.reorder_point} units
                    </span>
                  </div>
                </div>

                {/* Reasoning Box */}
                <div className="p-4 rounded-xl bg-[#18181C] border border-apple-border text-xs text-apple-text-secondary flex items-start space-x-3">
                  <Truck className="w-4 h-4 text-apple-blue-bright mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <span className="font-semibold text-white">Replenishment Audit: </span>
                    <span className="leading-relaxed">{rec.reasoning}</span>
                    {rec.action_required && (
                      <div className="pt-1.5 font-mono text-[11px] text-apple-text-secondary">
                        Recommended PO: <strong className="text-white">{rec.suggested_order_qty} units</strong> · Estimated Capital Outlay: <strong className="text-white">${rec.estimated_cost.toFixed(2)}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
