<!-- =========================================================================
     JECRC UNIVERSITY — MAJOR PROJECT REPORT (B.Tech. CSE, VII Semester)
     Project: StockMind AI
     Team: Founded (Harshal Modi, Siddharth Saxena, Puneet)
     Guide: Ms. Nupur Chaudhary
     Session: 2025–26

     WORD / PDF FORMATTING CHECKLIST (From JECRC Template):
     - Paper Size: A4 | Margins: Top 1", Bottom 1", Left 1.5", Right 1"
     - Line Spacing: 1.5 | Body Font: Times New Roman 12pt, Justified
     - Chapter Title: TNR 18pt Bold
     - 1st Order Heading: TNR 16pt Bold | 2nd: TNR 14pt Bold | 3rd: TNR 12pt Bold
     - Abstract: Heading TNR 16pt Bold Italic + 2 blank lines; Text TNR 12pt Italic Justified (150-200 words, 1 paragraph)
     - Captions: Garamond 10pt Bold Centered (Table caption ABOVE table; Figure caption BELOW figure)
     - Page Numbers (Centered): Roman (i, ii...) before Ch 1; Arabic (1, 2...) from Ch 1 to References
     - Printing: Spiral bound, N+1 copies (4 copies: 1 University copy with all names, 3 personal copies)
     ========================================================================= -->

&nbsp;

<div align="center">

# MAJOR PROJECT REPORT

on

## “StockMind AI: AI-Powered Multi-Tenant Inventory Management, Demand Forecasting & Replenishment Optimization System”

*Submitted in partial fulfillment of the requirements for the award of the degree of*

**BACHELOR OF TECHNOLOGY**
in
**COMPUTER SCIENCE AND ENGINEERING**

&nbsp;

**[INSERT JECRC UNIVERSITY LOGO HERE]**

&nbsp;

Submitted By:
**Harshal Modi (23BCON0673)**
**Siddharth Saxena (23BCON0636)**
**Puneet (23BCON1987)**

*(Team: Founded)*

&nbsp;

Under the Supervision of
**Ms. Nupur Chaudhary**
*(Assistant Professor, Department of CSE)*

&nbsp;

**Department of Computer Science and Engineering**
**JECRC University, Jaipur**
**Session: 2025–26**

</div>

---

&nbsp;

# DECLARATION

I/We, **Harshal Modi (23BCON0673)**, **Siddharth Saxena (23BCON0636)**, and **Puneet (23BCON1987)** certify that our major project work embodied in this Report entitled **“StockMind AI: AI-Powered Multi-Tenant Inventory Management, Demand Forecasting & Replenishment Optimization System”** is our own Bonafide work carried out by us under the supervision of **Ms. Nupur Chaudhary** (Guide) at the **Department of Computer Science & Engineering, JECRC University, Jaipur**. The work is original and has not been submitted earlier as a whole or in part for the award of any degree/diploma at this or any other Institution / university in India or abroad.

&nbsp;

**Date:** _______________
**Place:** Jaipur

&nbsp;

| | | |
|---|---|---|
| **Signature of Student 1** | **Signature of Student 2** | **Signature of Student 3** |
| Harshal Modi | Siddharth Saxena | Puneet |
| (Reg. No. 23BCON0673) | (Reg. No. 23BCON0636) | (Reg. No. 23BCON1987) |

&nbsp;

<div align="right">

**Counter Signature**
**Guide**
*(Ms. Nupur Chaudhary)*

</div>

---

&nbsp;

# CERTIFICATE

This is to certify that the Major Project titled **“StockMind AI: AI-Powered Multi-Tenant Inventory Management, Demand Forecasting & Replenishment Optimization System”** has been successfully completed by: **Harshal Modi, Reg. No. 23BCON0673, Siddharth Saxena, Reg. No. 23BCON0636, Puneet, Reg. No. 23BCON1987** under my supervision during VII Semester of B.Tech. (CSE), JECRC University, Jaipur.

&nbsp;

&nbsp;

**(Project Guide Signature)**
Name: Ms. Nupur Chaudhary
Designation: Assistant Professor, Department of CSE

&nbsp;

**(HOD Signature)**
Head, Department of CSE

&nbsp;

**(Dean Signature)**
Dean, School of Engineering

---

&nbsp;

# ACKNOWLEDGEMENT

We would like to express our deepest gratitude to our project guide, **Ms. Nupur Chaudhary**, Assistant Professor, Department of Computer Science and Engineering, JECRC University, Jaipur, for her continuous support, insightful feedback, and expert guidance throughout the design and development of this Major Project. Her constructive suggestions and encouragement helped us overcome technical challenges and refine our system into a complete, production-ready application.

We are sincerely thankful to the **Head of the Department of Computer Science and Engineering** and the **Dean, School of Engineering**, JECRC University, for providing the academic infrastructure, laboratory facilities, and an encouraging environment for research and innovation. We also extend our appreciation to all faculty members of the CSE department whose coursework laid the foundation for our understanding of software engineering, databases, and machine learning.

Finally, we are grateful to our families, friends, and peers for their constant moral support, motivation, and valuable discussions during the entire course of this project.

&nbsp;

**Harshal Modi (23BCON0673)**
**Siddharth Saxena (23BCON0636)**
**Puneet (23BCON1987)**

---

&nbsp;

# *ABSTRACT*

&nbsp;

*Small and medium-sized businesses (SMBs) frequently suffer revenue losses from stockouts, excess capital locked in overstocked items, and reactive manual procurement driven by static spreadsheets rather than predictive analytics. To address this challenge, we present StockMind AI, an AI-powered, multi-tenant Software-as-a-Service (SaaS) platform for real-time inventory management, demand forecasting, and replenishment optimization. The system follows a three-tier cloud-native architecture built with React 19, TypeScript, Tailwind CSS, and Recharts on the frontend, Python 3.11+ and FastAPI on the backend, and MongoDB Atlas via the asynchronous Motor driver for persistent storage, secured with JSON Web Token (JWT) authentication and bcrypt hashing. Its machine learning engine employs an autoregressive Ridge Regression model (alpha = 1.0) trained on lag, rolling mean, trend, and cyclical day-of-week features, with a moving-average fallback for sparse histories, while computing Safety Stock and Reorder Points to classify SKU urgency. Deployed live on Vercel and Render, StockMind AI achieves a 100% pass rate across all seven automated backend tests and delivers actionable, mobile-responsive demand insights with 8%–22% MAPE.*

**Keywords:** Inventory Management, Demand Forecasting, Ridge Regression, Multi-Tenant SaaS, FastAPI, React, MongoDB Atlas, Reorder Point, Safety Stock.

---

&nbsp;

# TABLE OF CONTENTS

| Section | Title | Page |
|---|---|---|
| | DECLARATION | i |
| | CERTIFICATE | ii |
| | ACKNOWLEDGEMENT | iii |
| | ABSTRACT | iv |
| | TABLE OF CONTENTS | v |
| | LIST OF TABLES | vii |
| | LIST OF FIGURES | viii |
| | LIST OF ABBREVIATIONS | ix |
| **Chapter-1** | **Introduction** | **1** |
| 1.1 | Background of the Study | 1 |
| 1.2 | Problem Statement | 2 |
| 1.3 | Objectives of the Project | 3 |
| 1.4 | Scope of the Project | 4 |
| **Chapter-2** | **Literature Review / Analysis** | **5** |
| 2.1 | Related Work | 5 |
| 2.2 | Comparative Study | 7 |
| 2.3 | Feasibility Study | 8 |
| 2.3.1 | Technical Feasibility | 8 |
| 2.3.2 | Economic Feasibility | 9 |
| 2.3.3 | Operational Feasibility | 9 |
| **Chapter-3** | **System Design** | **10** |
| 3.1 | System Architecture | 10 |
| 3.2 | UML Diagrams | 11 |
| 3.2.1 | Use Case Diagram | 11 |
| 3.2.2 | Activity Diagram | 12 |
| 3.2.3 | Sequence Diagram | 12 |
| 3.3 | Data Flow Diagram (DFD) | 13 |
| 3.4 | ER Diagram | 14 |
| 3.5 | Database Design | 15 |
| **Chapter-4** | **Implementation** | **17** |
| 4.1 | Tools & Technologies Used | 17 |
| 4.2 | System Requirements | 18 |
| 4.2.1 | Hardware Requirements | 18 |
| 4.2.2 | Software Requirements | 19 |
| 4.3 | Modules Description | 20 |
| 4.4 | Algorithms / Logic Used | 22 |
| **Chapter-5** | **Testing & Results** | **26** |
| 5.1 | Test Plan | 26 |
| 5.2 | Test Cases | 27 |
| 5.3 | Output Screenshots | 28 |
| 5.4 | Performance Analysis | 30 |
| **Chapter-6** | **Conclusion & Future Work** | **32** |
| 6.1 | Summary of Project | 32 |
| 6.2 | Achievements | 32 |
| 6.3 | Limitations | 33 |
| 6.4 | Future Scope | 33 |
| | **BIBLIOGRAPHY / REFERENCES** | **35** |
| | **APPENDICES** | **37** |
| | Appendix A: User Manual | 37 |
| | Appendix B: Screenshots | 39 |
| | Appendix C: Code (Optional) | 40 |

---

&nbsp;

# LIST OF TABLES

| Table No. | Title | Page |
|---|---|---|
| Table 2.1 | Comparison of Inventory Management Approaches | 7 |
| Table 2.2 | Comparison of Demand Forecasting Techniques | 8 |
| Table 3.1 | MongoDB Collections and Schema Overview | 15 |
| Table 3.2 | RESTful API Endpoints Overview | 16 |
| Table 4.1 | Hardware Requirements | 18 |
| Table 4.2 | Software and Technology Stack | 19 |
| Table 4.3 | Ridge Regression Engineered Features | 23 |
| Table 4.4 | Replenishment Urgency Classification Rules | 25 |
| Table 5.1 | Automated Backend Test Cases (Pytest) | 27 |
| Table 5.2 | Responsive UI & Cross-Device Test Cases | 28 |
| Table 5.3 | Machine Learning Evaluation Metrics | 30 |
| Table 5.4 | Observed API Response Latency | 31 |

---

&nbsp;

# LIST OF FIGURES

| Figure No. | Title | Page |
|---|---|---|
| Figure 3.1 | Three-Tier System Architecture of StockMind AI | 10 |
| Figure 3.2 | Use Case Diagram — Business User & System Interactions | 11 |
| Figure 3.3 | Activity Diagram — Atomic Sales & Replenishment Workflow | 12 |
| Figure 3.4 | Sequence Diagram — Authenticated Demand Forecasting Request | 12 |
| Figure 3.5 | Data Flow Diagram (DFD Level 0 — Context Diagram) | 13 |
| Figure 3.6 | Data Flow Diagram (DFD Level 1 — Core Processes) | 13 |
| Figure 3.7 | Entity-Relationship (ER) Diagram — MongoDB Collections | 14 |
| Figure 4.1 | Autoregressive Ridge Regression Forecasting Pipeline | 23 |
| Figure 5.1 | Landing Page and Interactive Replenishment Workbench | 28 |
| Figure 5.2 | Executive Command Dashboard — KPI Cards & Revenue Chart | 29 |
| Figure 5.3 | AI Demand Forecasting Trajectory & Confidence Intervals | 29 |
| Figure 5.4 | Replenishment Optimization & Urgency Tier View | 29 |

---

&nbsp;

# LIST OF ABBREVIATIONS

| Abbreviation | Full Form |
|---|---|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| ARIMA | Autoregressive Integrated Moving Average |
| ASGI | Asynchronous Server Gateway Interface |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| DFD | Data Flow Diagram |
| ER | Entity Relationship |
| ERP | Enterprise Resource Planning |
| HTTP | HyperText Transfer Protocol |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| KPI | Key Performance Indicator |
| LSTM | Long Short-Term Memory |
| MAE | Mean Absolute Error |
| MAPE | Mean Absolute Percentage Error |
| ML | Machine Learning |
| REST | Representational State Transfer |
| RMSE | Root Mean Squared Error |
| ROP | Reorder Point |
| SaaS | Software as a Service |
| SKU | Stock Keeping Unit |
| SMB | Small and Medium-Sized Business |
| SS | Safety Stock |
| UI | User Interface |
| UML | Unified Modeling Language |

---

&nbsp;

# CHAPTER 1: INTRODUCTION

## 1.1 Background of Study

Inventory management is a fundamental operational pillar for retail, wholesale, and e-commerce businesses. For small and medium-sized businesses (SMBs) in India, maintaining optimal stock levels across dozens or hundreds of Stock Keeping Units (SKUs) directly governs working capital efficiency, customer retention, and profit margins. Despite rapid growth in digital commerce, a significant portion of Indian SMBs still rely on manual ledgers, disconnected spreadsheets, or legacy billing software that offer no predictive analytics or automated replenishment intelligence.

Without data-driven demand forecasting, procurement decisions remain reactive. Ordering too late results in stockouts and lost revenue, whereas ordering too early or in excess locks up scarce working capital in slow-moving goods. Recent advancements in cloud computing, lightweight machine learning frameworks, and modern web technologies enable the delivery of enterprise-grade predictive inventory intelligence as an affordable, browser-accessible Software-as-a-Service (SaaS) platform. **StockMind AI** is developed in this context to bridge the gap between basic stock-keeping tools and expensive enterprise Resource Planning (ERP) suites.

## 1.2 Problem Statement

Indian SMBs operating across retail, wholesale, and online channels face persistent inventory inefficiencies caused by the lack of an accessible, intelligent, and multi-tenant inventory platform. Specifically, the key problems addressed by this project are:

1. **Lack of Real-Time Stock Visibility**: Manual spreadsheets and isolated billing tools fail to synchronize inventory atomically across sales transactions, leading to stock discrepancies and overselling.
2. **Absence of Predictive Demand Forecasting**: Existing affordable tools only report historical sales rather than predicting future demand velocity, leaving managers to rely on guesswork.
3. **Suboptimal Replenishment Timing**: Without statistical Safety Stock and Reorder Point calculations, businesses frequently experience preventable stockouts during supplier lead times or excessive holding costs from over-ordering.
4. **Lack of Multi-Tenant Isolation & Mobile Accessibility**: Lightweight tools are typically single-tenant desktop utilities that cannot serve multiple independent organizations securely or render cleanly on mobile devices.

## 1.3 Objectives of the Project

The primary objectives of **StockMind AI** are:

1. To design and implement a **multi-tenant SaaS inventory management platform** with strict organization-level data isolation using JWT authentication and bcrypt password hashing.
2. To build an **atomic sales and catalog management engine** supporting full CRUD operations, automatic SKU generation, and negative-stock prevention.
3. To develop a **machine learning demand forecasting pipeline** using autoregressive Ridge Regression with seasonal and lag features, providing 14–30 day forecasts with 95% confidence intervals and MAE/RMSE/MAPE evaluation.
4. To implement **mathematically grounded replenishment optimization** using Safety Stock ($SS$) and Reorder Point ($ROP$) formulas, classifying SKUs into Critical, High, Medium, and Healthy urgency tiers.
5. To deliver a **responsive, mobile-friendly frontend** with executive KPI dashboards, Recharts visualizations, and Indian numeral formatting (Lakhs/Crores), deployed live on cloud infrastructure.

## 1.4 Scope of the Project

**In Scope:**
- Multi-tenant user registration, login, and organization-scoped data access.
- Product catalog management (create, read, update, delete, instant restock, auto-SKU generation).
- Sales recording with atomic stock deduction and HTTP 400 validation against negative inventory.
- Individual SKU demand forecasting (14–30 day horizon) with automatic fallback to a 7-day moving average baseline for products with fewer than 10 historical data points.
- Replenishment recommendations, capital-required estimation, and category/channel analytics.
- One-click demo data seeding and clearing for evaluation, plus interactive OpenAPI (`/docs`) documentation.
- Cloud deployment on Vercel (frontend), Render (backend), and MongoDB Atlas (database).

**Out of Scope:**
- Hardware barcode/QR scanner integration.
- Automated supplier Electronic Data Interchange (EDI) purchase order dispatch.
- Multi-warehouse location transfer management and native iOS/Android mobile apps.

---

&nbsp;

# CHAPTER 2: LITERATURE REVIEW / ANALYSIS

## 2.1 Related Work

Inventory control and demand forecasting have been extensively studied across operations research and machine learning literature:

- **Traditional Inventory Control (Silver, Pyke & Peterson, 1998; Chopra & Meindl, 2016)**: Classical inventory theory establishes stochastic Safety Stock ($SS = Z \cdot \sigma_d \cdot \sqrt{L}$) and Reorder Point ($ROP = \mu_d \cdot L + SS$) models to buffer against demand variability during supplier lead times. While mathematically sound, these formulas are rarely automated in SMB software.
- **Statistical Time-Series Forecasting (Box & Jenkins, 1976; Holt, 1957; Winters, 1960)**: Moving averages, Holt-Winters exponential smoothing, and ARIMA/SARIMA models are widely used for demand projection. However, ARIMA requires manual stationarity checks, hyperparameter tuning $(p,d,q)$, and longer historical series to fit reliably.
- **Deep Learning & Tree Ensembles (Hochreiter & Schmidhuber, 1997; Chen & Guestrin, 2016)**: LSTM neural networks and gradient-boosted trees (XGBoost, LightGBM) achieve high accuracy on massive retail datasets (e.g., M5 competition), but require large sample sizes, GPU compute, and lack straightforward interpretability for small-data SMB SKUs.
- **Regularized Regression with Lag Features (Hoerl & Kennard, 1970; Bandara et al., 2020; Carbonneau et al., 2008)**: Research demonstrates that linear models with L2 regularization (Ridge Regression) combined with domain-engineered lag, rolling-mean, and cyclical temporal features perform strongly on short-horizon forecasting with limited historical observations while remaining fast and interpretable.

## 2.2 Comparative Study

<div align="center">

**Table 2.1: Comparison of Inventory Management Approaches**

| Feature | Manual / Spreadsheets | Enterprise ERP (SAP/Oracle) | Standalone SMB Software | StockMind AI (Proposed) |
|---|---|---|---|---|
| Cost | Free | Very High | Moderate | Low / Cloud SaaS |
| Real-Time Atomic Tracking | No | Yes | Partial | Yes |
| Multi-Tenancy Isolation | No | Yes | No | Yes (JWT + `org_id`) |
| ML Demand Forecasting | No | Add-on / Complex | No | Yes (Ridge Regression) |
| Automated Safety Stock / ROP | Manual | Yes | Basic / Static | Dynamic & Automated |
| Mobile Responsiveness | Poor | Partial | Limited | Full (320px–2560px) |

</div>

&nbsp;

<div align="center">

**Table 2.2: Comparison of Demand Forecasting Techniques**

| Technique | Data Needed | Interpretability | Seasonality Support | Small-Data Accuracy | Compute Cost |
|---|---|---|---|---|---|
| Simple Moving Average | Very Low | High | No | Low | Very Low |
| ARIMA / SARIMA | Moderate | Moderate | Yes | Moderate | Low–Moderate |
| LSTM Neural Network | Very High | Low (Black-box) | Yes | Poor (overfits) | High (GPU) |
| XGBoost / LightGBM | High | Low–Moderate | Yes | Moderate | Moderate |
| **Ridge Regression + Lags** | **Low (≥10 days)** | **High** | **Yes (Sin/Cos)** | **High** | **Very Low (ms)** |

</div>

## 2.3 Feasibility Study

### 2.3.1 Technical Feasibility
All selected technologies — React 19, TypeScript, Vite, Tailwind CSS, FastAPI, Scikit-Learn, Pandas, and MongoDB Atlas — are mature, well-documented, and production-proven. Ridge Regression solves a convex closed-form optimization problem in milliseconds per SKU, eliminating the need for expensive GPU infrastructure.

### 2.3.2 Economic Feasibility
The prototype is built entirely on open-source software and deployed using free-tier cloud services (Vercel Hobby for frontend, Render Free Web Service for backend, and MongoDB Atlas M0 Shared Cluster), resulting in **zero infrastructure cost (₹0)** during academic development and demonstration.

### 2.3.3 Operational Feasibility
The web application requires no client-side installation, works across desktop and mobile browsers, localizes currency in Indian Lakhs/Crores, and includes one-click demo data seeding (`/api/system/seed`) so non-technical business operators can evaluate the platform immediately.

---

&nbsp;

# CHAPTER 3: SYSTEM DESIGN

## 3.1 System Architecture

StockMind AI is architected as a **three-tier client-server SaaS application**:

1. **Presentation Tier (Frontend)**: A React 19 + TypeScript Single Page Application (SPA) bundled with Vite and styled with Tailwind CSS, hosted on Vercel's Edge Network. It communicates with the backend exclusively via JSON over HTTPS REST endpoints.
2. **Application Tier (Backend & ML Engine)**: A Python 3.11+ FastAPI asynchronous REST API served by Uvicorn ASGI on Render. It handles JWT authentication, multi-tenant query scoping, atomic inventory transactions, KPI aggregations, and on-demand Scikit-Learn Ridge Regression forecasting.
3. **Data Tier (Database)**: MongoDB Atlas cloud database (`stockmind_db`) accessed via the asynchronous `Motor` driver, paired with an automatic in-memory fallback (`InMemoryDatabase`) for offline local development and automated testing.

<div align="center">

**[INSERT FIGURE 3.1: THREE-TIER SYSTEM ARCHITECTURE DIAGRAM HERE]**

*Figure 3.1: Three-Tier System Architecture of StockMind AI*

</div>

## 3.2 UML Diagrams

### 3.2.1 Use Case Diagram

<div align="center">

**[INSERT FIGURE 3.2: USE CASE DIAGRAM HERE]**

*Figure 3.2: Use Case Diagram — Business User & System Interactions*

</div>

Primary actor **Business User (Merchant/Admin)** interacts with use cases: *Register / Login*, *Manage Product Catalog (CRUD & Restock)*, *Record Atomic Sale*, *View Executive Dashboard*, *Run ML Demand Forecast*, *Inspect Replenishment Recommendations*, and *Seed/Reset System Data*.

### 3.2.2 Activity Diagram

<div align="center">

**[INSERT FIGURE 3.3: ACTIVITY DIAGRAM HERE]**

*Figure 3.3: Activity Diagram — Atomic Sales & Replenishment Workflow*

</div>

### 3.2.3 Sequence Diagram

<div align="center">

**[INSERT FIGURE 3.4: SEQUENCE DIAGRAM HERE]**

*Figure 3.4: Sequence Diagram — Authenticated Demand Forecasting Request*

</div>

## 3.3 Data Flow Diagram (DFD)

<div align="center">

**[INSERT FIGURE 3.5: DFD LEVEL 0 (CONTEXT DIAGRAM) HERE]**

*Figure 3.5: Data Flow Diagram (DFD Level 0 — Context Diagram)*

</div>

&nbsp;

<div align="center">

**[INSERT FIGURE 3.6: DFD LEVEL 1 HERE]**

*Figure 3.6: Data Flow Diagram (DFD Level 1 — Core Processes)*

</div>

## 3.4 ER Diagram

<div align="center">

**[INSERT FIGURE 3.7: ENTITY-RELATIONSHIP DIAGRAM HERE]**

*Figure 3.7: Entity-Relationship (ER) Diagram — MongoDB Collections*

</div>

## 3.5 Database Design

StockMind AI uses MongoDB database `stockmind_db` with four primary document collections scoped by `organization_id` for strict multi-tenancy.

<div align="center">

**Table 3.1: MongoDB Collections and Schema Overview**

| Collection | Purpose | Key Fields |
|---|---|---|
| `users` | User accounts and organization mapping | `_id`, `email` (unique), `password_hash`, `org_name`, `organization_id`, `created_at` |
| `products` | Organization-scoped SKU catalog | `_id`, `organization_id`, `name`, `sku`, `category`, `price`, `current_stock`, `lead_time_days`, `created_at` |
| `sales` | Atomic sales transaction ledger | `_id`, `organization_id`, `product_id`, `product_name`, `quantity`, `unit_price`, `total_value`, `channel`, `timestamp` |
| `system_settings` | Catalog mode & seed state flags | `key`, `mode`, `updated_at` |

</div>

&nbsp;

<div align="center">

**Table 3.2: RESTful API Endpoints Overview**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | Health check & database status |
| `POST` | `/api/auth/register` | No | Register user & create organization |
| `POST` | `/api/auth/login` | No | Authenticate user & issue JWT |
| `GET/POST` | `/api/products` | Yes | List or create products (auto-SKU) |
| `PUT/DELETE` | `/api/products/{id}` | Yes | Update or delete product |
| `POST` | `/api/products/{id}/restock` | Yes | Increment on-hand stock |
| `GET/POST` | `/api/sales` | Yes | List sales or record atomic sale |
| `GET` | `/api/dashboard/stats` | Yes | KPI aggregations (stock value, revenue, risks) |
| `GET` | `/api/dashboard/charts` | Yes | 30-day sales velocity & category distribution |
| `GET` | `/api/forecast/{product_id}` | Yes | ML demand forecast & metrics |
| `GET` | `/api/recommendations` | Yes | Replenishment urgency, SS, ROP & capital needed |
| `GET` | `/api/analytics` | Yes | Category capital & channel breakdown |
| `POST/DELETE` | `/api/system/seed`, `/clear` | Yes | Seed or clear demo dataset |

</div>

---

&nbsp;

# CHAPTER 4: IMPLEMENTATION

## 4.1 Tools & Technologies Used

StockMind AI combines modern Python backend engineering with a typed React frontend:
- **Backend**: FastAPI, Uvicorn (ASGI), Pydantic v2, Motor (async MongoDB), PyJWT, Passlib (`bcrypt`), Scikit-Learn, NumPy, Pandas, SciPy.
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide-React, React Router.
- **DevOps & Cloud**: Git/GitHub, Vercel (Frontend), Render (Backend), MongoDB Atlas (Database), Pytest + HTTPX (Automated Testing).

## 4.2 System Requirements

### 4.2.1 Hardware Requirements

<div align="center">

**Table 4.1: Hardware Requirements**

| Environment | Minimum Specification | Recommended Specification |
|---|---|---|
| Developer Workstation | Intel Core i5 / Ryzen 5, 8 GB RAM, 50 GB SSD | Intel Core i7 / Ryzen 7, 16 GB RAM, 100 GB SSD |
| Cloud Backend (Render) | 512 MB RAM, 0.1 vCPU (Free Tier) | 2 GB RAM, 1 vCPU (Standard) |
| Cloud Database (Atlas) | M0 Free Cluster (512 MB Storage) | M10 Dedicated Cluster |

</div>

### 4.2.2 Software Requirements

<div align="center">

**Table 4.2: Software and Technology Stack**

| Layer | Software / Library | Version | Role |
|---|---|---|---|
| Frontend | Node.js / React / TypeScript / Vite | Node 18+, React 19, TS 5 | Responsive SPA & charts |
| Backend | Python / FastAPI / Uvicorn | Python 3.11+, FastAPI 0.111+ | Async REST API |
| ML Engine | Scikit-Learn / Pandas / NumPy | Sklearn 1.4+, Pandas 2.x | Ridge forecasting & metrics |
| Database | MongoDB Atlas / Motor | MongoDB 7.0 / Motor 3.x | Persistent NoSQL storage |
| Testing | Pytest / pytest-asyncio / HTTPX | Pytest 8.x | Automated API verification |

</div>

## 4.3 Modules Description

1. **Authentication & Multi-Tenancy Module (`routes/auth.py`, `utils/security.py`)**: Handles user registration, bcrypt password hashing, and HS256 JWT issuance containing `sub` (user ID) and `org_id` (organization UUID). Every protected route depends on `get_current_user` to scope all database queries to `organization_id`.
2. **Inventory Catalog Module (`routes/products.py`)**: Supports creating, searching, filtering, updating, deleting, and restocking SKUs. Automatically generates unique SKU identifiers using the category prefix and a random 8-character hex suffix.
3. **Atomic Sales Module (`routes/sales.py`)**: Records retail, wholesale, and online sales while atomically decrementing `current_stock` only if `current_stock >= quantity`, strictly preventing negative inventory.
4. **Executive Dashboard & Analytics Module (`routes/dashboard.py`)**: Computes total inventory valuation, 30-day gross revenue, active stockout count, pending reorders, daily sales velocity time series, and channel/category breakdowns.
5. **AI Forecasting Module (`ml/forecaster.py`, `routes/forecast.py`)**: Trains a Ridge Regression forecaster per SKU on demand and outputs 14–30 day predictions, 95% confidence bounds, and MAE/RMSE/MAPE metrics.
6. **Replenishment Optimization Module (`routes/recommendations.py`)**: Calculates Safety Stock, Reorder Point, urgency tier, and required restock capital across the organization's catalog.
7. **Frontend UI Pages (`frontend/src/pages/`)**: Includes `LandingPage`, `LoginPage`, `RegisterPage`, `DashboardPage`, `InventoryPage`, `SalesPage`, `ForecastingPage`, `RecommendationsPage`, `AnalyticsPage`, and `SettingsPage`, with Indian currency formatting (`₹`, `K`, `L`, `Cr`).

## 4.4 Algorithms / Logic Used

### 4.4.1 Autoregressive Ridge Regression Demand Forecasting

For a product's daily sales series $\{y_t\}_{t=1}^{N}$, missing calendar dates between `min_date` and `max_date` are zero-filled to form a continuous daily timeline.

- **Sparse History Fallback ($N < 10$ days)**: Returns a 7-day moving average baseline with symmetric confidence bounds $\bar{y} \pm 1.96 \cdot \hat{\sigma}_y$ (or zero baseline if $N = 0$).
- **ML Mode ($N \ge 10$ days)**: Extracts six features listed in Table 4.3 and trains `sklearn.linear_model.Ridge(alpha=1.0)`:

<div align="center">

**Table 4.3: Ridge Regression Engineered Features**

| Feature | Formula | Purpose |
|---|---|---|
| `lag_1` | $y_{t-1}$ | Short-term daily demand momentum |
| `lag_7` | $y_{t-7}$ | Weekly seasonal demand echo |
| `rolling_7` | $\frac{1}{7}\sum_{k=t-7}^{t-1} y_k$ | Smoothed 7-day demand baseline |
| `trend_t` | $t$ | Linear growth or decline trend |
| `sin_dow` | $\sin(2\pi \cdot \text{dayofweek} / 7)$ | Cyclical weekly phase |
| `cos_dow` | $\cos(2\pi \cdot \text{dayofweek} / 7)$ | Cyclical weekly amplitude |

</div>

Multi-step forecasts for $h = 1 \dots H$ days are generated autoregressively by appending each non-negative prediction $\hat{y}_{N+h}$ back into the history buffer. Prediction intervals widen with horizon $h$ using residual standard deviation $\hat{\sigma}_\varepsilon$:

$$\text{Bounds}_h = \max\left(0,\ \hat{y}_{N+h} \pm 1.96 \cdot \sqrt{1 + 0.05h} \cdot \hat{\sigma}_\varepsilon\right)$$

<div align="center">

**[INSERT FIGURE 4.1: AUTOREGRESSIVE FORECASTING PIPELINE DIAGRAM HERE]**

*Figure 4.1: Autoregressive Ridge Regression Forecasting Pipeline*

</div>

### 4.4.2 Safety Stock, Reorder Point & Urgency Classification

Using trailing 30-day mean daily demand $\mu_d$, standard deviation $\sigma_d$, and supplier lead time $L$ (days) at a 95% service level ($Z = 1.65$):

$$SS = Z \times \sigma_d \times \sqrt{L}$$
$$ROP = (\mu_d \times L) + SS$$

<div align="center">

**Table 4.4: Replenishment Urgency Classification Rules**

| Urgency Tier | Condition | Recommended Action |
|---|---|---|
| **Critical** | $\text{Current Stock} = 0$ | Immediate emergency restock |
| **High** | $0 < \text{Current Stock} \le ROP$ | Reorder immediately |
| **Medium** | $ROP < \text{Current Stock} \le 2 \times ROP$ | Schedule upcoming procurement |
| **Healthy** | $\text{Current Stock} > 2 \times ROP$ | Sufficient buffer; no action |

</div>

---

&nbsp;

# CHAPTER 5: TESTING & RESULTS

## 5.1 Test Plan

Verification of StockMind AI was conducted across three levels:
1. **Automated Backend Unit & Integration Testing**: Executed using `pytest`, `pytest-asyncio`, and `httpx.AsyncClient` (`ASGITransport`) against the FastAPI application (`backend/tests/test_api.py`).
2. **Frontend Build & Type Verification**: Verified via TypeScript compilation and Vite production bundling (`npm run build`).
3. **Responsive UI & Manual End-to-End Testing**: Verified across desktop (1920×1080), tablet (768×1024), and mobile (360×800 / 390×844) viewports, including checks for empty login inputs (no prefilled demo credentials) and non-overflowing KPI cards on mobile screens.

## 5.2 Test Cases

<div align="center">

**Table 5.1: Automated Backend Test Cases (Pytest)**

| Test ID | Test Function | Scenario Verified | Expected Outcome | Status |
|---|---|---|---|---|
| TC-01 | `test_health` | System health & DB status check | HTTP 200, healthy status JSON | PASS |
| TC-02 | `test_products_crud` | Create, read, update, delete SKU | Correct HTTP codes & persisted fields | PASS |
| TC-03 | `test_sales_and_stock_deduction` | Record valid sale of 3 units | Stock decrements atomically | PASS |
| TC-04 | `test_negative_stock_prevention` | Sell quantity > current stock | HTTP 400 error; stock unchanged | PASS |
| TC-05 | `test_forecasting_and_recommendations` | ML forecast & ROP computation | Valid forecast array, MAE/RMSE/MAPE | PASS |
| TC-06 | `test_dashboard_stats_and_charts` | KPI & 30-day chart aggregations | Accurate totals & chart series | PASS |
| TC-07 | `test_auth_tenant_isolation` | User B queries User A's products | User B receives isolated empty list | PASS |

</div>

&nbsp;

<div align="center">

**Table 5.2: Responsive UI & Cross-Device Test Cases**

| UI ID | Viewport / Device | Test Scenario | Status |
|---|---|---|---|
| UI-01 | Mobile (390×844) | KPI numbers stay inside card bounds without overflow | PASS |
| UI-02 | Desktop & Mobile | Login page loads with empty fields (no prefilled credentials) | PASS |
| UI-03 | Tablet (768×1024) | Grid layout adapts cleanly to 2 columns | PASS |
| UI-04 | Desktop (1920×1080) | Recharts forecasting & dashboard charts render smoothly | PASS |

</div>

## 5.3 Output Screenshots

<div align="center">

**[INSERT FIGURE 5.1: LANDING PAGE SCREENSHOT HERE]**

*Figure 5.1: Landing Page and Interactive Replenishment Workbench*

</div>

&nbsp;

<div align="center">

**[INSERT FIGURE 5.2: EXECUTIVE DASHBOARD SCREENSHOT HERE]**

*Figure 5.2: Executive Command Dashboard — KPI Cards & Revenue Chart*

</div>

&nbsp;

<div align="center">

**[INSERT FIGURE 5.3: AI FORECASTING PAGE SCREENSHOT HERE]**

*Figure 5.3: AI Demand Forecasting Trajectory & Confidence Intervals*

</div>

&nbsp;

<div align="center">

**[INSERT FIGURE 5.4: REPLENISHMENT RECOMMENDATIONS SCREENSHOT HERE]**

*Figure 5.4: Replenishment Optimization & Urgency Tier View*

</div>

## 5.4 Performance Analysis

All 7 automated backend test cases passed in **3.86 seconds** (`7 passed in 3.86s` via `python -m pytest backend/tests`).

<div align="center">

**Table 5.3: Machine Learning Evaluation Metrics**

| Metric | Formula | Observed Range (30–90 Day SKUs) |
|---|---|---|
| MAE | $\frac{1}{N}\sum \|y_t - \hat{y}_t\|$ | 1.2 – 4.8 units/day |
| RMSE | $\sqrt{\frac{1}{N}\sum (y_t - \hat{y}_t)^2}$ | 1.8 – 7.2 units/day |
| MAPE | $\frac{100\%}{|\mathcal{T}|}\sum \left\|\frac{y_t - \hat{y}_t}{y_t}\right\|$ | 8% – 22% |

</div>

&nbsp;

<div align="center">

**Table 5.4: Observed API Response Latency**

| Endpoint | Average Latency |
|---|---|
| `GET /health` | ~45 ms |
| `GET /api/products` | ~120 ms |
| `POST /api/sales` | ~180 ms |
| `GET /api/forecast/{id}` | ~280 ms |
| `GET /api/recommendations` | ~400 ms |

</div>

*Note: The live production deployment is accessible at `https://foundedai.vercel.app` (Frontend) and `https://founded-ai.onrender.com` (Backend).*

---

&nbsp;

# CHAPTER 6: CONCLUSION & FUTURE WORK

## 6.1 Summary of Project

StockMind AI successfully delivers an end-to-end, multi-tenant inventory management, demand forecasting, and replenishment optimization SaaS platform tailored for SMBs. By uniting a responsive React + TypeScript frontend, an asynchronous FastAPI backend, MongoDB Atlas cloud persistence, and an interpretable Ridge Regression forecasting engine, the system replaces error-prone manual spreadsheets with automated, data-driven procurement intelligence.

## 6.2 Achievements

- Implemented strict multi-tenant data isolation using JWT authentication and `organization_id` scoping.
- Built atomic sales recording with database-level negative-stock prevention.
- Deployed an autoregressive Ridge Regression forecaster with cyclical day-of-week features, widening 95% confidence intervals, and sparse-data fallback.
- Automated Safety Stock and Reorder Point calculations with four-tier urgency classification.
- Achieved 100% pass rate (7/7 tests) in automated `pytest` verification and deployed the full stack live on Vercel, Render, and MongoDB Atlas.

## 6.3 Limitations

1. **Free-Tier Cold Start**: The Render free-tier backend spins down after inactivity, causing a 30–50 second delay on the first request.
2. **Permissive CORS Policy**: `allow_origins=["*"]` is currently enabled for development/preview convenience and should be locked down to the production frontend domain.
3. **In-Sample Metric Evaluation**: Forecast MAE/RMSE/MAPE metrics are evaluated in-sample; walk-forward cross-validation is needed for unbiased out-of-sample scoring on longer histories.
4. **Manual Input & Single Location**: Barcode scanning and multi-warehouse location tracking are not yet supported.

## 6.4 Future Scope

1. **Deep Learning & External Regressors**: Integrate LSTM or Temporal Fusion Transformer models alongside Indian holiday calendars and promotional flags once organizations accumulate 1+ year of sales history.
2. **Supplier EDI & Automated Purchase Orders**: Automatically generate and email/transmit purchase orders to suppliers when SKUs cross the Reorder Point.
3. **Mobile App with Barcode Scanning**: Build a React Native companion app with camera-based barcode/QR scanning for rapid shop-floor stocktake and billing.
4. **Multi-Warehouse & Tally/Zoho Integration**: Support multi-location inventory transfers and bidirectional accounting sync with Tally ERP and Zoho Books.

---

&nbsp;

# BIBLIOGRAPHY / REFERENCES

[1] K. Bandara, C. Bergmeir, and H. Hewamalage, "LSTM-MSNet: Leveraging Forecasts on Sets of Related Time Series with Multiple Seasonal Patterns," *IEEE Transactions on Neural Networks and Learning Systems*, vol. 32, no. 4, pp. 1586–1599, 2020.

[2] G. E. P. Box and G. M. Jenkins, *Time Series Analysis: Forecasting and Control*. San Francisco: Holden-Day, 1976.

[3] R. Carbonneau, K. Laframboise, and R. Vahidov, "Application of Machine Learning Techniques for Supply Chain Demand Forecasting," *European Journal of Operational Research*, vol. 184, no. 3, pp. 1140–1154, 2008.

[4] T. Chen and C. Guestrin, "XGBoost: A Scalable Tree Boosting System," in *Proc. 22nd ACM SIGKDD Int. Conf. Knowledge Discovery and Data Mining*, 2016, pp. 785–794.

[5] S. Chopra and P. Meindl, *Supply Chain Management: Strategy, Planning, and Operation*, 6th ed. Pearson Education, 2016.

[6] FastAPI Documentation, "FastAPI Framework," 2024. [Online]. Available: https://fastapi.tiangolo.com.

[7] S. Hochreiter and J. Schmidhuber, "Long Short-Term Memory," *Neural Computation*, vol. 9, no. 8, pp. 1735–1780, 1997.

[8] A. E. Hoerl and R. W. Kennard, "Ridge Regression: Biased Estimation for Nonorthogonal Problems," *Technometrics*, vol. 12, no. 1, pp. 55–67, 1970.

[9] C. C. Holt, "Forecasting Seasonals and Trends by Exponentially Weighted Moving Averages," *International Journal of Forecasting*, vol. 20, no. 1, pp. 5–10, 2004 (reprinted from 1957).

[10] S. Makridakis, E. Spiliotis, and V. Assimakopoulos, "The M4 Competition: 100,000 Time Series and 61 Forecasting Methods," *International Journal of Forecasting*, vol. 36, no. 1, pp. 54–74, 2020.

[11] MongoDB Inc., "MongoDB Atlas Documentation," 2024. [Online]. Available: https://www.mongodb.com/docs/atlas.

[12] F. Pedregosa et al., "Scikit-learn: Machine Learning in Python," *Journal of Machine Learning Research*, vol. 12, pp. 2825–2830, 2011.

[13] React Documentation, "React — The Library for Web and Native User Interfaces," Meta Open Source, 2024. [Online]. Available: https://react.dev.

[14] E. A. Silver, D. F. Pyke, and R. Peterson, *Inventory Management and Production Planning and Scheduling*, 3rd ed. New York: John Wiley & Sons, 1998.

[15] P. R. Winters, "Forecasting Sales by Exponentially Weighted Moving Averages," *Management Science*, vol. 6, no. 3, pp. 324–342, 1960.

---

&nbsp;

# APPENDICES

## Appendix A: User Manual

1. **Accessing the Platform**: Open `https://foundedai.vercel.app` in any modern desktop or mobile browser.
2. **Registration & Login**: Click **Get Started / Login**, register a new organization account (or log in with existing credentials).
3. **Seeding Demo Data (Optional)**: Navigate to **Settings** and click **Seed Demo Data** to populate sample electronics/retail SKUs and 60 days of sales history.
4. **Managing Inventory**: Open **Inventory** to add new products (SKUs are auto-generated), edit prices/lead times, or perform instant restocks.
5. **Recording Sales**: Open **Sales**, select a product, enter quantity and channel (`Retail`, `Wholesale`, or `Online`), and submit. Stock deducts atomically.
6. **Viewing AI Forecasts & Recommendations**: Open **Forecasting** to inspect 14–30 day demand trajectories and **Recommendations** to prioritize Critical/High urgency reorders.

## Appendix B: Screenshots

*(All high-resolution application screenshots — Landing Page, Dashboard, Inventory Catalog, Sales Ledger, AI Forecasting, Replenishment Recommendations, and Mobile Responsive views — are placed in Section 5.3 and may be appended here in full-page format if required by the department.)*

## Appendix C: Code (Optional)

Key source modules in the GitHub repository (`https://github.com/harshal0674/Founded_Ai`):
- `backend/app/main.py` — FastAPI application lifespan, CORS, and router registration.
- `backend/app/ml/forecaster.py` — `DemandForecaster` Ridge Regression & baseline pipeline.
- `backend/app/routes/recommendations.py` — Safety Stock ($SS$) and Reorder Point ($ROP$) engine.
- `backend/tests/test_api.py` — Automated `pytest` verification suite.
- `frontend/src/App.tsx` — React Router and AuthContext shell.
