import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";
import { AuthResponse, OrganizationProfile, User } from "../types";

interface AuthContextType {
  user: User | null;
  organization: OrganizationProfile | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: {
    full_name: string;
    business_name: string;
    email: string;
    password: string;
    currency?: string;
    currency_symbol?: string;
    industry?: string;
  }) => Promise<AuthResponse>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("stockmind_token"));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("stockmind_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [organization, setOrganization] = useState<OrganizationProfile | null>(() => {
    const saved = localStorage.getItem("stockmind_org");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync / validate user profile on startup if token exists
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("stockmind_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        setUser(res.user);
        setOrganization(res.organization);
        setToken(res.access_token);
        localStorage.setItem("stockmind_user", JSON.stringify(res.user));
        localStorage.setItem("stockmind_org", JSON.stringify(res.organization));
        localStorage.setItem("stockmind_token", res.access_token);
      } catch (err) {
        console.warn("Stored auth token was invalid or expired, resetting session:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for unauthorized events from API client
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("stockmind:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("stockmind:unauthorized", handleUnauthorized);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.login({ email, password });
    setToken(res.access_token);
    setUser(res.user);
    setOrganization(res.organization);
    localStorage.setItem("stockmind_token", res.access_token);
    localStorage.setItem("stockmind_user", JSON.stringify(res.user));
    localStorage.setItem("stockmind_org", JSON.stringify(res.organization));
    window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    return res;
  };

  const register = async (data: {
    full_name: string;
    business_name: string;
    email: string;
    password: string;
    currency?: string;
    currency_symbol?: string;
    industry?: string;
  }): Promise<AuthResponse> => {
    const res = await api.register(data);
    setToken(res.access_token);
    setUser(res.user);
    setOrganization(res.organization);
    localStorage.setItem("stockmind_token", res.access_token);
    localStorage.setItem("stockmind_user", JSON.stringify(res.user));
    localStorage.setItem("stockmind_org", JSON.stringify(res.organization));
    window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setOrganization(null);
    localStorage.removeItem("stockmind_token");
    localStorage.removeItem("stockmind_user");
    localStorage.removeItem("stockmind_org");
    window.dispatchEvent(new CustomEvent("stockmind:logout"));
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await api.getMe();
      setUser(res.user);
      setOrganization(res.organization);
      localStorage.setItem("stockmind_user", JSON.stringify(res.user));
      localStorage.setItem("stockmind_org", JSON.stringify(res.organization));
    } catch (e) {
      console.error("Failed to refresh user profile:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
