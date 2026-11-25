import React, { useEffect, useState } from "react";
import { Shell } from "./components/layout/Shell";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { OrganizationProvider } from "./context/OrganizationContext";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InventoryPage } from "./pages/InventoryPage";
import { SalesPage } from "./pages/SalesPage";
import { ForecastingPage } from "./pages/ForecastingPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";

const AppContent: React.FC<{
  currentPath: string;
  navigate: (path: string) => void;
}> = ({ currentPath, navigate }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#B76E79] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-apple-text-secondary">
          Authenticating Customer Workspace...
        </span>
      </div>
    );
  }

  // Explicit Login Route
  if (currentPath === "/login") {
    return <LoginPage navigate={navigate} />;
  }

  // Public Landing Page
  if (currentPath === "/" || currentPath === "") {
    return (
      <OrganizationProvider>
        <LandingPage navigate={navigate} />
      </OrganizationProvider>
    );
  }

  // Protected Routes: Require login
  if (!isAuthenticated) {
    return <LoginPage navigate={navigate} />;
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
            <h2 className="text-xl font-display font-semibold text-apple-text">404 — Route Not Found</h2>
            <p className="text-xs text-apple-text-secondary font-mono">The requested path '{currentPath}' does not exist.</p>
            <button onClick={() => navigate("/dashboard")} className="apple-btn-primary text-xs px-4 py-2">
              Return to Dashboard
            </button>
          </div>
        )}
      </Shell>
    </OrganizationProvider>
  );
};

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

  return (
    <AuthProvider>
      <AppContent currentPath={currentPath} navigate={navigate} />
    </AuthProvider>
  );
};

export default App;
