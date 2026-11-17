import React, { useEffect, useState } from "react";
import { Shell } from "./components/layout/Shell";
import { OrganizationProvider } from "./context/OrganizationContext";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InventoryPage } from "./pages/InventoryPage";
import { SalesPage } from "./pages/SalesPage";
import { ForecastingPage } from "./pages/ForecastingPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || "/";
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  // Route matching
  if (currentPath === "/" || currentPath === "") {
    return (
      <OrganizationProvider>
        <LandingPage navigate={navigate} />
      </OrganizationProvider>
    );
  }

  return (
    <OrganizationProvider>
      <Shell currentRoute={currentPath} navigate={navigate}>
        {currentPath === "/dashboard" && <DashboardPage navigate={navigate} />}
        {currentPath === "/inventory" && <InventoryPage />}
        {currentPath === "/sales" && <SalesPage />}
        {currentPath === "/forecasting" && <ForecastingPage />}
        {currentPath === "/recommendations" && <RecommendationsPage />}
        {currentPath === "/analytics" && <AnalyticsPage />}
        {currentPath === "/settings" && <SettingsPage />}
        {![
          "/dashboard",
          "/inventory",
          "/sales",
          "/forecasting",
          "/recommendations",
          "/analytics",
          "/settings",
        ].includes(currentPath) && (
          <div className="p-12 text-center space-y-4">
            <h2 className="text-xl font-display font-semibold text-ink">404 — Route Not Found</h2>
            <p className="text-xs text-muted font-mono">The requested path '{currentPath}' does not exist.</p>
            <button onClick={() => navigate("/dashboard")} className="keycap keycap-primary text-xs px-4 py-2">
              Return to Dashboard
            </button>
          </div>
        )}
      </Shell>
    </OrganizationProvider>
  );
};

export default App;
