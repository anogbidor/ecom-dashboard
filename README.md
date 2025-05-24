# 🛍️ E-commerce Dashboard

A modern, interactive analytics dashboard for e-commerce businesses. Built with **React**, **Node.js**, **MySQL**, and **Python**, it visualizes real-time data including sales, inventory, and customer metrics — enhanced with forecasting and dynamic charting.

---

## 🚀 Tech Stack

| Layer       | Tech Used                                 |
|-------------|--------------------------------------------|
| Frontend    | React, TypeScript, Vite, Tailwind CSS      |
| Charts      | Chart.js, D3.js                            |
| Backend     | Node.js, Express.js, MySQL                 |
| Forecasting | Python, Flask, scikit-learn, Pandas        |
| Styling     | Tailwind CSS                               |
| Linting     | ESLint, Prettier                           |
| Auth        | JSON Web Tokens (JWT)                      |

---

## 📁 Project Structure

```bash
e-commerce-dashboard/
├── client/                   # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── cards/
│   │   │   ├── charts/
│   │   │   ├── forms/
│   │   │   └── tables/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Sales.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Inventory.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── AddProduct.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── tailwind.config.js
│
├── server/                   # Node.js backend API
│   ├── db/                   # MySQL connection
│   ├── controllers/          # Route logic
│   ├── routes/               # Express routes
│   │   ├── sales.js
│   │   ├── inventory.js
│   │   ├── customers.js
│   │   ├── kpis.js
│   │   └── products.js
│   └── server.js
│
├── forecast_sales.py         # Flask API for sales forecasting
├── .env                      # Environment config (MySQL)
└── README.md
```

## 💻 Getting Started

### ✅ 1. Clone the repo

```bash
git clone https://github.com/your-username/ecommerce-dashboard.git
cd ecommerce-dashboard

✅ 2. Setup the Backend (Node.js + MySQL)
cd server
npm install
npm run dev

* Add your DB credentials in .env:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ecom_dashboard

✅ 3. Setup the Forecast API (Python + Flask)
Ensure .env exists in root with the same DB info.

✅ 4. Setup the Frontend (React + Vite)
cd client
npm install
npm run dev
Then visit http://localhost:5173

✨ Features

✅ Phase 1: UI & Layout
*Responsive layout with sidebar and navbar
*Stat cards for key metrics
*Clean dashboard with TailwindCSS

✅ Phase 2: Inventory & Customer Tables
*Customer list with join date, email, location
*Inventory tracking with filtering, sorting, and quantity alerts

✅ Phase 3: Sales Module
*Sales table with date filtering, search, sorting
*Total revenue calculation
*Print-friendly view

✅ Phase 4: Forecasting & Analytics
*Python-powered 7-day sales forecast
*Combined sales trend + forecast chart
*Top products chart (by revenue & quantity)
*Low stock alert table
*KPI metrics powered by live data

✅ Phase 5: Authentication
*JWT-based login system with protected routes
*Conditional routing and token storage
*Logout modal with confirmation + keyboard escape support

✅ Phase 6: Add Product & Sale Forms
* Add product form with SKU, stock, and validation
* Add sale form with auto-calculated total based on product price and quantity
* Inventory updates automatically when sale is recorded
* Toast notifications, animations, and error handling for better UX

---

## 🧠 Coming Soon

*📈 Export dashboard to CSV/PDF
*🤖 Advanced ML forecasting & anomaly detection
*🔄 Live sync with external APIs (Shopify, WooCommerce)
