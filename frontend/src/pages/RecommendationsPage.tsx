import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PackagePlus,
  RefreshCw,
  Clock,
  DollarSign,
  Truck,
  ArrowRight
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
    <div className="p-6 md:p-8 space-y-6 max-w-[var(--container)] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-rule">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">
            Intelligent Replenishment Optimization
          </h1>
          <p className="text-xs md:text-sm text-ink-2 mt-0.5">
            Dynamic Safety Stock (SS = Z·σ·√L) and Reorder Point (ROP) automation to eliminate stockouts while minimizing working capital.
          </p>
        </div>

        <button
          onClick={loadRecommendations}
          className="keycap text-xs py-2 px-3 text-ink-2 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`} />
          <span>Recompute Optimization</span>
        </button>
      </div>

      {/* Success Notification */}
      {restockSuccess && (
        <div className="p-3 bg-success/10 border border-success/30 rounded text-xs text-success flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{restockSuccess}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-danger/10 border border-danger/30 rounded text-xs text-danger">
          {error}
        </div>
      )}

      {/* Priority Tally Banners */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-paper rounded-card border-2 border-danger/40 shadow-card">
            <div className="flex items-center justify-between text-danger text-xs font-mono">
              <span>CRITICAL DEFICIT</span>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="font-display font-semibold text-3xl text-danger mt-1">
              {data.critical_count}
            </div>
            <p className="text-[11px] text-muted font-mono mt-1">Days &lt; Lead Time or 0 Units</p>
          </div>

          <div className="p-4 bg-paper rounded-card border border-amber-500/40 shadow-card">
            <div className="flex items-center justify-between text-amber-600 text-xs font-mono">
              <span>REORDER TRIGGERED</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="font-display font-semibold text-3xl text-amber-600 mt-1">
              {data.high_count}
            </div>
            <p className="text-[11px] text-muted font-mono mt-1">Stock &le; Reorder Point (ROP)</p>
          </div>

          <div className="p-4 bg-paper rounded-card border border-rule shadow-card">
            <div className="flex items-center justify-between text-muted text-xs font-mono">
              <span>MONITOR CLOSELY</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-display font-semibold text-3xl text-ink mt-1">
              {data.medium_count}
            </div>
            <p className="text-[11px] text-muted font-mono mt-1">Within 35% of ROP</p>
          </div>

          <div className="p-4 bg-paper rounded-card border border-rule shadow-card">
            <div className="flex items-center justify-between text-muted text-xs font-mono">
              <span>REQUIRED CAPITAL</span>
              <DollarSign className="w-4 h-4 text-accent" />
            </div>
            <div className="font-display font-semibold text-2xl text-accent mt-1">
              ${data.total_capital_required.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted font-mono mt-1">To satisfy pending orders</p>
          </div>
        </div>
      )}

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-muted font-mono text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-accent mx-auto mb-2" />
            Evaluating stockout run rates across entire SKU catalog...
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-12 text-center text-muted font-mono text-xs border border-rule rounded-card bg-paper">
            No recommendations generated. Add products or record sales to begin.
          </div>
        ) : (
          data.items.map((rec) => {
            let urgencyBadge = (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-success/10 text-success border border-success/30">
                Healthy
              </span>
            );
            let borderClass = "border-rule";

            if (rec.urgency === "critical") {
              urgencyBadge = (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-danger/10 text-danger border border-danger/40 font-semibold animate-pulse">
                  CRITICAL DEFICIT
                </span>
              );
              borderClass = "border-danger/50 bg-danger/[0.02]";
            } else if (rec.urgency === "high") {
              urgencyBadge = (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-700 border border-amber-500/40 font-semibold">
                  REORDER REQUIRED
                </span>
              );
              borderClass = "border-amber-500/40";
            } else if (rec.urgency === "medium") {
              urgencyBadge = (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-paper-3 text-ink-2 border border-rule">
                  Approaching ROP
                </span>
              );
            }

            return (
              <div
                key={rec.product_id}
                className={`p-5 rounded-card border ${borderClass} bg-paper shadow-card space-y-4 transition-all`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-display font-semibold text-base text-ink">
                        {rec.product_name}
                      </h3>
                      {urgencyBadge}
                    </div>
                    <div className="font-mono text-xs text-muted">
                      SKU: {rec.sku} · Category: {rec.category} · Supplier: {rec.supplier_name}
                    </div>
                  </div>

                  {rec.action_required && (
                    <button
                      onClick={() => handleInstantReorder(rec)}
                      disabled={actionLoadingId === rec.product_id}
                      className="keycap keycap-primary text-xs py-2 px-3.5 flex items-center space-x-1.5 self-start sm:self-auto shrink-0"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2 border-t border-rule font-mono text-xs">
                  <div className="p-2.5 bg-paper-2 rounded border border-rule">
                    <span className="block text-[10px] text-muted">Current Stock</span>
                    <span className={`text-sm font-semibold ${rec.current_stock === 0 ? "text-danger" : "text-ink"}`}>
                      {rec.current_stock} units
                    </span>
                  </div>

                  <div className="p-2.5 bg-paper-2 rounded border border-rule">
                    <span className="block text-[10px] text-muted">Daily Velocity</span>
                    <span className="text-sm font-medium text-ink">
                      {rec.daily_run_rate} /day
                    </span>
                  </div>

                  <div className="p-2.5 bg-paper-2 rounded border border-rule">
                    <span className="block text-[10px] text-muted">Days to Stockout</span>
                    <span className={`text-sm font-semibold ${rec.days_until_stockout <= rec.lead_time_days ? "text-danger" : "text-ink"}`}>
                      {rec.days_until_stockout} days
                    </span>
                  </div>

                  <div className="p-2.5 bg-paper-2 rounded border border-rule">
                    <span className="block text-[10px] text-muted">Lead Time (L)</span>
                    <span className="text-sm font-medium text-ink">
                      {rec.lead_time_days} days
                    </span>
                  </div>

                  <div className="p-2.5 bg-paper-2 rounded border border-rule">
                    <span className="block text-[10px] text-muted">Safety Buffer (SS)</span>
                    <span className="text-sm font-medium text-ink">
                      {rec.safety_stock} units
                    </span>
                  </div>

                  <div className="p-2.5 bg-paper-2 rounded border border-accent/30 bg-accent-wash/30">
                    <span className="block text-[10px] text-accent font-semibold">Reorder Point (ROP)</span>
                    <span className="text-sm font-semibold text-accent">
                      {rec.reorder_point} units
                    </span>
                  </div>
                </div>

                {/* Reasoning Box */}
                <div className="p-3 rounded bg-paper-2 border border-rule text-xs text-ink-2 flex items-start space-x-2">
                  <Truck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <span className="font-semibold text-ink">Optimization Audit: </span>
                    <span className="leading-relaxed">{rec.reasoning}</span>
                    {rec.action_required && (
                      <div className="pt-1 font-mono text-[11px] text-muted">
                        Suggested Inbound PO: <strong className="text-ink">{rec.suggested_order_qty} units</strong> · Est Outlay: <strong className="text-ink">${rec.estimated_cost.toFixed(2)}</strong>
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
