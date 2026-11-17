import React, { createContext, useContext, useEffect, useState } from "react";
import { OrganizationProfile } from "../types";
import { api } from "../api/client";

interface OrganizationContextType {
  organization: OrganizationProfile;
  updateOrganization: (updates: Partial<OrganizationProfile>) => Promise<void>;
  formatCurrency: (amount: number, showSymbol?: boolean) => string;
  currencySymbol: string;
  clearCatalog: () => Promise<{ success: boolean; message: string }>;
  reloadDemoData: () => Promise<any>;
  loading: boolean;
}

const DEFAULT_ORGANIZATION: OrganizationProfile = {
  name: "Bharat Retail Corp",
  currency: "INR",
  currency_symbol: "₹",
  industry: "Retail & Consumer Goods",
  gstin: "27AAACB2212R1Z0",
  address: "Mumbai / New Delhi, India",
  phone: "+91 98765 43210"
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization, setOrganization] = useState<OrganizationProfile>(() => {
    const saved = localStorage.getItem("stockmind_org");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_ORGANIZATION;
  });
  const [loading, setLoading] = useState(true);

  // Sync from backend on mount
  useEffect(() => {
    api.getOrganization()
      .then((data) => {
        if (data && data.name) {
          setOrganization((prev) => {
            const merged = { ...prev, ...data };
            localStorage.setItem("stockmind_org", JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn("Could not sync organization from server, using local state:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateOrganization = async (updates: Partial<OrganizationProfile>) => {
    const updated = { ...organization, ...updates };
    setOrganization(updated);
    localStorage.setItem("stockmind_org", JSON.stringify(updated));

    try {
      await api.updateOrganization(updated);
      window.dispatchEvent(new CustomEvent("stockmind:org_updated", { detail: updated }));
    } catch (err) {
      console.error("Failed to persist organization to server:", err);
    }
  };

  const clearCatalog = async () => {
    const res = await api.clearCatalog();
    window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    return res;
  };

  const reloadDemoData = async () => {
    const res = await api.seedDemoData();
    window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    return res;
  };

  const formatCurrency = (amount: number, showSymbol = true): string => {
    const num = isNaN(amount) ? 0 : amount;
    const isINR = organization.currency === "INR";
    const locale = isINR ? "en-IN" : "en-US";
    const formatted = num.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const symbol = organization.currency_symbol || "₹";
    return showSymbol ? `${symbol}${formatted}` : formatted;
  };

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        updateOrganization,
        formatCurrency,
        currencySymbol: organization.currency_symbol || "₹",
        clearCatalog,
        reloadDemoData,
        loading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
};
