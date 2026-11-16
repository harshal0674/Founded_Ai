import React, { useState } from "react";
import { ArrowRight, Boxes, TrendingUp, ShieldAlert } from "lucide-react";

interface LandingPageProps {
  navigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  // Interactive workbench state for replenishment simulation
  const [leadTime, setLeadTime] = useState<number>(7);
  const [dailyVelocity, setDailyVelocity] = useState<number>(12);
  const [demandStd, setDemandStd] = useState<number>(3.5);

  const zScore = 1.65; // 95% service level
  const safetyStock = Math.ceil(zScore * demandStd * Math.sqrt(leadTime));
  const reorderPoint = Math.ceil(dailyVelocity * leadTime + safetyStock);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-body antialiased">
      {/* Edge-Aligned Navigation */}
      <nav className="h-16 border-b border-rule px-6 md:px-12 flex items-center justify-between bg-paper sticky top-0 z-[var(--z-sticky-nav)]">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center text-accent-ink font-display font-semibold text-xs tracking-tighter">
            SM
          </div>
          <span className="font-display font-semibold text-ink text-base tracking-tight">
            StockMind AI
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm text-ink-2">
          <a href="#workbench" className="hover:text-ink transition-colors">Formulas</a>
          <a href="#features" className="hover:text-ink transition-colors">Architecture</a>
          <button onClick={() => navigate("/dashboard")} className="hover:text-ink transition-colors">Console</button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="keycap keycap-primary text-xs px-4 py-2 whitespace-nowrap"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </nav>

      {/* Hero: Stage (Split Studio) */}
      <section className="border-b border-rule bg-paper">
        <div className="max-w-[var(--container)] mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-sm border border-rule bg-paper-2 text-xs font-mono text-muted">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <span>Autonomous Replenishment Engine / v1.0</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-[1.08]">
              Predict demand. Replenish with zero stockouts.
            </h1>

            <p className="text-base sm:text-lg text-ink-2 max-w-[50ch] leading-relaxed">
              StockMind AI computes exact reorder thresholds and forecasts sales daily.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="keycap keycap-primary text-sm px-5 py-2.5 flex items-center space-x-2 whitespace-nowrap"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/forecasting")}
                className="keycap text-sm px-5 py-2.5 text-ink-2 whitespace-nowrap"
              >
                Inspect ML Models
              </button>
            </div>

            {/* Quick Spec Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-rule text-xs">
              <div>
                <span className="block font-mono text-muted text-[11px]">Safety Formula</span>
                <span className="font-display font-medium text-ink">Z × σ × √L</span>
              </div>
              <div>
                <span className="block font-mono text-muted text-[11px]">Forecasting</span>
                <span className="font-display font-medium text-ink">Ridge + Seasonal Lags</span>
              </div>
              <div>
                <span className="block font-mono text-muted text-[11px]">Storage</span>
                <span className="font-display font-medium text-ink">MongoDB Atlas</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Technical Stage Preview */}
          <div className="lg:col-span-6">
            <div className="panel-cut graphite-panel p-5 font-mono text-xs shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-graphite-2 text-graphite-muted">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-accent/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-success/80"></div>
                  <span className="ml-2 text-graphite-ink">stockmind-daemon::telemetry</span>
                </div>
                <span>LIVE FEED</span>
              </div>

              {/* Realtime ASCII Telemetry Stream */}
              <div className="space-y-1.5 text-[11px] leading-snug">
                <div className="text-graphite-muted">
                  [00:04:12] Initializing ML regression pipeline…
                </div>
                <div className="text-accent-2">
                  [00:04:13] Model trained: RidgeAutoregressiveForecaster (horizon=30d)
                </div>
                <div className="text-graphite-ink">
                  [00:04:13] Evaluated metrics: MAE=2.41, RMSE=3.12, MAPE=8.5%
                </div>
                <div className="text-danger">
                  [00:04:14] ALERT: SEN-HAL-010 stock=14 &lt; ROP=122 (Deficit=108 units)
                </div>
                <div className="text-success">
                  [00:04:15] Replenishment suggested: 120 units via Nordic Microtech
                </div>
              </div>

              {/* Mini ASCII Trajectory Chart */}
              <div className="p-3 bg-graphite-2 rounded border border-graphite-2 font-mono text-[10px] space-y-1">
                <div className="flex justify-between text-graphite-muted">
                  <span>HISTORICAL SALES</span>
                  <span>PREDICTED TRAJECTORY</span>
                </div>
                <div className="text-accent-2 overflow-x-auto whitespace-pre">
                  {"18|    *    *          :  . - - - .\n" +
                   "14|  *   *    *        : .         . \n" +
                   "10| *         *    *   :             .\n" +
                   " 6|             *      :\n" +
                   "  +--------------------+------------------->\n" +
                   "    T-14              T0            T+30"}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-graphite-muted">
                <span>Database: MongoDB Atlas (Replica Set)</span>
                <span className="text-accent-2">Status: Synced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Replenishment Workbench */}
      <section id="workbench" className="py-16 border-b border-rule bg-paper-2">
        <div className="max-w-[var(--container)] mx-auto px-6 md:px-12 space-y-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              Deterministic Replenishment Calculation
            </h2>
            <p className="text-sm text-ink-2 max-w-[60ch] mt-1">
              Adjust parameters below to see how lead time, velocity, and variance shift the Reorder Point in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Sliders */}
            <div className="md:col-span-7 space-y-5 bg-paper p-6 rounded-card border border-rule">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-ink">Supplier Lead Time (Days):</span>
                  <span className="font-mono text-accent">{leadTime} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={leadTime}
                  onChange={(e) => setLeadTime(Number(e.target.value))}
                  className="w-full accent-[var(--color-accent)] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-ink">Daily Sales Velocity (Units/day):</span>
                  <span className="font-mono text-accent">{dailyVelocity} units</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={dailyVelocity}
                  onChange={(e) => setDailyVelocity(Number(e.target.value))}
                  className="w-full accent-[var(--color-accent)] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-ink">Daily Demand Volatility (Std Dev σ):</span>
                  <span className="font-mono text-accent">{demandStd} units</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={demandStd}
                  onChange={(e) => setDemandStd(Number(e.target.value))}
                  className="w-full accent-[var(--color-accent)] cursor-pointer"
                />
              </div>
            </div>

            {/* Computed Output Cards */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 bg-paper rounded-card border border-rule space-y-1">
                <span className="text-[11px] font-mono text-muted">Safety Buffer (SS)</span>
                <div className="text-3xl font-display font-semibold text-ink">{safetyStock}</div>
                <p className="text-[11px] text-muted font-mono">Z (1.65) × σ × √L</p>
              </div>

              <div className="p-5 bg-paper rounded-card border-2 border-accent space-y-1">
                <span className="text-[11px] font-mono text-accent">Reorder Point (ROP)</span>
                <div className="text-3xl font-display font-semibold text-accent">{reorderPoint}</div>
                <p className="text-[11px] text-muted font-mono">(Velocity × L) + SS</p>
              </div>

              <div className="col-span-2 p-4 bg-paper rounded-card border border-rule text-xs text-ink-2 space-y-2">
                <div className="font-display font-medium text-ink">Automated Trigger Rule:</div>
                <p className="leading-relaxed">
                  When on-hand stock falls to or below <strong className="text-ink">{reorderPoint} units</strong>, StockMind immediately signals a high-priority replenishment recommendation to prevent stockout during the {leadTime}-day replenishment transit window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Ledger: Concrete Technical Capabilities */}
      <section id="features" className="py-16 border-b border-rule bg-paper">
        <div className="max-w-[var(--container)] mx-auto px-6 md:px-12 space-y-10">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              Engineered for inventory reliability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-card border border-rule bg-paper space-y-3">
              <div className="w-9 h-9 rounded-sm bg-accent-wash border border-accent/20 flex items-center justify-center text-accent">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-ink text-lg">
                Atomic Stock Decrement
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Sales transactions atomically deduct from physical on-hand quantity. If available quantity is insufficient, orders fail immediately with validation, eliminating overselling.
              </p>
            </div>

            <div className="p-6 rounded-card border border-rule bg-paper space-y-3">
              <div className="w-9 h-9 rounded-sm bg-accent-wash border border-accent/20 flex items-center justify-center text-accent">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-ink text-lg">
                Ridge ML Demand Forecaster
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Employs Scikit-learn Ridge regression trained on daily sales velocity, 7-day cyclical seasonality, and rolling moving averages. Produces 30-day confidence bounds with calculated MAE and RMSE.
              </p>
            </div>

            <div className="p-6 rounded-card border border-rule bg-paper space-y-3">
              <div className="w-9 h-9 rounded-sm bg-accent-wash border border-accent/20 flex items-center justify-center text-accent">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-ink text-lg">
                Replenishment Optimization
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Continuously evaluates days until stockout against lead time. Categorizes items into critical, high, medium, and healthy tiers with automated capital requirement estimates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Close Action Band */}
      <section className="py-16 bg-paper-2 border-b border-rule">
        <div className="max-w-[var(--container)] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Ready to explore StockMind AI?
            </h2>
            <p className="text-sm text-ink-2 mt-1">
              Experience the full interactive dashboard, live inventory CRUD, and forecasting models.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="keycap keycap-primary text-sm px-6 py-3 flex items-center space-x-2 whitespace-nowrap"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Mast Footer */}
      <footer className="py-10 px-6 md:px-12 bg-paper text-xs text-muted border-t border-rule">
        <div className="max-w-[var(--container)] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-display font-semibold text-ink">StockMind AI</span>
            <span>/</span>
            <span>FastAPI + MongoDB Atlas + Scikit-Learn</span>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => navigate("/dashboard")} className="hover:text-ink">Console</button>
            <button onClick={() => navigate("/inventory")} className="hover:text-ink">Inventory</button>
            <button onClick={() => navigate("/forecasting")} className="hover:text-ink">Forecasting</button>
            <button onClick={() => navigate("/recommendations")} className="hover:text-ink">Replenishment</button>
          </div>

          <div className="font-mono text-[11px]">
            Hallmark v2.0 / Cobalt Theme
          </div>
        </div>
      </footer>
    </div>
  );
};
