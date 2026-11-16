import React, { useEffect, useState } from "react";
import { Settings, Database, RefreshCw, Server, ShieldCheck, CheckCircle2 } from "lucide-react";
import { api } from "../api/client";

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const h = await api.checkHealth();
      setHealth(h);
    } catch (e: any) {
      setHealth({ status: "unreachable", error: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await api.seedDemoData();
      setSeedResult(`Database re-initialized! Inserted ${res.stats.products} products and ${res.stats.sales} historical sales records.`);
      window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    } catch (e: any) {
      setSeedResult(`Seed error: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[var(--container)] mx-auto w-full">
      {/* Header */}
      <div className="pb-4 border-b border-rule">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">
          System Settings & Infrastructure
        </h1>
        <p className="text-xs md:text-sm text-ink-2 mt-0.5">
          Backend server diagnostics, MongoDB Atlas connectivity status, and demo dataset controls.
        </p>
      </div>

      {seedResult && (
        <div className="p-3 bg-success/10 border border-success/30 rounded text-xs text-success flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{seedResult}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend & Database Telemetry */}
        <div className="p-5 rounded-card border border-rule bg-paper shadow-card space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-rule">
            <Server className="w-4 h-4 text-accent" />
            <h3 className="font-display font-semibold text-base text-ink">
              Backend Service Telemetry
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-rule">
              <span className="text-muted">API Health Status:</span>
              <span className={`font-semibold ${health?.status === "ok" ? "text-success" : "text-danger"}`}>
                {health?.status || "Checking..."}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-rule">
              <span className="text-muted">Service Version:</span>
              <span className="text-ink">{health?.version || "1.0.0"}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-rule">
              <span className="text-muted">Active Database Layer:</span>
              <span className="text-accent font-semibold">
                {health?.database?.mode === "atlas" ? "MongoDB Atlas (Live Cluster)" : "High-Performance In-Memory Store"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-rule">
              <span className="text-muted">Environment:</span>
              <span className="text-ink">{health?.environment || "production"}</span>
            </div>
          </div>

          <button
            onClick={checkHealth}
            disabled={loading}
            className="w-full keycap text-xs py-2 text-ink-2 flex items-center justify-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`} />
            <span>Re-verify Connection</span>
          </button>
        </div>

        {/* Demo Dataset Management */}
        <div className="p-5 rounded-card border border-rule bg-paper shadow-card space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-rule">
            <Database className="w-4 h-4 text-accent" />
            <h3 className="font-display font-semibold text-base text-ink">
              Demo Dataset & State Reset
            </h3>
          </div>

          <p className="text-xs text-ink-2 leading-relaxed">
            Re-populate the database with 10 realistic multi-category SKUs across Industrial Sensors, Hardware, Electronics, and Packaging, paired with 75 days of seasonal sales transactions for live ML forecasting.
          </p>

          <div className="p-3 bg-paper-2 rounded border border-rule text-[11px] font-mono text-muted space-y-1">
            <div>· 10 Products with realistic lead times (3 to 14 days)</div>
            <div>· 75-Day Sales history with weekend/weekday cycles</div>
            <div>· Pre-configured stockout and reorder triggers</div>
          </div>

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full keycap keycap-primary text-xs py-2.5 flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
            <span>{seeding ? "Generating Data & Retraining ML..." : "Reload Clean Demo Dataset"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
