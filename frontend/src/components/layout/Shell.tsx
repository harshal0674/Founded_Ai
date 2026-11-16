import React, { useEffect, useState } from "react";
import {
  Boxes,
  TrendingUp,
  ShoppingCart,
  BrainCircuit,
  ShieldAlert,
  BarChart3,
  Settings,
  ArrowRight,
  Database,
  ExternalLink,
  Menu,
  X,
  RefreshCw
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
      .catch(() => setDbMode("Offline (Mock)"));
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await api.seedDemoData();
      setToastMsg(`Seeded ${res.stats.products} products & ${res.stats.sales} sales records.`);
      setTimeout(() => setToastMsg(null), 4000);
      // Reload current page if on dashboard/inventory
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
    <div className="min-h-screen bg-paper flex flex-col antialiased">
      {/* Top Notification Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-[var(--z-toast)] bg-graphite text-graphite-ink px-4 py-2.5 rounded-input text-xs font-mono shadow-card border border-rule flex items-center space-x-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-rule bg-paper-2 select-none">
          {/* Logo & Identity */}
          <div className="h-16 px-5 border-b border-rule flex items-center justify-between">
            <button 
              onClick={() => navigate("/")} 
              className="text-left group flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center text-accent-ink font-display font-semibold text-xs tracking-tighter">
                SM
              </div>
              <span className="font-display font-semibold text-ink text-base tracking-tight group-hover:text-accent transition-colors">
                StockMind AI
              </span>
            </button>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-rule-2 bg-paper text-muted">
              v1.0
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-display font-medium text-muted uppercase tracking-wider">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-input text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent-wash text-accent font-semibold border-l-2 border-accent"
                      : "text-ink-2 hover:bg-paper-3 hover:text-ink"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-muted"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Status & Seed Trigger */}
          <div className="p-3.5 border-t border-rule bg-paper space-y-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-accent" />
                <span className="font-mono text-[11px]">{dbMode}</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-success"></span>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="w-full keycap text-xs py-1.5 px-2 text-ink-2 flex items-center justify-center space-x-1.5"
              title="Reset and reload realistic multi-category demo dataset"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin text-accent" : ""}`} />
              <span>{seeding ? "Generating..." : "Reload Demo Data"}</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden h-14 px-4 border-b border-rule bg-paper-2 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-sm bg-accent flex items-center justify-center text-accent-ink font-display font-semibold text-xs">
              SM
            </div>
            <span className="font-display font-semibold text-ink text-sm">StockMind AI</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-input border border-rule text-ink-2"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-rule bg-paper p-3 space-y-1">
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
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-input text-sm ${
                    isActive ? "bg-accent-wash text-accent font-semibold" : "text-ink-2"
                  }`}
                >
                  <Icon className="w-4 h-4 text-muted" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-paper flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};
