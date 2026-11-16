import React, { useEffect, useState } from "react";
import { Database, RefreshCw, Server, CheckCircle2 } from "lucide-react";
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
      setSeedResult(`Database refreshed! Loaded ${res.stats.products} products and ${res.stats.sales} historical sales records.`);
      window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    } catch (e: any) {
      setSeedResult(`Seed error: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-[#1D1D20]">
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          System Preferences & Diagnostics
        </h1>
        <p className="text-xs md:text-sm text-apple-text-secondary mt-1">
          Backend server status, MongoDB Atlas telemetry, and dataset management.
        </p>
      </div>

      {seedResult && (
        <div className="p-4 bg-apple-green/10 border border-apple-green/30 rounded-2xl text-xs text-apple-green flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{seedResult}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend & DB Telemetry */}
        <div className="apple-card p-6 md:p-8 space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-apple-border">
            <Server className="w-4 h-4 text-apple-blue-bright" />
            <h3 className="font-semibold text-base text-white tracking-tight">
              Backend Service Telemetry
            </h3>
          </div>

          <div className="space-y-3.5 font-mono text-xs">
            <div className="flex justify-between py-1.5 border-b border-apple-border">
              <span className="text-apple-text-secondary">API Health Status:</span>
              <span className={`font-semibold ${health?.status === "ok" ? "text-apple-green" : "text-apple-red"}`}>
                {health?.status || "Checking..."}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-apple-border">
              <span className="text-apple-text-secondary">Engine Version:</span>
              <span className="text-white">{health?.version || "1.0.0"}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-apple-border">
              <span className="text-apple-text-secondary">Active Storage Engine:</span>
              <span className="text-apple-blue-bright font-semibold">
                {health?.database?.mode === "atlas" ? "MongoDB Atlas (Cloud Cluster)" : "High-Performance In-Memory Engine"}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-apple-border">
              <span className="text-apple-text-secondary">Environment:</span>
              <span className="text-white">{health?.environment || "production"}</span>
            </div>
          </div>

          <button
            onClick={checkHealth}
            disabled={loading}
            className="w-full apple-btn-secondary text-xs py-2.5 flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-apple-blue-bright" : ""}`} />
            <span>Re-verify Connection</span>
          </button>
        </div>

        {/* Demo Dataset Management */}
        <div className="apple-card p-6 md:p-8 space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-apple-border">
            <Database className="w-4 h-4 text-apple-blue-bright" />
            <h3 className="font-semibold text-base text-white tracking-tight">
              Dataset & Sandbox Controls
            </h3>
          </div>

          <p className="text-xs text-apple-text-secondary leading-relaxed">
            Re-populate the database with 10 realistic multi-category SKUs across Industrial Sensors, Hardware, Electronics, and Packaging, paired with 75 days of seasonal sales transactions for live ML forecasting.
          </p>

          <div className="p-4 bg-[#18181C] rounded-xl border border-apple-border text-[11px] font-mono text-apple-text-secondary space-y-1.5">
            <div>· 10 SKUs with verified lead times (3 to 14 days)</div>
            <div>· 75-Day multi-channel sales records with weekday/weekend cycles</div>
            <div>· Real-time stockout and reorder trigger scenarios</div>
          </div>

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full apple-btn-primary text-xs py-3 flex items-center justify-center space-x-2 shadow-glow-blue-subtle"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
            <span>{seeding ? "Generating Dataset & Retraining ML..." : "Reload Baseline Demo Dataset"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
