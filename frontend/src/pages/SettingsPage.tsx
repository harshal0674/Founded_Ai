import React, { useEffect, useState } from "react";
import { Database, RefreshCw, Server, CheckCircle2, Building2, Trash2, Check, Globe } from "lucide-react";
import { api } from "../api/client";
import { useOrganization } from "../context/OrganizationContext";

export const SettingsPage: React.FC = () => {
  const { organization, updateOrganization, clearCatalog, reloadDemoData } = useOrganization();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: organization.name,
    currency: organization.currency,
    currency_symbol: organization.currency_symbol,
    industry: organization.industry || "Retail & Consumer Goods",
    gstin: organization.gstin || "",
    address: organization.address || "India",
    phone: organization.phone || "",
  });

  useEffect(() => {
    setFormData({
      name: organization.name,
      currency: organization.currency,
      currency_symbol: organization.currency_symbol,
      industry: organization.industry || "Retail & Consumer Goods",
      gstin: organization.gstin || "",
      address: organization.address || "India",
      phone: organization.phone || "",
    });
  }, [organization]);

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

  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOrg(true);
    setFeedbackMsg(null);
    try {
      await updateOrganization(formData);
      setFeedbackMsg({
        text: `Organization settings saved successfully! Currency set to ${formData.currency_symbol} ${formData.currency}.`,
        type: "success"
      });
      setTimeout(() => setFeedbackMsg(null), 5000);
    } catch (e: any) {
      setFeedbackMsg({ text: `Failed to save organization: ${e.message}`, type: "error" });
    } finally {
      setSavingOrg(false);
    }
  };

  const handleClearCatalog = async () => {
    if (!window.confirm("Wipe all products and sales so you can enter your own catalog from scratch?")) {
      return;
    }
    setClearing(true);
    setFeedbackMsg(null);
    try {
      await clearCatalog();
      setFeedbackMsg({
        text: "Inventory catalog cleared. You can now add your own products in the Inventory page!",
        type: "success"
      });
      setTimeout(() => setFeedbackMsg(null), 6000);
    } catch (e: any) {
      setFeedbackMsg({ text: `Error clearing catalog: ${e.message}`, type: "error" });
    } finally {
      setClearing(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setFeedbackMsg(null);
    try {
      const res = await reloadDemoData();
      setFeedbackMsg({
        text: `Database refreshed! Loaded ${res.stats.products} products and ${res.stats.sales} historical sales records priced in ₹ INR.`,
        type: "success"
      });
      setTimeout(() => setFeedbackMsg(null), 6000);
    } catch (e: any) {
      setFeedbackMsg({ text: `Seed error: ${e.message}`, type: "error" });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-[#EFE7E4]">
        <div className="flex items-center space-x-2 text-[#B76E79] text-xs font-mono mb-1 font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>{organization.name}</span>
          <span>•</span>
          <span>Default Currency: {organization.currency_symbol} {organization.currency}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-apple-text tracking-tight">
          System Preferences & Organization
        </h1>
        <p className="text-xs md:text-sm text-apple-text-secondary mt-1">
          Configure your business identity, select active currency, manage product catalogs, and inspect system telemetry.
        </p>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 font-medium ${
            feedbackMsg.type === "success"
              ? "bg-apple-green/10 border border-apple-green/30 text-apple-green"
              : "bg-apple-red/10 border border-apple-red/30 text-apple-red"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Organization Setup Card */}
      <div className="apple-card p-6 md:p-8 space-y-6 bg-white border border-[#EFE7E4]">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#EFE7E4]">
          <div className="w-9 h-9 rounded-xl bg-[#FDF5F6] border border-[#F6D9DE] flex items-center justify-center text-[#B76E79]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-apple-text tracking-tight">
              Organization & Business Profile
            </h3>
            <p className="text-xs text-apple-text-secondary">
              Name of your store/company and financial presentation currency across StockMind AI.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveOrganization} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-apple-text-secondary font-medium mb-1.5">
                Organisation / Store Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Modi Electronics, Tata Retail, Sharma Stores"
                className="w-full p-3 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
              />
            </div>

            <div>
              <label className="block text-apple-text-secondary font-medium mb-1.5">
                Primary Currency *
              </label>
              <select
                value={formData.currency}
                onChange={(e) => {
                  const cur = e.target.value;
                  const sym = cur === "INR" ? "₹" : cur === "USD" ? "$" : cur === "EUR" ? "€" : "£";
                  setFormData({ ...formData, currency: cur, currency_symbol: sym });
                }}
                className="w-full p-3 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
              >
                <option value="INR">INR (₹) Indian Rupee</option>
                <option value="USD">USD ($) US Dollar</option>
                <option value="EUR">EUR (€) Euro</option>
                <option value="GBP">GBP (£) British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-apple-text-secondary font-medium mb-1.5">
                Business Type / Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Retail, Supermarket, Consumer Electronics, FMCG"
                className="w-full p-3 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
              />
            </div>

            <div>
              <label className="block text-apple-text-secondary font-medium mb-1.5">
                GSTIN / Tax Registration (Optional)
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                placeholder="e.g. 27AAACB2212R1Z0"
                className="w-full p-3 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15 uppercase"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingOrg}
              className="apple-btn-primary py-2.5 px-6 text-xs flex items-center space-x-2 shadow-glow-blue-subtle"
            >
              <Check className="w-4 h-4" />
              <span>{savingOrg ? "Saving..." : "Save Organization Profile"}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend & DB Telemetry */}
        <div className="apple-card p-6 md:p-8 space-y-5 bg-white border border-[#EFE7E4]">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#EFE7E4]">
            <Server className="w-4 h-4 text-[#B76E79]" />
            <h3 className="font-semibold text-base text-apple-text tracking-tight">
              Backend Service Telemetry
            </h3>
          </div>

          <div className="space-y-3.5 font-mono text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#EFE7E4]">
              <span className="text-apple-text-secondary">API Health Status:</span>
              <span className={`font-semibold ${health?.status === "ok" ? "text-apple-green" : "text-apple-red"}`}>
                {health?.status || "Checking..."}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#EFE7E4]">
              <span className="text-apple-text-secondary">Engine Version:</span>
              <span className="text-apple-text">{health?.version || "1.0.0"}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#EFE7E4]">
              <span className="text-apple-text-secondary">Active Storage Engine:</span>
              <span className="text-[#B76E79] font-semibold">
                {health?.database?.mode === "atlas" ? "MongoDB Atlas (Cloud Cluster)" : "High-Performance In-Memory Engine"}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#EFE7E4]">
              <span className="text-apple-text-secondary">Active Currency:</span>
              <span className="text-apple-text font-semibold">{organization.currency_symbol} {organization.currency}</span>
            </div>
          </div>

          <button
            onClick={checkHealth}
            disabled={loading}
            className="w-full apple-btn-secondary text-xs py-2.5 flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B76E79]" : ""}`} />
            <span>Re-verify Connection</span>
          </button>
        </div>

        {/* Catalog & Sandbox Controls */}
        <div className="apple-card p-6 md:p-8 space-y-5 flex flex-col justify-between bg-white border border-[#EFE7E4]">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-[#EFE7E4]">
              <Database className="w-4 h-4 text-[#B76E79]" />
              <h3 className="font-semibold text-base text-apple-text tracking-tight">
                Catalog & Dataset Controls
              </h3>
            </div>

            <p className="text-xs text-apple-text-secondary leading-relaxed">
              Choose between entering your own custom inventory products or loading realistic sample data priced in Indian Rupees (₹).
            </p>

            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EFE7E4] text-[11px] font-mono text-apple-text-secondary space-y-1.5">
              <div>· Option A: Clear all sample data and start fresh with your own SKUs</div>
              <div>· Option B: Load 10 pre-configured multi-category SKUs in ₹ INR</div>
              <div>· 75-Day multi-channel sales history with cyclical demand</div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleClearCatalog}
              disabled={clearing}
              className="w-full apple-btn-secondary text-xs py-2.5 flex items-center justify-center space-x-2 text-apple-text-secondary hover:text-apple-red hover:border-apple-red/40"
            >
              <Trash2 className="w-3.5 h-3.5 text-apple-red shrink-0" />
              <span>{clearing ? "Wiping Catalog..." : "Clear Catalog (Enter Products by Myself)"}</span>
            </button>

            <button
              onClick={handleSeed}
              disabled={seeding}
              className="w-full apple-btn-primary text-xs py-2.5 flex items-center justify-center space-x-2 shadow-glow-blue-subtle"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
              <span>{seeding ? "Generating Dataset & Retraining ML..." : "Reload Baseline Demo Dataset (in ₹ INR)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
