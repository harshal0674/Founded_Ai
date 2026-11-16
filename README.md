# StockMind AI

> **AI-Powered Inventory Management, Demand Forecasting & Intelligent Replenishment Optimization System**

StockMind AI is an enterprise-grade, responsive SaaS platform designed for offline retailers, online merchants, and SMBs to eliminate stockouts, prevent overstocking, and optimize working capital through machine learning demand projections and automated reorder point calculation.

---

## 1. System Architecture

```
StockMind AI MVP Architecture
┌────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript + Vite + Tailwind CSS)   │
│  · Hallmark Cobalt Design System (Split Studio / Stage) │
│  · Interactive Replenishment Formula Workbench         │
│  · Real-time Recharts KPI & Trajectory Visualizations   │
│  · Catalog CRUD, Sales Recording, and Diagnostics      │
└──────────────────────────┬─────────────────────────────┘
                           │ REST API / JSON (CORS Enabled)
┌──────────────────────────▼─────────────────────────────┐
│  Backend (FastAPI + Python 3.11+)                      │
│  · Health & System Telemetry (/health)                 │
│  · Product Inventory Management (/api/products)        │
│  · Atomic Sales & Negative Stock Locking (/api/sales)  │
│  · Executive Dashboard Aggregations (/api/dashboard)   │
│  · Automated Demo Data Seed Loader (/api/system/seed)  │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
┌─────────────▼───────────────┐ ┌─────────▼──────────────┐
│ Machine Learning Engine     │ │ Database Layer         │
│ · Scikit-Learn Ridge Model  │ │ · MongoDB Atlas        │
│ · Day-of-Week Seasonality   │ │ · Async Motor Driver   │
│ · 7-day Moving Avg Baseline │ │ · Zero-friction Async  │
│ · MAE, RMSE, MAPE Evaluated │ │   In-Memory Fallback   │
└─────────────────────────────┘ └────────────────────────┘
```

---

## 2. Core Features & Capabilities

### P0 — MVP Capabilities (100% Implemented & Verified)
1. **Hallmark-Designed Landing Page (`/`)**: Built strictly following the Hallmark Cobalt design specifications with zero slop, keycap controls, real ASCII telemetry ground, and interactive parameter workbench.
2. **Executive Command Dashboard (`/dashboard`)**: Displays live stock values, 30-day gross revenue, active stockout risks, pending reorders, 30-day sales velocity charts, and category capital distribution.
3. **Full Inventory Catalog CRUD (`/inventory`)**: Search by name or SKU, filter by category or stock status, create, edit, delete, and execute instant inbound restocks.
4. **Sales Recording & Atomic Stock Deduction (`/sales`)**: Decrements on-hand inventory atomically upon order placement. Validates stock availability to strictly prevent negative inventory.
5. **Autoregressive ML Demand Forecasting (`/forecasting`)**: Scikit-learn Ridge regression trained on historical sales velocity, 7-day cyclical seasonality, and rolling averages with evaluated MAE, RMSE, MAPE metrics and 95% confidence intervals.
6. **Intelligent Replenishment Optimization (`/recommendations`)**: Calculates dynamic Safety Stock and Reorder Points ($ROP = (d \times L) + SS$), prioritizes SKUs by urgency (Critical, High, Medium, Healthy), and computes total capital required.
7. **Comprehensive Analytics (`/analytics`)**: Capital allocation per category and channel contribution (Retail vs Wholesale vs Online).
8. **System Diagnostics & Seed Controls (`/settings`)**: Real-time database mode indicator (MongoDB Atlas vs Standalone) and one-click demo data reset.

---

## 3. Mathematical & Optimization Formulations

### Safety Stock ($SS$)
$$SS = Z \times \sigma_d \times \sqrt{L}$$
Where:
- $Z = 1.65$ (standard 95% service level)
- $\sigma_d$: Standard deviation of daily sales demand
- $L$: Supplier lead time (days)

### Reorder Point ($ROP$)
$$ROP = (\mu_d \times L) + SS$$
Where:
- $\mu_d$: Average daily demand velocity
- When $\text{Current Stock} \le ROP$, a high-priority replenishment trigger is raised.

### Forecast Evaluation Metrics
- **Mean Absolute Error (MAE)**: $\frac{1}{n}\sum_{i=1}^{n}|y_i - \hat{y}_i|$
- **Root Mean Squared Error (RMSE)**: $\sqrt{\frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2}$
- **Mean Absolute Percentage Error (MAPE)**: $\frac{100\%}{n}\sum_{i=1}^{n}\left|\frac{y_i - \hat{y}_i}{y_i}\right|$

---

## 4. Local Development Quickstart

### Prerequisites
- Node.js (v18+) & npm (v9+)
- Python (v3.10+) & pip

### Backend Setup
```bash
# 1. Install python dependencies
pip install -r backend/requirements.txt

# 2. Run backend server (default: port 8000)
python backend/run.py
```
Backend will be live at `http://localhost:8000` with interactive API docs at `http://localhost:8000/docs`.

### Frontend Setup
```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite dev server
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## 5. Automated Verification & Testing

### Backend Unit & Integration Tests (Pytest)
```bash
python -m pytest backend/tests/test_api.py -v
```
Verifies:
- `test_health`: Health check & database connection
- `test_products_crud`: Product creation, retrieval, updates, and deletion
- `test_sales_and_stock_deduction`: Atomic stock deduction & HTTP 400 negative stock prevention
- `test_forecasting_and_recommendations`: ML forecast generation, MAE/RMSE calculation, and safety stock math
- `test_dashboard_stats_and_charts`: Statistical aggregation across time series

### Frontend Production Build
```bash
cd frontend && npm run build
```

### Hallmark Design Linter
```bash
node <path-to-hallmark>/scripts/sloplint.mjs frontend/src/index.css frontend/src/pages/LandingPage.tsx --genre modern-minimal
```

---

## 6. Deployment Guide

### Database: MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtain connection URI: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/stockmind_db?retryWrites=true&w=majority`.
3. Set `MONGODB_URI` environment variable in your backend deployment.

### Backend: Render or Railway
- Deploy using `render.yaml` or connect GitHub repository.
- Build command: `pip install -r backend/requirements.txt`
- Start command: `python backend/run.py`
- Environment variables:
  - `PORT=8000`
  - `ENVIRONMENT=production`
  - `MONGODB_URI=<your-atlas-uri>`
  - `CORS_ORIGINS=https://<your-frontend>.vercel.app`

### Frontend: Vercel
1. Import repository to [Vercel](https://vercel.com).
2. Root Directory: `frontend` (or project root with bundled `vercel.json`).
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
  - `VITE_API_BASE_URL=https://<your-backend-app>.onrender.com`

---

## 7. License
MIT License. Created for StockMind AI autonomous production deployment.
