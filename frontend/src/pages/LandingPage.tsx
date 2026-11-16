import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  BarChart3,
  Boxes,
  Zap,
  Lock,
  Compass
} from "lucide-react";

interface LandingPageProps {
  navigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  // Interactive simulator for replenishment section
  const [leadTime, setLeadTime] = useState<number>(7);
  const [dailyVelocity, setDailyVelocity] = useState<number>(14);

  const zScore = 1.65;
  const demandStd = 3.2;
  const safetyStock = Math.ceil(zScore * demandStd * Math.sqrt(leadTime));
  const reorderPoint = Math.ceil(dailyVelocity * leadTime + safetyStock);

  return (
    <div className="min-h-screen bg-apple-black text-apple-text font-sans antialiased selection:bg-apple-blue/30 selection:text-white">
      {/* 1. Global Apple Translucent Glass Navigation */}
      <nav className="sticky top-0 z-50 h-14 bg-apple-black/80 backdrop-blur-xl border-b border-apple-border/80 px-6 md:px-12 flex items-center justify-between transition-all">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2.5 text-left focus:outline-none group"
          >
            <div className="w-5 h-5 rounded-full bg-apple-blue flex items-center justify-center text-white text-[10px] font-semibold tracking-tighter">
              SM
            </div>
            <span className="font-semibold text-sm tracking-tight text-apple-text group-hover:text-white transition-colors">
              StockMind AI
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-7 text-xs text-apple-text-secondary font-normal">
            <a href="#forecasting" className="hover:text-apple-text transition-colors">Intelligence</a>
            <a href="#replenishment" className="hover:text-apple-text transition-colors">Replenishment</a>
            <a href="#inventory" className="hover:text-apple-text transition-colors">Platform</a>
            <a href="#analytics" className="hover:text-apple-text transition-colors">Analytics</a>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden sm:inline-flex text-xs text-apple-text-secondary hover:text-white px-3 py-1.5 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="apple-btn-primary text-xs px-4 py-1.5"
          >
            <span>Launch Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </nav>

      {/* 2. Cinematic Hero Viewport (Pure Black) */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-16 pb-20 px-6 md:px-12 overflow-hidden bg-apple-black">
        {/* Ambient Top Radial Blue Backlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-radial-glow pointer-events-none opacity-60"></div>

        {/* Hero Headings */}
        <div className="max-w-4xl mx-auto text-center space-y-5 z-10 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-apple-surface/90 border border-apple-border text-xs text-apple-text-secondary"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-apple-blue-bright animate-pulse"></span>
            <span>Next-Generation Inventory Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05]"
          >
            Inventory.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40">
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

        {/* Hero Centerpiece: 3D-Inspired Futuristic Inventory Intelligence Console */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto w-full mt-12 z-10"
        >
          {/* Outer glowing border container */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-apple-border-light via-apple-border to-transparent shadow-apple-elevated">
            <div className="bg-gradient-to-b from-apple-surface to-apple-charcoal rounded-2xl p-6 md:p-8 overflow-hidden backdrop-blur-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-6 border-b border-apple-border text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]/80"></div>
                  <span className="ml-3 font-mono text-[11px] text-apple-text-secondary">
                    stockmind.engine // autonomous-telemetry.active
                  </span>
                </div>
                <div className="flex items-center space-x-4 font-mono text-[11px] text-apple-text-secondary">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-apple-green"></span>
                    <span>MongoDB Atlas Connected</span>
                  </span>
                  <span className="hidden sm:inline text-apple-blue-bright">Ridge-ML v1.4</span>
                </div>
              </div>

              {/* Centerpiece Grid: 3 Interactive Glass Telemetry Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
                {/* Left: Active Replenishment Vector */}
                <div className="md:col-span-4 space-y-4 bg-apple-black/40 rounded-xl p-4 border border-apple-border/70">
                  <div className="flex items-center justify-between text-xs text-apple-text-secondary">
                    <span className="uppercase tracking-wider font-mono text-[10px]">Autoregulation</span>
                    <span className="text-apple-green font-mono">99.8% Fill Rate</span>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-white">4.2 Days</div>
                    <div className="text-xs text-apple-text-secondary mt-0.5">Average lead time buffer</div>
                  </div>
                  <div className="w-full bg-apple-surface h-1.5 rounded-full overflow-hidden">
                    <div className="bg-apple-blue-bright h-full w-[82%] rounded-full"></div>
                  </div>
                  <div className="pt-2 text-[11px] text-apple-text-secondary font-mono flex justify-between">
                    <span>Stockout Risk: Negligible</span>
                    <span className="text-apple-blue-bright">Zero Lost Sales</span>
                  </div>
                </div>

                {/* Center: Live Demand Trajectory Pulse */}
                <div className="md:col-span-5 space-y-3 bg-apple-black/60 rounded-xl p-4 border border-apple-border/70">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium">30-Day Demand Projection</span>
                    <span className="text-xs text-apple-blue-bright font-mono">MAE: 1.02</span>
                  </div>
                  
                  {/* Visual SVG Trajectory Wave */}
                  <div className="h-28 w-full relative flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 320 100" fill="none">
                      {/* Confidence bounds area */}
                      <path
                        d="M 10 70 Q 70 30 140 50 T 260 30 L 310 20 L 310 85 L 260 75 Q 180 80 140 70 Z"
                        fill="rgba(10, 132, 255, 0.08)"
                      />
                      {/* Historical Curve */}
                      <path
                        d="M 10 70 Q 70 35 140 55 T 190 45"
                        stroke="#86868B"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* ML Predicted Trajectory Line */}
                      <path
                        d="M 190 45 Q 230 35 260 25 T 310 18"
                        stroke="#0A84FF"
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                        strokeLinecap="round"
                      />
                      {/* Forecast origin pulse dot */}
                      <circle cx="190" cy="45" r="4" fill="#0A84FF" />
                      <circle cx="190" cy="45" r="8" fill="rgba(10, 132, 255, 0.25)" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[11px] font-mono text-apple-text-secondary pt-1 border-t border-apple-border/50">
                    <span>T - 30d</span>
                    <span className="text-apple-blue-bright">Today (Origin)</span>
                    <span>T + 30d (Forecast)</span>
                  </div>
                </div>

                {/* Right: Instant Trigger Metric */}
                <div className="md:col-span-3 space-y-4 bg-apple-black/40 rounded-xl p-4 border border-apple-border/70">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-apple-text-secondary">
                    Active Catalog
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-tight text-white">$43,770</div>
                    <div className="text-xs text-apple-text-secondary mt-0.5">30-day gross throughput</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-apple-surface border border-apple-border text-[11px] font-mono text-apple-text-secondary">
                    <span className="text-white font-medium">10 SKUs</span> tracked across Electronics, Hardware & Packaging.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Section 1: Demand Forecasting ("See what's coming.") */}
      <section id="forecasting" className="py-28 md:py-36 px-6 md:px-12 bg-apple-charcoal border-t border-apple-border">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-apple-blue-bright">
              Demand Forecasting
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              See what's coming.
            </h2>
            <p className="text-lg md:text-xl text-apple-text-secondary font-normal leading-relaxed">
              Autoregressive machine learning models project daily demand across every sales channel. Know what customers will buy before they order.
            </p>
          </div>

          {/* Forecasting Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Narrative Cards */}
            <div className="md:col-span-5 space-y-6">
              <div className="apple-card p-6 space-y-3">
                <div className="w-8 h-8 rounded-full bg-apple-blue/15 text-apple-blue-bright flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Cyclical Seasonality
                </h3>
                <p className="text-sm text-apple-text-secondary leading-relaxed">
                  Identifies weekday commercial spikes versus weekend consumer surges using harmonic sin/cos encoding.
                </p>
              </div>

              <div className="apple-card p-6 space-y-3">
                <div className="w-8 h-8 rounded-full bg-apple-blue/15 text-apple-blue-bright flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Evaluated Accuracy
                </h3>
                <p className="text-sm text-apple-text-secondary leading-relaxed">
                  Transparent MAE, RMSE, and MAPE scores computed across historical holdouts. No invented numbers.
                </p>
              </div>
            </div>

            {/* Right Large Preview Panel */}
            <div className="md:col-span-7 apple-card p-8 bg-apple-dark space-y-6 border border-apple-border-light">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-medium">Model Output // SEN-HAL-010</span>
                <span className="text-apple-blue-bright">Horizon: 30 Days</span>
              </div>

              <div className="p-5 rounded-xl bg-apple-black/80 border border-apple-border space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-apple-text-secondary block">MAE</span>
                    <span className="text-xl font-semibold text-white">1.02</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-apple-text-secondary block">RMSE</span>
                    <span className="text-xl font-semibold text-white">1.25</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-apple-text-secondary block">MAPE</span>
                    <span className="text-xl font-semibold text-apple-green">8.5%</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-apple-text-secondary leading-relaxed space-y-2">
                <div className="font-semibold text-white">Automatic Fallback Guarantee:</div>
                <p>
                  For young products with limited history, StockMind smoothly transitions to transparent moving average baselines, eliminating hallucinated forecast anomalies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 2: Intelligent Replenishment ("Stock smarter. Not more.") */}
      <section id="replenishment" className="py-28 md:py-36 px-6 md:px-12 bg-apple-black border-t border-apple-border">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-apple-blue-bright">
              Replenishment Optimization
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Stock smarter. Not more.
            </h2>
            <p className="text-lg md:text-xl text-apple-text-secondary font-normal leading-relaxed">
              Eliminate tied-up working capital. Dynamic safety stock calculations trigger automated replenishment exactly when required.
            </p>
          </div>

          {/* Interactive Apple-Style Math Sandbox */}
          <div className="apple-card p-8 md:p-10 bg-apple-dark border border-apple-border space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-apple-border">
              <div>
                <h3 className="text-2xl font-semibold text-white tracking-tight">
                  Dynamic Reorder Point Engine
                </h3>
                <p className="text-sm text-apple-text-secondary mt-1">
                  Formula: Reorder Point = (Daily Velocity × Lead Time) + Safety Stock
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-apple-blue/15 text-apple-blue-bright border border-apple-blue/30 self-start md:self-auto">
                95% Service Level (Z = 1.65)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-apple-text">Supplier Lead Time</span>
                    <span className="font-mono text-apple-blue-bright">{leadTime} Days</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={leadTime}
                    onChange={(e) => setLeadTime(Number(e.target.value))}
                    className="w-full h-1.5 bg-apple-surface rounded-lg appearance-none cursor-pointer accent-apple-blue"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-apple-text">Daily Demand Velocity</span>
                    <span className="font-mono text-apple-blue-bright">{dailyVelocity} Units/day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={dailyVelocity}
                    onChange={(e) => setDailyVelocity(Number(e.target.value))}
                    className="w-full h-1.5 bg-apple-surface rounded-lg appearance-none cursor-pointer accent-apple-blue"
                  />
                </div>
              </div>

              {/* Output Readout */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-apple-surface border border-apple-border text-center space-y-1">
                  <span className="text-[10px] font-mono uppercase text-apple-text-secondary">Safety Buffer</span>
                  <div className="text-3xl font-bold tracking-tight text-white">{safetyStock}</div>
                  <span className="text-[10px] text-apple-text-secondary font-mono">Units</span>
                </div>

                <div className="p-5 rounded-xl bg-apple-blue/10 border border-apple-blue/40 text-center space-y-1 shadow-glow-blue-subtle">
                  <span className="text-[10px] font-mono uppercase text-apple-blue-bright">Reorder Point</span>
                  <div className="text-3xl font-bold tracking-tight text-apple-blue-bright">{reorderPoint}</div>
                  <span className="text-[10px] text-apple-blue-bright font-mono">Trigger Threshold</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 3: Inventory Intelligence ("Every product. Every movement. In control.") */}
      <section id="inventory" className="py-28 md:py-36 px-6 md:px-12 bg-apple-charcoal border-t border-apple-border">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-apple-blue-bright">
              Inventory Integrity
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Every product.<br />Every movement.<br />In control.
            </h2>
            <p className="text-lg md:text-xl text-apple-text-secondary font-normal leading-relaxed">
              Atomic ledger transactions protect physical on-hand stock. Concurrency locking guarantees zero negative inventory and instant audit visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="apple-card p-7 space-y-4">
              <div className="w-10 h-10 rounded-full bg-apple-surface-elevated border border-apple-border flex items-center justify-center text-apple-blue-bright">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">
                Atomic Decrement
              </h3>
              <p className="text-sm text-apple-text-secondary leading-relaxed">
                Sales transactions lock and decrement current stock atomically. If an order exceeds on-hand quantity, it fails cleanly with HTTP 400 validation.
              </p>
            </div>

            <div className="apple-card p-7 space-y-4">
              <div className="w-10 h-10 rounded-full bg-apple-surface-elevated border border-apple-border flex items-center justify-center text-apple-blue-bright">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">
                Low-Stock Triage
              </h3>
              <p className="text-sm text-apple-text-secondary leading-relaxed">
                Automated classification tags items as Healthy, Approaching Threshold, Reorder Triggered, or Critical Stockout in real time.
              </p>
            </div>

            <div className="apple-card p-7 space-y-4">
              <div className="w-10 h-10 rounded-full bg-apple-surface-elevated border border-apple-border flex items-center justify-center text-apple-blue-bright">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white tracking-tight">
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
      <section id="analytics" className="py-28 md:py-36 px-6 md:px-12 bg-apple-black border-t border-apple-border">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono tracking-widest uppercase text-apple-blue-bright">
              Executive Analytics
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Decisions backed by data.
            </h2>
            <p className="text-lg md:text-xl text-apple-text-secondary font-normal leading-relaxed">
              Real-time margins, channel contributions, and annualized turnover velocity. Clear business insights designed for immediate action.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="apple-card p-6 space-y-2">
              <span className="text-xs text-apple-text-secondary font-mono">Turnover Velocity</span>
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">9.4x</div>
              <span className="text-xs text-apple-green">Top 10% benchmark</span>
            </div>

            <div className="apple-card p-6 space-y-2">
              <span className="text-xs text-apple-text-secondary font-mono">Gross Throughput</span>
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">$43.7K</div>
              <span className="text-xs text-apple-text-secondary">Past 30 days</span>
            </div>

            <div className="apple-card p-6 space-y-2">
              <span className="text-xs text-apple-text-secondary font-mono">Fulfillment Rate</span>
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">99.8%</div>
              <span className="text-xs text-apple-green">Zero active backorders</span>
            </div>

            <div className="apple-card p-6 space-y-2">
              <span className="text-xs text-apple-text-secondary font-mono">Working Capital Saved</span>
              <div className="text-3xl sm:text-4xl font-bold text-apple-blue-bright tracking-tight">34%</div>
              <span className="text-xs text-apple-text-secondary">Reduced holding cost</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section 5: Final CTA ("Your inventory deserves intelligence.") */}
      <section className="relative py-32 md:py-44 px-6 md:px-12 bg-apple-black border-t border-apple-border overflow-hidden text-center">
        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-radial-glow pointer-events-none opacity-50"></div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
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

      {/* 8. Minimalist Apple Dark Mast Footer */}
      <footer className="py-12 px-6 md:px-12 bg-apple-charcoal text-xs text-apple-text-secondary border-t border-apple-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-apple-text">
            <div className="w-4 h-4 rounded-full bg-apple-blue flex items-center justify-center text-[8px] text-white font-bold">
              SM
            </div>
            <span className="font-semibold">StockMind AI</span>
            <span className="text-apple-border-light">|</span>
            <span className="text-apple-text-secondary">Engineered for precision replenishment</span>
          </div>

          <div className="flex items-center space-x-6 text-apple-text-secondary">
            <button onClick={() => navigate("/dashboard")} className="hover:text-white transition-colors">Console</button>
            <button onClick={() => navigate("/inventory")} className="hover:text-white transition-colors">Inventory</button>
            <button onClick={() => navigate("/forecasting")} className="hover:text-white transition-colors">Forecasting</button>
            <button onClick={() => navigate("/recommendations")} className="hover:text-white transition-colors">Replenishment</button>
          </div>

          <div className="font-mono text-[11px] text-apple-text-tertiary">
            FastAPI · MongoDB Atlas · Scikit-Learn
          </div>
        </div>
      </footer>
    </div>
  );
};
