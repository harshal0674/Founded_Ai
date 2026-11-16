import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Cpu,
  Info,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
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

  const totalForecastUnits = forecastData
    ? forecastData.forecast.reduce((acc, f) => acc + f.predicted_units, 0)
    : 0;

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1D1D20]">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Demand Forecasting Intelligence
          </h1>
          <p className="text-xs md:text-sm text-apple-text-secondary mt-1">
            Autoregressive Ridge Regression with day-of-week seasonality, 7-day cyclical lags, and 95% uncertainty envelopes.
          </p>
        </div>

        <button
          onClick={() => fetchForecast(selectedProductId, horizonDays)}
          className="apple-btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-apple-blue-bright" : ""}`} />
          <span>Retrain & Recalibrate</span>
        </button>
      </div>

      {/* Control Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 apple-card p-4 items-center">
        <div className="md:col-span-8">
          <label className="block text-apple-text-secondary font-mono text-[11px] mb-1.5">Selected Target SKU</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-xs text-white focus:outline-none focus:border-apple-blue-bright"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — {p.category}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <label className="block text-apple-text-secondary font-mono text-[11px] mb-1.5">Projection Horizon</label>
          <div className="grid grid-cols-3 gap-2">
            {[14, 30, 60].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizonDays(h)}
                className={`py-2 rounded-xl text-xs font-mono transition-all ${
                  horizonDays === h
                    ? "bg-apple-blue text-white font-semibold shadow-glow-blue-subtle"
                    : "bg-[#18181C] text-apple-text-secondary border border-apple-border hover:text-white"
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
        <div className="p-4 bg-apple-red/10 border border-apple-red/30 rounded-xl text-xs text-apple-red flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Evaluated Model Performance Cards */}
      {forecastData && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="apple-card p-4 space-y-1">
            <span className="text-[10px] font-mono text-apple-text-secondary uppercase">Model Architecture</span>
            <div className="font-semibold text-xs text-white truncate" title={forecastData.model_used}>
              {forecastData.metrics.is_fallback ? "Moving Average Fallback" : "Ridge Regression"}
            </div>
            <div className="text-[10px] text-apple-text-secondary font-mono">
              {forecastData.metrics.data_points} training points
            </div>
          </div>

          <div className="apple-card p-4 space-y-1">
            <span className="text-[10px] font-mono text-apple-text-secondary uppercase">Mean Abs Error (MAE)</span>
            <div className="font-bold text-2xl text-white">
              {forecastData.metrics.mae} <span className="text-xs font-normal text-apple-text-secondary">units</span>
            </div>
            <div className="text-[10px] text-apple-text-secondary font-mono">Holdout error</div>
          </div>

          <div className="apple-card p-4 space-y-1">
            <span className="text-[10px] font-mono text-apple-text-secondary uppercase">Root Mean Sq (RMSE)</span>
            <div className="font-bold text-2xl text-white">
              {forecastData.metrics.rmse} <span className="text-xs font-normal text-apple-text-secondary">units</span>
            </div>
            <div className="text-[10px] text-apple-text-secondary font-mono">Penalizes large errors</div>
          </div>

          <div className="apple-card p-4 space-y-1">
            <span className="text-[10px] font-mono text-apple-text-secondary uppercase">MAPE Accuracy</span>
            <div className="font-bold text-2xl text-apple-green">
              {forecastData.metrics.mape}%
            </div>
            <div className="text-[10px] text-apple-text-secondary font-mono">Relative error</div>
          </div>

          <div className="apple-card p-4 space-y-1 col-span-2 md:col-span-1">
            <span className="text-[10px] font-mono text-apple-text-secondary uppercase">Expected Horizon Demand</span>
            <div className="font-bold text-2xl text-apple-blue-bright">
              {Math.round(totalForecastUnits).toLocaleString()} <span className="text-xs font-normal text-apple-text-secondary">units</span>
            </div>
            <div className="text-[10px] text-apple-text-secondary font-mono">Next {horizonDays} days</div>
          </div>
        </div>
      )}

      {/* Main Trajectory Visualization */}
      <div className="apple-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Historical Consumption vs. Model Projections
            </h3>
            <p className="text-xs text-apple-text-secondary mt-0.5">
              Solid line represents recorded historical demand; blue line represents ML prediction with shaded 95% uncertainty interval.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-apple-text-secondary"></span>
              <span className="text-apple-text-secondary">Historical</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-apple-blue-bright"></span>
              <span className="text-apple-blue-bright font-semibold">Forecast</span>
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-apple-text-secondary font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-apple-blue-bright mr-2" />
              <span>Fitting autoregressive parameters & generating forecast...</span>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="appleForecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D1D22" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#86868B" }}
                  axisLine={{ stroke: "#232327" }}
                  tickLine={false}
                  interval={Math.floor(chartData.length / 10)}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#86868B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161618",
                    borderColor: "#28282C",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontFamily: "Inter, sans-serif"
                  }}
                  formatter={(val: any, name: any) => [
                    val !== null ? `${Number(val).toFixed(1)} units` : "-",
                    String(name) === "historical" ? "Historical Sales" : String(name) === "predicted" ? "Predicted Demand" : String(name)
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="upper_bound"
                  stroke="none"
                  fill="url(#appleForecastGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="historical"
                  stroke="#86868B"
                  strokeWidth={1.5}
                  dot={{ r: 2, fill: "#86868B" }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#0A84FF"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={{ r: 2.5, fill: "#0A84FF" }}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-apple-text-secondary font-mono">
              No historical sales data available.
            </div>
          )}
        </div>
      </div>

      {/* Model Technical Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="apple-card p-6 text-xs space-y-2.5">
          <div className="flex items-center space-x-2 font-semibold text-white">
            <Cpu className="w-4 h-4 text-apple-blue-bright" />
            <span>Feature Engineering & L2 Regularization</span>
          </div>
          <p className="text-apple-text-secondary leading-relaxed">
            Features include 1-day lag velocity, 7-day cyclical seasonality, and rolling averages with harmonic day-of-week encoding to capture purchasing trends without overfitting.
          </p>
        </div>

        <div className="apple-card p-6 text-xs space-y-2.5">
          <div className="flex items-center space-x-2 font-semibold text-white">
            <Info className="w-4 h-4 text-apple-blue-bright" />
            <span>Uncertainty Expansion</span>
          </div>
          <p className="text-apple-text-secondary leading-relaxed">
            Confidence bounds expand over time with compound factor to account for natural multi-step degradation. Non-negativity constraints are strictly enforced to prevent negative inventory projections.
          </p>
        </div>
      </div>
    </div>
  );
};
