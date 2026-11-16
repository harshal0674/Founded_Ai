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
  ChevronRight
} from "lucide-react";
import { api } from "../../api/client";

interface ShellProps {
  currentRoute: string;
  navigate: (route: string) => void;
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ currentRoute, navigate, children }) => {
  const [dbMode, setDbMode] = useState<string>("connecting...");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    api.checkHealth()
      .then((res) => {
        setDbMode(res.database.mode === "atlas" ? "MongoDB Atlas" : "In-Memory Store");
      })
      .catch(() => setDbMode("Offline"));
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await api.seedDemoData();
      setToastMsg(`Seeded ${res.stats.products} products & ${res.stats.sales} sales records.`);
      setTimeout(() => setToastMsg(null), 4000);
      window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    } catch (e: any) {
      setToastMsg(`Seed error: ${e.message}`);
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setSeeding(false);
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
    <div className="min-h-screen bg-[#080808] text-apple-text flex flex-col font-sans antialiased selection:bg-apple-blue/30 selection:text-white">
      {/* Top Floating Apple Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-6 z-50 bg-[#161616]/95 backdrop-blur-xl text-white px-4 py-2.5 rounded-full text-xs font-medium shadow-apple-elevated border border-apple-border flex items-center space-x-2.5 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-apple-blue-bright"></span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar (Apple Dark Slate) */}
        <aside className="hidden md:flex flex-col w-64 border-r border-[#1D1D20] bg-[#0A0A0C] select-none">
          {/* Logo Brand */}
          <div className="h-16 px-6 border-b border-[#1D1D20] flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="text-left group flex items-center space-x-2.5 focus:outline-none"
            >
              <div className="w-6 h-6 rounded-full bg-apple-blue flex items-center justify-center text-white font-semibold text-xs">
                SM
              </div>
              <span className="font-semibold text-white text-sm tracking-tight group-hover:text-apple-blue-bright transition-colors">
                StockMind AI
              </span>
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#161618] border border-apple-border text-apple-text-secondary">
              v1.0
            </span>
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
                      ? "bg-[#18181B] text-white shadow-sm border border-apple-border/80"
                      : "text-apple-text-secondary hover:text-white hover:bg-[#121214]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-apple-blue-bright" : "text-apple-text-tertiary"}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-apple-blue-bright"></span>}
                </button>
              );
            })}
          </nav>

          {/* Database Indicator & Reset Demo Trigger */}
          <div className="p-4 border-t border-[#1D1D20] bg-[#0A0A0C] space-y-3">
            <div className="flex items-center justify-between text-xs text-apple-text-secondary">
              <span className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-apple-blue-bright" />
                <span className="font-mono text-[11px]">{dbMode}</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-apple-green"></span>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="w-full apple-btn-secondary text-[11px] py-2 px-3 flex items-center justify-center space-x-1.5 font-normal"
            >
              <RefreshCw className={`w-3 h-3 ${seeding ? "animate-spin text-apple-blue-bright" : ""}`} />
              <span>{seeding ? "Populating..." : "Reload Clean Demo Data"}</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden h-14 px-4 border-b border-[#1D1D20] bg-[#0A0A0C] flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-apple-blue flex items-center justify-center text-white font-semibold text-xs">
              SM
            </div>
            <span className="font-semibold text-white text-sm">StockMind AI</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-apple-border text-apple-text-secondary"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#1D1D20] bg-[#0A0A0C] p-4 space-y-1">
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
                    isActive ? "bg-[#18181B] text-white font-medium" : "text-apple-text-secondary"
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
        <main className="flex-1 overflow-y-auto bg-[#080808] flex flex-col relative">
          {/* Subtle Ambient Background Grid & Radial Spotlight */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.18]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse at 50% 10%, black 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 10%, black 20%, transparent 75%)",
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-apple-blue/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
