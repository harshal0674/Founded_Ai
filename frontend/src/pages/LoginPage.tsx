import React, { useEffect, useState } from "react";
import {
  Building2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Store,
  Layers,
  ChevronRight,
  Globe
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

interface LoginPageProps {
  navigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, register, isAuthenticated, user, organization } = useAuth();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign In Form State (unfilled by default for clean customer login)
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Register Form State
  const [regFullName, setRegFullName] = useState("");
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regCurrency, setRegCurrency] = useState("INR");
  const [regIndustry, setRegIndustry] = useState("Electronics & Gadgets");

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await login(signInEmail, signInPassword);
      setSuccessMsg(`Authenticated as ${res.organization.name}. Loading ledger...`);
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (regPassword.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    const currencySymbol = regCurrency === "INR" ? "₹" : regCurrency === "USD" ? "$" : regCurrency === "EUR" ? "€" : "£";

    try {
      const res = await register({
        full_name: regFullName,
        business_name: regBusinessName,
        email: regEmail,
        password: regPassword,
        currency: regCurrency,
        currency_symbol: currencySymbol,
        industry: regIndustry,
      });

      setSuccessMsg(`Account created for ${res.organization.name}! Redirecting...`);
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (err: any) {
      setError(err.message || "Registration failed. This email may already be in use.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between text-apple-text antialiased selection:bg-[#B76E79]/20 selection:text-apple-text">
      {/* Background Rose Gold Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#B76E79]/10 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-[#B76E79]/8 blur-3xl" />
      </div>

      {/* Top Brand Bar */}
      <header className="relative z-10 w-full px-6 md:px-12 py-5 flex items-center justify-between border-b border-[#EFE7E4] bg-white/70 backdrop-blur-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#B76E79] to-[#C5808B] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            SM
          </div>
          <div className="text-left">
            <span className="font-semibold text-sm tracking-tight text-apple-text block leading-none">
              StockMind AI
            </span>
            <span className="text-[10px] font-mono text-[#B76E79] font-medium block mt-0.5">
              Multi-Tenant Customer Portal
            </span>
          </div>
        </button>

        <button
          onClick={() => navigate("/")}
          className="text-xs text-apple-text-secondary hover:text-[#B76E79] transition-colors font-medium flex items-center space-x-1"
        >
          <span>Back to Landing Page</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Centered Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10 md:py-14 max-w-xl mx-auto w-full">
        {/* Already Logged In Notice */}
        {isAuthenticated && user && organization && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-white border border-[#EFE7E4] shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#FDF5F6] border border-[#F6D9DE] text-[#B76E79] flex items-center justify-center font-bold text-xs">
                {organization.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-semibold text-apple-text block">
                  Logged in as {organization.name}
                </span>
                <span className="text-[11px] text-apple-text-secondary font-mono block">
                  {user.email} ({user.full_name})
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="apple-btn-primary text-xs py-1.5 px-3 flex items-center space-x-1"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        )}

        {/* Auth Card */}
        <div className="w-full apple-card bg-white border border-[#EFE7E4] p-6 sm:p-8 rounded-3xl shadow-sm">
          {/* Header Title */}
          <div className="text-center space-y-1.5 pb-6 border-b border-[#EFE7E4]">
            <h1 className="text-2xl font-bold text-apple-text tracking-tight">
              Customer Workspace Login
            </h1>
            <p className="text-xs text-apple-text-secondary max-w-sm mx-auto">
              Sign in to your company's isolated stock ledger, demand forecaster, and replenishment portal.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#FAF8F5] border border-[#EFE7E4] rounded-2xl mt-5 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === "signin"
                  ? "bg-white text-apple-text font-semibold shadow-sm border border-[#EFE7E4]"
                  : "text-apple-text-secondary hover:text-apple-text"
              }`}
            >
              Sign In Existing Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === "register"
                  ? "bg-white text-apple-text font-semibold shadow-sm border border-[#EFE7E4]"
                  : "text-apple-text-secondary hover:text-apple-text"
              }`}
            >
              Register New Customer
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mt-4 p-3.5 bg-apple-red/10 border border-apple-red/30 rounded-xl text-xs text-apple-red flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3.5 bg-apple-green/10 border border-apple-green/30 rounded-xl text-xs text-apple-green flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Sign In Form */}
          {mode === "signin" ? (
            <form onSubmit={handleSignInSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-apple-text-secondary font-medium mb-1.5">
                  Customer Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-apple-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. owner@yourcompany.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-apple-text-secondary font-medium mb-1.5">
                  Account Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-apple-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-text-tertiary hover:text-apple-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-full text-xs font-semibold apple-btn-primary flex items-center justify-center space-x-2 shadow-sm transition-all"
              >
                <span>{loading ? "Authenticating & Loading Store..." : "Sign In to Workspace"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            /* 2. Register Form */
            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-apple-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Ananya Roy"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1.5">
                    Company / Store Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-apple-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regBusinessName}
                      onChange={(e) => setRegBusinessName(e.target.value)}
                      placeholder="e.g. Roy Furnishings"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-apple-text-secondary font-medium mb-1.5">
                  Business Work Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-apple-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. ananya@royfurnishings.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-apple-text-secondary font-medium mb-1.5">
                  Create Password (min 4 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-apple-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={4}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-text-tertiary hover:text-apple-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1.5">Currency</label>
                  <select
                    value={regCurrency}
                    onChange={(e) => setRegCurrency(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79]"
                  >
                    <option value="INR">₹ INR — Indian Rupee (Lakhs/Crores)</option>
                    <option value="USD">$ USD — US Dollar</option>
                    <option value="EUR">€ EUR — Euro</option>
                    <option value="GBP">£ GBP — British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1.5">Industry</label>
                  <select
                    value={regIndustry}
                    onChange={(e) => setRegIndustry(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text text-xs focus:outline-none focus:border-[#B76E79]"
                  >
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Retail & FMCG">Retail & FMCG</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Pharmacy & Health">Pharmacy & Health</option>
                    <option value="Hardware & Industrial">Hardware & Industrial</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-full text-xs font-semibold apple-btn-primary flex items-center justify-center space-x-2 shadow-sm transition-all"
              >
                <span>{loading ? "Creating Isolated Tenant Workspace..." : "Create Customer Account & Launch"}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 text-center text-[11px] text-apple-text-tertiary font-mono border-t border-[#EFE7E4]/60">
        StockMind AI Multi-Tenant Architecture · AES-256 JWT Tenant Isolation · Powered by MongoDB
      </footer>
    </div>
  );
};
