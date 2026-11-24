import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  Compass,
  Activity,
  Layers,
  Sparkles,
  BarChart2,
  SlidersHorizontal,
  Package
} from "lucide-react";
import { CinematicMotionBackground } from "../components/ui/CinematicMotionBackground";

interface LandingPageProps {
  navigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  // Hero interactive channel filter
  const [activeChannel, setActiveChannel] = useState<"all" | "online" | "wholesale" | "retail">("all");

  // Section 1 interactive model comparison toggle
  const [comparisonMode, setComparisonMode] = useState<"ml" | "legacy">("ml");

  // Section 2 interactive replenishment sliders
  const [leadTime, setLeadTime] = useState<number>(7);
  const [dailyVelocity, setDailyVelocity] = useState<number>(14);

  const zScore = 1.65;
  const demandStd = 3.2;
  const safetyStock = Math.ceil(zScore * demandStd * Math.sqrt(leadTime));
  const reorderPoint = Math.ceil(dailyVelocity * leadTime + safetyStock);

  // Live order ticker stream simulation
  const [tickerIndex, setTickerIndex] = useState(0);
  const liveEvents = [
    { time: "Just now", sku: "SEN-HAL-010", text: "Online sale: 12 units deducted · Remaining: 14", status: "low" },
    { time: "1m ago", sku: "SW-TAC-110", text: "B2B order: 25 units fulfilled · Safety buffer secure", status: "ok" },
    { time: "2m ago", sku: "CAB-USBC-240", text: "Daily ML model retrained: MAE 1.02 · Horizon: 30d", status: "ai" },
    { time: "4m ago", sku: "MAT-ESD-6090", text: "Replenishment trigger: 102 units inbound dispatch", status: "reorder" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveEvents.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [liveEvents.length]);

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-apple-text font-sans antialiased selection:bg-[#B76E79]/20 selection:text-apple-text overflow-hidden">
      {/* Dynamic Animated Motion Canvas & Delicate Rose Gold Aura */}
      <CinematicMotionBackground />

      {/* 1. Global Translucent Glass Navigation */}
      <nav className="sticky top-0 z-50 h-14 bg-white/85 backdrop-blur-xl border-b border-[#EFE7E4] px-6 md:px-12 flex items-center justify-between transition-all shadow-sm">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2.5 text-left focus:outline-none group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#EFE7E4] overflow-hidden flex items-center justify-center shrink-0 shadow-sm group-hover:border-[#B76E79]/50 transition-colors">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-apple-text group-hover:text-[#B76E79] transition-colors">
              StockMind AI
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-7 text-xs text-apple-text-secondary font-medium">
            <a href="#forecasting" className="hover:text-[#B76E79] transition-colors">Intelligence</a>
            <a href="#replenishment" className="hover:text-[#B76E79] transition-colors">Replenishment</a>
            <a href="#inventory" className="hover:text-[#B76E79] transition-colors">Platform</a>
            <a href="#analytics" className="hover:text-[#B76E79] transition-colors">Analytics</a>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden sm:inline-flex text-xs text-apple-text-secondary hover:text-[#B76E79] px-3 py-1.5 transition-colors font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="apple-btn-primary text-xs px-4 py-1.5 shadow-glow-blue-subtle"
          >
            <span>Launch Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </nav>

      {/* 2. Hero Viewport */}
      <section className="relative min-h-[95vh] flex flex-col justify-between pt-16 pb-20 px-6 md:px-12 z-10">
        {/* Hero Headings */}
        <div className="max-w-4xl mx-auto text-center space-y-5 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#EFE7E4] text-xs text-apple-text-secondary backdrop-blur-md shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79] animate-pulse"></span>
            <span>Next-Generation Autonomous Replenishment Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-apple-text leading-[1.05]"
          >
            Inventory.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C191A] via-[#4A4447] to-[#B76E79]">
              Under Control.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-apple-text-secondary font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Predict demand. Prevent stockouts. Replenish intelligently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-2 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="apple-btn-primary text-sm px-7 py-3 flex items-center space-x-2 shadow-glow-blue"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#forecasting"
              className="apple-btn-secondary text-sm px-6 py-3"
            >
              Explore Platform
            </a>
          </motion.div>
        </div>

        {/* Hero Centerpiece: Minimalist Rose Gold & Off-White Telemetry Console */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto w-full mt-12"
        >
          {/* Subtle Rose Gold Gradient Border */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-[#B76E79]/35 via-[#EFE7E4] to-[#EFE7E4]/40 shadow-apple-elevated">
            <div className="bg-white/95 rounded-2xl p-6 md:p-8 overflow-hidden backdrop-blur-3xl border border-[#EFE7E4]">
              {/* Window Header with Channel Filter Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-[#EFE7E4] text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#E5B4B9]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#E8D4B8]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#B8D8C4]"></div>
                  <span className="ml-3 font-mono text-[11px] text-apple-text-secondary">
                    stockmind.engine // live-stream.active
                  </span>
                </div>

                {/* Channel Selector Pills */}
                <div className="flex items-center space-x-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#EFE7E4] self-start sm:self-auto font-mono text-[10px]">
                  {(["all", "online", "wholesale", "retail"] as const).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setActiveChannel(ch)}
                      className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                        activeChannel === ch
                          ? "bg-gradient-to-r from-[#C5808B] to-[#B76E79] text-white font-medium shadow-sm"
                          : "text-apple-text-secondary hover:text-apple-text"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Centerpiece Grid: Interactive Motion Graph & Live Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
                {/* Left: Dynamic Velocity & Health Meters */}
                <div className="md:col-span-4 space-y-4 bg-[#FAF8F5] rounded-xl p-4 border border-[#EFE7E4] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-apple-text-secondary">
                    <span className="uppercase tracking-wider font-mono text-[10px]">Demand Vector</span>
                    <span className="text-apple-green font-mono flex items-center space-x-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-apple-green animate-pulse"></span>
                      <span>Real-Time Sync</span>
                    </span>
                  </div>

                  <div>
                    <div className="text-3xl font-bold tracking-tight text-apple-text font-mono">
                      {activeChannel === "online" ? "18.4" : activeChannel === "wholesale" ? "24.0" : activeChannel === "retail" ? "9.8" : "42.2"}
                      <span className="text-xs text-apple-text-secondary font-normal ml-1.5">units/day</span>
                    </div>
                    <div className="text-xs text-apple-text-secondary mt-0.5">Aggregate consumption velocity</div>
                  </div>

                  {/* Animated Bars */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-[10px] font-mono text-apple-text-secondary">
                      <span>Working Buffer</span>
                      <span className="text-[#B76E79] font-semibold">84% Optimal</span>
                    </div>
                    <div className="w-full bg-[#EFE7E4] h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-[#C5808B] to-[#B76E79] h-full rounded-full"
                        animate={{ width: activeChannel === "online" ? "76%" : activeChannel === "wholesale" ? "88%" : "84%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-apple-text-secondary font-mono flex justify-between border-t border-[#EFE7E4]">
                    <span>Stockout Risk: None</span>
                    <span className="text-apple-green font-semibold">100% In Stock</span>
                  </div>
                </div>

                {/* Center: Live Multi-Wave Demand Trajectory Chart */}
                <div className="md:col-span-5 space-y-3 bg-[#FAF8F5] rounded-xl p-4 border border-[#EFE7E4] shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-apple-text font-semibold flex items-center space-x-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#B76E79]" />
                      <span>30-Day Predictive Trajectory</span>
                    </span>
                    <span className="text-xs text-[#B76E79] font-mono bg-[#FDF5F6] px-2 py-0.5 rounded-full border border-[#F6D9DE] font-semibold">
                      MAE: 1.02
                    </span>
                  </div>
                  
                  {/* Dynamic Animated Motion Wave SVG */}
                  <div className="h-32 w-full relative flex items-center justify-center overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 340 110" fill="none">
                      <defs>
                        <linearGradient id="heroConfidenceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#B76E79" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#B76E79" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="actualLineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8E8588" />
                          <stop offset="100%" stopColor="#4A4447" />
                        </linearGradient>
                      </defs>

                      {/* Subtle Grid horizontal guide lines */}
                      <line x1="0" y1="25" x2="340" y2="25" stroke="rgba(183,110,121,0.12)" strokeDasharray="2 3" />
                      <line x1="0" y1="55" x2="340" y2="55" stroke="rgba(183,110,121,0.12)" strokeDasharray="2 3" />
                      <line x1="0" y1="85" x2="340" y2="85" stroke="rgba(183,110,121,0.12)" strokeDasharray="2 3" />

                      {/* Shaded Confidence Region (Rose Gold) */}
                      <path
                        d={
                          activeChannel === "online"
                            ? "M 10 75 Q 80 30 160 55 T 270 25 L 330 15 L 330 85 L 270 80 Q 200 85 160 75 Z"
                            : "M 10 70 Q 70 30 150 50 T 260 30 L 330 18 L 330 82 L 260 75 Q 180 80 150 70 Z"
                        }
                        fill="url(#heroConfidenceGrad)"
                      />

                      {/* Historical Sales Trajectory (Solid) */}
                      <path
                        d="M 10 70 Q 70 35 150 52 T 200 45"
                        stroke="url(#actualLineGrad)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      {/* ML Forward Prediction Wave (Rose Gold Dashed) */}
                      <path
                        d="M 200 45 Q 240 35 270 24 T 330 18"
                        stroke="#B76E79"
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                        strokeLinecap="round"
                      />

                      {/* Animated Origin Pivot Node */}
                      <circle cx="200" cy="45" r="4.5" fill="#B76E79" />
                      <circle cx="200" cy="45" r="9" fill="rgba(183, 110, 121, 0.25)" className="animate-ping" />

                      {/* Upper & Lower Bound Guide Lines */}
                      <path
                        d="M 200 35 Q 240 25 270 15 T 330 10"
                        stroke="rgba(183, 110, 121, 0.35)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      <path
                        d="M 200 55 Q 240 48 270 40 T 330 35"
                        stroke="rgba(183, 110, 121, 0.35)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[11px] font-mono text-apple-text-secondary pt-1 border-t border-[#EFE7E4]">
                    <span>T - 30d</span>
                    <span className="text-[#B76E79] font-semibold">T0 (Today)</span>
                    <span>T + 30d (Prediction)</span>
                  </div>
                </div>

                {/* Right: Live Ticker & Order Stream */}
                <div className="md:col-span-3 space-y-3 bg-[#FAF8F5] rounded-xl p-4 border border-[#EFE7E4] shadow-sm">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-apple-text-secondary flex items-center justify-between">
                    <span>Movement Stream</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
                  </div>

                  <div>
                    <div className="text-3xl font-bold tracking-tight text-apple-text font-mono">₹36,45,000</div>
                    <div className="text-xs text-apple-text-secondary mt-0.5">30-day gross throughput</div>
                  </div>

                  {/* Animated Ticker Card */}
                  <div className="min-h-[68px] p-2.5 rounded-lg bg-white border border-[#EFE7E4] text-[11px] font-mono space-y-1 relative overflow-hidden shadow-sm">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tickerIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between text-[10px] text-apple-text-secondary">
                          <span className="text-[#B76E79] font-semibold">{liveEvents[tickerIndex].sku}</span>
                          <span>{liveEvents[tickerIndex].time}</span>
                        </div>
                        <div className="text-apple-text text-[11px] line-clamp-2 mt-0.5 font-sans font-medium">
                          {liveEvents[tickerIndex].text}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Section 1: Demand Forecasting ("See what's coming.") with Interactive Model Comparison */}
      <section id="forecasting" className="relative py-28 md:py-36 px-6 md:px-12 z-10 border-t border-[#EFE7E4]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-[#B76E79] font-semibold">
              Demand Forecasting
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-apple-text">
              See what's coming.
            </h2>
            <p className="text-lg md:text-xl text-apple-text-secondary font-normal leading-relaxed">
              Autoregressive machine learning models project daily demand across every sales channel. Know what customers will buy before they order.
            </p>
          </div>

          {/* Model Comparison Demo Graph Box */}
          <div className="apple-card p-6 md:p-10 bg-white space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EFE7E4]">
              <div>
                <h3 className="text-xl font-semibold text-apple-text tracking-tight">
                  Predictive Precision vs. Guesswork
                </h3>
                <p className="text-xs text-apple-text-secondary mt-0.5">
                  Toggle between legacy static reordering and StockMind's autoregressive Ridge model
                </p>
              </div>

              {/* Toggle Buttons */}
              <div className="flex items-center space-x-2 p-1 bg-[#FAF8F5] rounded-xl border border-[#EFE7E4] self-start sm:self-auto font-mono text-xs">
                <button
                  onClick={() => setComparisonMode("ml")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    comparisonMode === "ml"
                      ? "bg-gradient-to-r from-[#C5808B] to-[#B76E79] text-white font-medium shadow-sm"
                      : "text-apple-text-secondary hover:text-apple-text"
                  }`}
                >
                  StockMind ML (Ridge + Lags)
                </button>
                <button
                  onClick={() => setComparisonMode("legacy")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    comparisonMode === "legacy"
                      ? "bg-white text-apple-orange border border-apple-orange/40 font-semibold shadow-sm"
                      : "text-apple-text-secondary hover:text-apple-text"
                  }`}
                >
                  Static Guesswork
                </button>
              </div>
            </div>

            {/* Interactive Graph Canvas */}
            <div className="h-64 w-full bg-[#FAF8F5] rounded-xl p-4 border border-[#EFE7E4] relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-apple-text-secondary">Simulated 60-Day Trajectory</span>
                <span className={comparisonMode === "ml" ? "text-apple-green font-semibold" : "text-apple-orange font-semibold"}>
                  {comparisonMode === "ml" ? "Stockout Probability: 0.2%" : "Stockout Probability: 28.4%"}
                </span>
              </div>

              {/* Dynamic SVG Comparison Splines */}
              <svg className="w-full h-40" viewBox="0 0 500 130" fill="none">
                <line x1="0" y1="35" x2="500" y2="35" stroke="rgba(183,110,121,0.12)" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(183,110,121,0.12)" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(183,110,121,0.12)" strokeDasharray="3 3" />

                {comparisonMode === "ml" ? (
                  <>
                    {/* Shaded Confidence Zone */}
                    <path
                      d="M 20 85 Q 120 45 220 65 T 380 40 L 480 30 L 480 90 L 380 95 Q 260 100 220 85 Z"
                      fill="rgba(183, 110, 121, 0.12)"
                    />
                    {/* Smooth Predictive Curve */}
                    <path
                      d="M 20 85 Q 120 45 220 65 T 380 40 L 480 30"
                      stroke="#B76E79"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Actual points tracked close to curve */}
                    <circle cx="120" cy="52" r="3" fill="#248A54" />
                    <circle cx="220" cy="67" r="3" fill="#248A54" />
                    <circle cx="340" cy="48" r="3" fill="#248A54" />
                    <circle cx="440" cy="36" r="3" fill="#248A54" />
                  </>
                ) : (
                  <>
                    {/* Chaotic Unmanaged Guesswork Curve */}
                    <path
                      d="M 20 115 L 80 30 L 140 120 L 220 20 L 310 110 L 410 25 L 480 125"
                      stroke="#C26700"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                      strokeLinecap="round"
                    />
                    {/* Danger markers */}
                    <circle cx="140" cy="120" r="4" fill="#C73646" />
                    <circle cx="310" cy="110" r="4" fill="#C73646" />
                    <circle cx="480" cy="125" r="4" fill="#C73646" />
                  </>
                )}
              </svg>

              <div className="flex justify-between text-[11px] font-mono text-apple-text-secondary border-t border-[#EFE7E4] pt-2">
                <span>Week 1</span>
                <span>Week 4</span>
                <span>Week 8</span>
              </div>
            </div>

            {/* Performance Metric Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE7E4] space-y-1">
                <span className="text-[10px] font-mono text-apple-text-secondary uppercase">Mean Absolute Error</span>
                <div className="text-2xl font-bold text-apple-text font-mono">1.02 units</div>
                <p className="text-[11px] text-apple-green font-medium">Minimal variance across holdout test set</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE7E4] space-y-1">
                <span className="text-[10px] font-mono text-apple-text-secondary uppercase">Root Mean Squared (RMSE)</span>
                <div className="text-2xl font-bold text-apple-text font-mono">1.25 units</div>
                <p className="text-[11px] text-apple-text-secondary">Strictly penalizes large forecast misses</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE7E4] space-y-1">
                <span className="text-[10px] font-mono text-apple-text-secondary uppercase">Accuracy (MAPE)</span>
                <div className="text-2xl font-bold text-[#B76E79] font-mono">8.5%</div>
                <p className="text-[11px] text-[#B76E79] font-medium">Industry top-tier predictive reliability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 2: Intelligent Replenishment ("Stock smarter. Not more.") */}
      <section id="replenishment" className="relative py-28 md:py-36 px-6 md:px-12 z-10 border-t border-[#EFE7E4]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-[#B76E79] font-semibold">
              Replenishment Optimization
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-apple-text">
              Stock smarter. Not more.
            </h2>
            <p className="text-lg md:text-xl text-apple-text-secondary font-normal leading-relaxed">
              Eliminate tied-up working capital. Dynamic safety stock calculations trigger automated replenishment exactly when required.
            </p>
          </div>

          {/* Interactive Reorder Point Workbench */}
          <div className="apple-card p-8 md:p-10 bg-white space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EFE7E4]">
              <div>
                <h3 className="text-2xl font-semibold text-apple-text tracking-tight flex items-center space-x-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#B76E79]" />
                  <span>Dynamic Reorder Point Engine</span>
                </h3>
                <p className="text-sm text-apple-text-secondary mt-1">
                  Formula: Reorder Point (ROP) = (Daily Velocity × Lead Time) + Safety Stock (SS)
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FDF5F6] text-[#B76E79] border border-[#F6D9DE] font-semibold self-start md:self-auto">
                95% Service Level (Z = 1.65)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-apple-text">Supplier Transit Lead Time</span>
                    <span className="font-mono text-[#B76E79] font-bold">{leadTime} Days</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={leadTime}
                    onChange={(e) => setLeadTime(Number(e.target.value))}
                    className="w-full h-2 bg-[#EFE7E4] rounded-lg appearance-none cursor-pointer accent-[#B76E79]"
                  />
                  <div className="flex justify-between text-[10px] text-apple-text-secondary font-mono mt-1">
                    <span>2 days (Express Domestic)</span>
                    <span>30 days (Ocean Freight)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-apple-text">Daily Demand Velocity</span>
                    <span className="font-mono text-[#B76E79] font-bold">{dailyVelocity} Units/day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={dailyVelocity}
                    onChange={(e) => setDailyVelocity(Number(e.target.value))}
                    className="w-full h-2 bg-[#EFE7E4] rounded-lg appearance-none cursor-pointer accent-[#B76E79]"
                  />
                  <div className="flex justify-between text-[10px] text-apple-text-secondary font-mono mt-1">
                    <span>1 unit/day</span>
                    <span>50 units/day</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Readout */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#EFE7E4] text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase text-apple-text-secondary">Safety Buffer</span>
                  <div className="text-3xl font-bold tracking-tight text-apple-text font-mono">{safetyStock}</div>
                  <span className="text-[10px] text-apple-text-secondary font-mono">Z × σ × √L</span>
                </div>

                <div className="p-5 rounded-xl bg-[#FDF5F6] border border-[#F6D9DE] text-center space-y-1 shadow-glow-blue-subtle">
                  <span className="text-[10px] font-mono uppercase text-[#B76E79] font-semibold">Reorder Point</span>
                  <div className="text-3xl font-bold tracking-tight text-[#B76E79] font-mono">{reorderPoint}</div>
                  <span className="text-[10px] text-[#B76E79] font-mono">Units Trigger</span>
                </div>

                <div className="col-span-2 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFE7E4] text-xs text-apple-text-secondary leading-relaxed font-mono">
                  Autonomous trigger: When stock reaches <span className="text-apple-text font-bold">{reorderPoint} units</span>, StockMind initiates replenishment to cover the {leadTime}-day delivery window without touching safety buffer.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 3: Inventory Intelligence ("Every product. Every movement. In control.") */}
      <section id="inventory" className="relative py-28 md:py-36 px-6 md:px-12 z-10 border-t border-[#EFE7E4]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-[#B76E79] font-semibold">
              Inventory Integrity
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-apple-text">
              Every product.<br />Every movement.<br />In control.
            </h2>
            <p className="text-lg md:text-xl text-apple-text-secondary font-normal leading-relaxed">
              Atomic ledger transactions protect physical on-hand stock. Concurrency locking guarantees zero negative inventory and instant audit visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="apple-card p-7 space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#FDF5F6] border border-[#F6D9DE] flex items-center justify-center text-[#B76E79] shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-apple-text tracking-tight">
                Atomic Stock Decrement
              </h3>
              <p className="text-sm text-apple-text-secondary leading-relaxed">
                Sales transactions lock and decrement current stock atomically. If an order exceeds on-hand quantity, it fails cleanly with validation.
              </p>
            </div>

            <div className="apple-card p-7 space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#FDF5F6] border border-[#F6D9DE] flex items-center justify-center text-[#B76E79] shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-apple-text tracking-tight">
                Low-Stock Triage
              </h3>
              <p className="text-sm text-apple-text-secondary leading-relaxed">
                Automated classification tags items as Healthy, Approaching Threshold, Reorder Triggered, or Critical Stockout in real time.
              </p>
            </div>

            <div className="apple-card p-7 space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#FDF5F6] border border-[#F6D9DE] flex items-center justify-center text-[#B76E79] shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-apple-text tracking-tight">
                Instant Reordering
              </h3>
              <p className="text-sm text-apple-text-secondary leading-relaxed">
                One-click purchase order execution adds restocked inventory directly back into active stock with full movement logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 4: Analytics ("Decisions backed by data.") */}
      <section id="analytics" className="relative py-28 md:py-36 px-6 md:px-12 z-10 border-t border-[#EFE7E4]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-[#B76E79] font-semibold">
              Executive Analytics
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-apple-text">
              Decisions backed by data.
            </h2>
            <p className="text-lg md:text-xl text-apple-text-secondary font-normal leading-relaxed">
              Real-time margins, channel contributions, and annualized turnover velocity. Clear business insights designed for immediate action.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="apple-card p-6 space-y-2">
              <span className="text-xs text-apple-text-secondary font-mono">Turnover Velocity</span>
              <div className="text-3xl sm:text-4xl font-bold text-apple-text tracking-tight font-mono">9.4x</div>
              <span className="text-xs text-apple-green font-medium">Top 10% benchmark</span>
            </div>

            <div className="apple-card p-6 space-y-2">
              <span className="text-xs text-apple-text-secondary font-mono">Gross Throughput</span>
              <div className="text-3xl sm:text-4xl font-bold text-apple-text tracking-tight font-mono">₹36.5L</div>
              <span className="text-xs text-apple-text-secondary">Past 30 days</span>
            </div>

            <div className="apple-card p-6 space-y-2">
              <span className="text-xs text-apple-text-secondary font-mono">Fulfillment Rate</span>
              <div className="text-3xl sm:text-4xl font-bold text-apple-text tracking-tight font-mono">99.8%</div>
              <span className="text-xs text-apple-green font-medium">Zero active backorders</span>
            </div>

            <div className="apple-card p-6 space-y-2">
              <span className="text-xs text-apple-text-secondary font-mono">Working Capital Saved</span>
              <div className="text-3xl sm:text-4xl font-bold text-[#B76E79] tracking-tight font-mono">34%</div>
              <span className="text-xs text-apple-text-secondary">Reduced holding cost</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section 5: Final CTA */}
      <section className="relative py-32 md:py-44 px-6 md:px-12 z-10 border-t border-[#EFE7E4] overflow-hidden text-center">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-apple-text leading-tight">
            Your inventory deserves intelligence.
          </h2>
          <p className="text-lg md:text-xl text-apple-text-secondary font-normal max-w-xl mx-auto leading-relaxed">
            Experience real-time demand forecasting and autonomous replenishment designed with extreme precision.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="apple-btn-primary text-base px-8 py-3.5 flex items-center space-x-2 shadow-glow-blue"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-12 px-6 md:px-12 bg-white text-xs text-apple-text-secondary border-t border-[#EFE7E4] relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-apple-text">
            <div className="w-5 h-5 rounded-lg bg-[#FAF8F5] border border-[#EFE7E4] overflow-hidden flex items-center justify-center shrink-0">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-apple-text">StockMind AI</span>
            <span className="text-[#E5DDD9]">|</span>
            <span className="text-apple-text-secondary">Engineered for precision replenishment</span>
          </div>

          <div className="flex items-center space-x-6 text-apple-text-secondary font-medium">
            <button onClick={() => navigate("/dashboard")} className="hover:text-[#B76E79] transition-colors">Console</button>
            <button onClick={() => navigate("/inventory")} className="hover:text-[#B76E79] transition-colors">Inventory</button>
            <button onClick={() => navigate("/forecasting")} className="hover:text-[#B76E79] transition-colors">Forecasting</button>
            <button onClick={() => navigate("/recommendations")} className="hover:text-[#B76E79] transition-colors">Replenishment</button>
          </div>

          <div className="font-mono text-[11px] text-apple-text-tertiary">
            FastAPI · MongoDB Atlas · Scikit-Learn
          </div>
        </div>
      </footer>
    </div>
  );
};
