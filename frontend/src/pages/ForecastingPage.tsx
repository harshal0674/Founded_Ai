import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  BrainCircuit,
  Calendar,
  AlertCircle,
  RefreshCw,
  Cpu,
  Sliders,
  CheckCircle2,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { api } from "../api/client";
import { Product, ProductForecast } from "../types";

export const ForecastingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [horizonDays, setHorizonDays] = useState<number>(30);
  const [forecastData, setForecastData] = useState<ProductForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    api.getProducts()
      .then((prods) => {
        setProducts(prods);
        if (prods.length > 0) {
          setSelectedProductId(prods[0].id);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  const fetchForecast = async (pId: string, horizon: number) => {
    if (!pId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getForecast(pId, horizon);
      setForecastData(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate forecast");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProductId) {
      fetchForecast(selectedProductId, horizonDays);
    }
  }, [selectedProductId, horizonDays]);

  // Combine historical and forecast points into a continuous chart dataset
  const chartData: any[] = [];

  if (forecastData) {
    forecastData.historical.forEach((h) => {
      chartData.push({
        date: h.date,
        historical: h.units,
        predicted: null,
        lower_bound: null,
        upper_bound: null,
      });
    });

    forecastData.forecast.forEach((f) => {
      chartData.push({
        date: f.date,
        historical: null,
        predicted: f.predicted_units,
        lower_bound: f.lower_bound,
        upper_bound: f.upper_bound,
      });
    });
  }

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // 30-day forecasted sum
  const totalForecastUnits = forecastData
    ? forecastData.forecast.reduce((acc, f) => acc + f.predicted_units, 0)
    : 0;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[var(--container)] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-rule">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">
            Machine Learning Demand Forecasting
          </h1>
          <p className="text-xs md:text-sm text-ink-2 mt-0.5">
            Autoregressive Ridge Regression with day-of-week seasonality, 7-day cyclical lags, and 95% uncertainty envelopes.
          </p>
        </div>

        <button
          onClick={() => fetchForecast(selectedProductId, horizonDays)}
          className="keycap text-xs py-2 px-3 text-ink-2 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`} />
          <span>Retrain / Forecast</span>
        </button>
      </div>

      {/* Control Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-paper p-4 rounded-card border border-rule shadow-card items-center">
        <div className="md:col-span-8">
          <label className="block text-muted font-mono text-[11px] mb-1">Target Product SKU</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full p-2 bg-paper-2 border border-rule rounded-input text-xs text-ink focus:outline-none focus:border-accent"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — {p.category}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <label className="block text-muted font-mono text-[11px] mb-1">Projection Horizon</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[14, 30, 60].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizonDays(h)}
                className={`py-1.5 rounded-input text-xs font-mono border transition-colors ${
                  horizonDays === h
                    ? "bg-accent text-accent-ink border-accent font-semibold"
                    : "bg-paper-2 border-rule text-ink-2 hover:bg-paper-3"
                }`}
              >
                {h} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-card text-xs text-danger flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Model Performance & Evaluation Metrics Banner */}
      {forecastData && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3.5 bg-paper rounded-card border border-rule shadow-card">
            <span className="text-[10px] font-mono text-muted uppercase">Model Architecture</span>
            <div className="font-display font-semibold text-xs text-ink mt-1 truncate" title={forecastData.model_used}>
              {forecastData.metrics.is_fallback ? "Moving Average Fallback" : "Ridge Regression"}
            </div>
            <div className="text-[10px] text-muted font-mono mt-0.5">
              {forecastData.metrics.data_points} training points
            </div>
          </div>

          <div className="p-3.5 bg-paper rounded-card border border-rule shadow-card">
            <span className="text-[10px] font-mono text-muted uppercase">Mean Abs Error (MAE)</span>
            <div className="font-display font-semibold text-xl text-ink mt-0.5">
              {forecastData.metrics.mae} <span className="text-xs font-normal text-muted">units</span>
            </div>
            <div className="text-[10px] text-muted font-mono mt-0.5">Holdout variance</div>
          </div>

          <div className="p-3.5 bg-paper rounded-card border border-rule shadow-card">
            <span className="text-[10px] font-mono text-muted uppercase">Root Mean Sq (RMSE)</span>
            <div className="font-display font-semibold text-xl text-ink mt-0.5">
              {forecastData.metrics.rmse} <span className="text-xs font-normal text-muted">units</span>
            </div>
            <div className="text-[10px] text-muted font-mono mt-0.5">Penalizes large errors</div>
          </div>

          <div className="p-3.5 bg-paper rounded-card border border-rule shadow-card">
            <span className="text-[10px] font-mono text-muted uppercase">Mean Abs % Error (MAPE)</span>
            <div className="font-display font-semibold text-xl text-ink mt-0.5">
              {forecastData.metrics.mape}%
            </div>
            <div className="text-[10px] text-muted font-mono mt-0.5">Relative accuracy</div>
          </div>

          <div className="p-3.5 bg-paper rounded-card border border-rule shadow-card col-span-2 md:col-span-1">
            <span className="text-[10px] font-mono text-muted uppercase">Expected Total Demand</span>
            <div className="font-display font-semibold text-xl text-accent mt-0.5">
              {Math.round(totalForecastUnits).toLocaleString()} <span className="text-xs font-normal text-muted">units</span>
            </div>
            <div className="text-[10px] text-muted font-mono mt-0.5">Next {horizonDays} days</div>
          </div>
        </div>
      )}

      {/* Main Trajectory Visualization */}
      <div className="p-5 rounded-card border border-rule bg-paper shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-base text-ink">
              Historical Consumption vs. Model Projections
            </h3>
            <p className="text-xs text-muted">
              Solid line represents recorded historical demand; blue line represents ML prediction with shaded 95% uncertainty interval.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-ink"></span>
              <span className="text-muted">Historical</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-accent"></span>
              <span className="text-accent font-semibold">Forecast</span>
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-muted font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-accent mr-2" />
              <span>Fitting autoregressive parameters & generating forecast...</span>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="boundsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-rule)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: "var(--color-muted)" }}
                  axisLine={{ stroke: "var(--color-rule)" }}
                  tickLine={false}
                  interval={Math.floor(chartData.length / 10)}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "var(--color-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-graphite)",
                    borderColor: "var(--color-graphite-2)",
                    borderRadius: "6px",
                    color: "var(--color-graphite-ink)",
                    fontSize: "11px",
                    fontFamily: "var(--font-outlier)"
                  }}
                  formatter={(val: any, name: any) => [
                    val !== null ? `${Number(val).toFixed(1)} units` : "-",
                    String(name) === "historical" ? "Historical Sales" : String(name) === "predicted" ? "Predicted Demand" : String(name)
                  ]}
                />
                {/* Confidence interval area */}
                <Area
                  type="monotone"
                  dataKey="upper_bound"
                  stroke="none"
                  fill="url(#boundsGrad)"
                />
                {/* Historical Line */}
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="var(--color-ink)"
                  strokeWidth={1.5}
                  dot={{ r: 2, fill: "var(--color-ink)" }}
                  connectNulls={false}
                />
                {/* ML Forecast Line */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="var(--color-accent)"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={{ r: 2.5, fill: "var(--color-accent)" }}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted font-mono">
              No historical sales points available to build forecasting model.
            </div>
          )}
        </div>
      </div>

      {/* Model Technical Documentation & Feature Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-paper rounded-card border border-rule text-xs space-y-2">
          <div className="flex items-center space-x-2 font-display font-semibold text-ink">
            <Cpu className="w-4 h-4 text-accent" />
            <span>Feature Pipeline & L2 Regularization</span>
          </div>
          <p className="text-ink-2 leading-relaxed">
            The model generates features including <code className="font-mono text-accent">lag_1</code> (previous day demand), <code className="font-mono text-accent">lag_7</code> (same day previous week), <code className="font-mono text-accent">rolling_7</code> (smoothed 7-day velocity), and cyclical sin/cos transformations of day of week to isolate weekend demand surges without overfitting.
          </p>
        </div>

        <div className="p-4 bg-paper rounded-card border border-rule text-xs space-y-2">
          <div className="flex items-center space-x-2 font-display font-semibold text-ink">
            <Info className="w-4 h-4 text-accent" />
            <span>Uncertainty & Multi-Step Propagation</span>
          </div>
          <p className="text-ink-2 leading-relaxed">
            Uncertainty bounds expand over time with factor <code className="font-mono text-accent">Z × σ_res × √(1 + 0.05 × t)</code> to account for compound forecast degradation. Non-negativity constraints are strictly enforced to prevent invalid negative inventory projections.
          </p>
        </div>
      </div>
    </div>
  );
};
