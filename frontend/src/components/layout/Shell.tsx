import React, { useEffect, useState } from "react";
import {
  Boxes,
  TrendingUp,
  ShoppingCart,
  BrainCircuit,
  ShieldAlert,
  BarChart3,
  Settings,
  Database,
  Menu,
  X,
  RefreshCw,
  Building2,
  Edit3,
  Trash2,
  Check,
  Plus
} from "lucide-react";
import { api } from "../../api/client";
import { useOrganization } from "../../context/OrganizationContext";

interface ShellProps {
  currentRoute: string;
  navigate: (route: string) => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ currentRoute, navigate, children }) => {
  const { organization, updateOrganization, clearCatalog, reloadDemoData } = useOrganization();
  const [dbMode, setDbMode] = useState<string>("connecting...");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Quick Org Edit Modal
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [orgForm, setOrgForm] = useState({
    name: organization.name,
    currency: organization.currency,
    currency_symbol: organization.currency_symbol,
    industry: organization.industry || "Retail & Consumer Goods",
    gstin: organization.gstin || "",
  });

  useEffect(() => {
    setOrgForm({
      name: organization.name,
      currency: organization.currency,
      currency_symbol: organization.currency_symbol,
      industry: organization.industry || "Retail & Consumer Goods",
      gstin: organization.gstin || "",
    });
  }, [organization]);

  useEffect(() => {
    api.checkHealth()
      .then((res) => {
        setDbMode(res.database.mode === "atlas" ? "MongoDB Atlas" : "In-Memory Store");
      })
      .catch(() => setDbMode("Offline"));
  }, []);

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.name.trim()) return;
    await updateOrganization(orgForm);
    setIsOrgModalOpen(false);
    setToastMsg(`Organization updated: "${orgForm.name}" (${orgForm.currency_symbol} ${orgForm.currency})`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await reloadDemoData();
      setToastMsg(`Seeded ${res.stats.products} products & ${res.stats.sales} sales records in ₹ INR.`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (e: any) {
      setToastMsg(`Seed error: ${e.message}`);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setSeeding(false);
    }
  };

  const handleClearCatalog = async () => {
    if (!window.confirm("Clear all products and sales so you can enter your own catalog from scratch?")) {
      return;
    }
    setClearing(true);
    try {
      await clearCatalog();
      setToastMsg("Catalog cleared. You can now add your own products!");
      setTimeout(() => setToastMsg(null), 4000);
      navigate("/inventory");
    } catch (e: any) {
      setToastMsg(`Error clearing catalog: ${e.message}`);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setClearing(false);
    }
  };

  const navItems = [
    { label: "Dashboard", route: "/dashboard", icon: BarChart3 },
    { label: "Inventory", route: "/inventory", icon: Boxes },
    { label: "Sales & Orders", route: "/sales", icon: ShoppingCart },
    { label: "Demand Forecast", route: "/forecasting", icon: TrendingUp },
    { label: "Replenishment", route: "/recommendations", icon: ShieldAlert },
    { label: "Analytics", route: "/analytics", icon: BrainCircuit },
    { label: "Settings", route: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-apple-text flex flex-col font-sans antialiased selection:bg-[#B76E79]/20 selection:text-apple-text">
      {/* Top Floating Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-6 z-50 bg-white/95 backdrop-blur-xl text-apple-text px-4 py-2.5 rounded-full text-xs font-medium shadow-apple-elevated border border-[#EFE7E4] flex items-center space-x-2.5 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#B76E79]"></span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar (Minimalist Off-White & Rose Gold) */}
        <aside className="hidden md:flex flex-col w-64 border-r border-[#EFE7E4] bg-[#FFFFFF] select-none">
          {/* Logo Brand */}
          <div className="h-16 px-5 border-b border-[#EFE7E4] flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="text-left group flex items-center space-x-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#EFE7E4] overflow-hidden flex items-center justify-center shadow-sm shrink-0 group-hover:border-[#B76E79]/50 transition-colors">
                <img src="/logo.jpg" alt="StockMind Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-semibold text-apple-text text-sm tracking-tight group-hover:text-[#B76E79] transition-colors block leading-tight">
                  StockMind AI
                </span>
                <span className="text-[10px] text-apple-text-tertiary font-mono">
                  Inventory OS
                </span>
              </div>
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FDF5F6] border border-[#F6D9DE] text-[#B76E79] font-semibold">
              {organization.currency_symbol} {organization.currency}
            </span>
          </div>

          {/* Active Organisation Card & Quick Switcher */}
          <div className="p-3 border-b border-[#EFE7E4] bg-[#FAF8F5]">
            <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#EFE7E4] flex items-center justify-between group hover:border-[#DE9FAD] transition-colors shadow-sm">
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-[#FDF5F6] border border-[#F6D9DE] flex items-center justify-center text-[#B76E79] shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1 pr-1">
                  <div className="text-xs font-semibold text-apple-text truncate leading-tight">
                    {organization.name}
                  </div>
                  <div className="text-[10px] text-apple-text-secondary truncate mt-0.5">
                    {organization.industry || "Active Store"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOrgModalOpen(true)}
                title="Edit Organization Name & Details"
                className="p-1.5 rounded-lg text-apple-text-secondary hover:text-[#B76E79] hover:bg-[#FAF4F3] transition-colors"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Nav List */}
          <nav className="flex-1 p-3.5 space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-apple-text-tertiary">
              Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[#FDF5F6] text-[#B76E79] shadow-sm border border-[#F6D9DE] font-semibold"
                      : "text-apple-text-secondary hover:text-apple-text hover:bg-[#FAF8F5]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#B76E79]" : "text-apple-text-tertiary"}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>}
                </button>
              );
            })}
          </nav>

          {/* Database Indicator & Reset / Clear Controls */}
          <div className="p-4 border-t border-[#EFE7E4] bg-[#FFFFFF] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-apple-text-secondary pb-1">
              <span className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-[#B76E79]" />
                <span className="font-mono text-[11px]">{dbMode}</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-apple-green"></span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleClearCatalog}
                disabled={clearing}
                title="Wipe demo data so you can enter your own products"
                className="apple-btn-secondary text-[10px] py-1.5 px-2 flex items-center justify-center space-x-1 text-apple-text-secondary hover:text-apple-red hover:border-apple-red/40"
              >
                <Trash2 className="w-3 h-3 shrink-0" />
                <span>{clearing ? "Clearing..." : "Clear Catalog"}</span>
              </button>

              <button
                onClick={handleSeed}
                disabled={seeding}
                title="Reload realistic 75-day dataset in INR"
                className="apple-btn-secondary text-[10px] py-1.5 px-2 flex items-center justify-center space-x-1 text-apple-text-secondary hover:text-[#B76E79] hover:border-[#DE9FAD]"
              >
                <RefreshCw className={`w-3 h-3 shrink-0 ${seeding ? "animate-spin" : ""}`} />
                <span>{seeding ? "Loading..." : "Demo Data"}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden h-14 px-4 border-b border-[#EFE7E4] bg-white/95 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <button onClick={() => navigate("/")} className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#EFE7E4] overflow-hidden flex items-center justify-center shrink-0">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </button>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-apple-text text-xs truncate max-w-[140px]">
                {organization.name}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FDF5F6] border border-[#F6D9DE] text-[#B76E79] font-semibold">
                {organization.currency_symbol}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsOrgModalOpen(true)}
              className="p-1.5 rounded-lg border border-[#EFE7E4] text-apple-text-secondary hover:text-[#B76E79] text-xs bg-white"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-[#EFE7E4] text-apple-text-secondary hover:text-[#B76E79] bg-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#EFE7E4] bg-white p-4 space-y-1">
            <div className="p-3 mb-2 rounded-xl bg-[#FAF8F5] border border-[#EFE7E4] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-apple-text">{organization.name}</div>
                <div className="text-[10px] text-apple-text-secondary">{organization.currency_symbol} {organization.currency}</div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsOrgModalOpen(true);
                }}
                className="text-xs text-[#B76E79] font-medium underline"
              >
                Change Org
              </button>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => {
                    navigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs ${
                    isActive ? "bg-[#FDF5F6] text-[#B76E79] font-semibold border border-[#F6D9DE]" : "text-apple-text-secondary hover:text-apple-text"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area with Ambient Lighting & Grid */}
        <main className="flex-1 overflow-y-auto bg-[#FAF8F5] flex flex-col relative">
          {/* Subtle Ambient Background Grid & Radial Spotlight */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.4]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(183, 110, 121, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(183, 110, 121, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse at 50% 10%, black 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 10%, black 20%, transparent 75%)",
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#B76E79]/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>

      {/* Quick Edit Organization Modal */}
      {isOrgModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="apple-card p-6 md:p-8 max-w-md w-full border border-[#EFE7E4] space-y-6 shadow-apple-elevated animate-fade-in bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7E4]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FDF5F6] border border-[#F6D9DE] flex items-center justify-center text-[#B76E79]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-apple-text tracking-tight">Organization Profile</h3>
                  <p className="text-[11px] text-apple-text-secondary">Configure store identity and default currency</p>
                </div>
              </div>
              <button
                onClick={() => setIsOrgModalOpen(false)}
                className="text-apple-text-secondary hover:text-apple-text p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrg} className="space-y-4 text-xs">
              <div>
                <label className="block text-apple-text-secondary font-medium mb-1.5">
                  Organisation / Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  placeholder="e.g. Modi Electronics, Tata Retail, Sharma Stores"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1.5">
                    Currency
                  </label>
                  <select
                    value={orgForm.currency}
                    onChange={(e) => {
                      const cur = e.target.value;
                      const sym = cur === "INR" ? "₹" : cur === "USD" ? "$" : cur === "EUR" ? "€" : "£";
                      setOrgForm({ ...orgForm, currency: cur, currency_symbol: sym });
                    }}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  >
                    <option value="INR">INR (₹) Indian Rupee</option>
                    <option value="USD">USD ($) US Dollar</option>
                    <option value="EUR">EUR (€) Euro</option>
                    <option value="GBP">GBP (£) British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1.5">
                    Industry Type
                  </label>
                  <input
                    type="text"
                    value={orgForm.industry}
                    onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })}
                    placeholder="e.g. Retail, Grocery, Hardware"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-apple-text-secondary font-medium mb-1.5">
                  GSTIN / Tax ID (Optional)
                </label>
                <input
                  type="text"
                  value={orgForm.gstin}
                  onChange={(e) => setOrgForm({ ...orgForm, gstin: e.target.value.toUpperCase() })}
                  placeholder="e.g. 27AAACB2212R1Z0"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15 uppercase"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOrgModalOpen(false)}
                  className="apple-btn-secondary py-2 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="apple-btn-primary py-2 px-5 text-xs flex items-center space-x-1.5 shadow-glow-blue-subtle"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Organization</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
