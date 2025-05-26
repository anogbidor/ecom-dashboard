# 🛍️ E-commerce Dashboard

A modern, interactive analytics dashboard for e-commerce businesses. Built with **React**, **Node.js**, **MySQL**, and **Python**, it visualizes real-time data including sales, inventory, and customer metrics — enhanced with forecasting and dynamic charting.

---

## 🚀 Tech Stack

| Layer       | Tech Used                                 |
|-------------|--------------------------------------------|
| Frontend    | React, TypeScript, Vite, Tailwind CSS      |
| Charts      | Chart.js, D3.js                            |
| Backend     | Node.js, Express.js, MySQL, bcrypt         |
| Forecasting | Python, Flask, scikit-learn, Pandas        |
| Styling     | Tailwind CSS                               |
| Linting     | ESLint, Prettier                           |
| Auth        | JSON Web Tokens (JWT)                      |

---

## 📁 Project Structure

```bash
e-commerce-dashboard/
├── client/                             # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/                 # Navbar, Sidebar, etc.
│   │   │   ├── cards/                  # Stat/KPI Cards
│   │   │   ├── charts/                 # Chart.js visualizations
│   │   │   ├── forms/                  # AddProductForm, AddSaleForm
│   │   │   └── tables/                 # InventoryTable, SalesTable, etc.
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Sales.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Inventory.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── AddProduct.tsx
│   │   │   ├── AddSale.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── ForgotPassword.tsx      # 🔐 Request reset token
│   │   │   └── ResetPassword.tsx       # 🔐 Enter new password
│   │   ├── routes/
│   │   │   └── PrivateRoute.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── tailwind.config.js
│
├── server/                             # Node.js backend API
│   ├── db/
│   │   └── connection.js               # MySQL DB connection
│   ├── controllers/                    # Controller logic
│   │   ├── salesController.js
│   │   ├── inventoryController.js
│   │   ├── customersController.js
│   │   ├── kpiController.js
│   │   ├── productsController.js
│   │   └── authController.js           # 🔐 Login + Reset logic
│   ├── routes/                         # Express routes
│   │   ├── sales.js
│   │   ├── inventory.js
│   │   ├── customers.js
│   │   ├── kpis.js
│   │   ├── products.js
│   │   └── auth.js                     # 🔐 Auth routes (login/reset)
│   ├── utils/
│   │   └── hashPassword.js             # 🔒 Admin password hasher
│   └── server.js                       # Express app entry
│
├── forecast_sales.py                   # Python Flask API for sales forecasting
├── .env                                # Backend environment variables
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
* Dynamic dropdown of inventory products for sale
* Real-time form validation and feedback using react-hot-toast


✅ Phase 7: Password Reset 
*Forgot password flow with secure token generation
*Reset password page with confirmation
*Admin table with hashed passwords
*Reset token table with expiration handling


✅ Phase 8: Password Reset (NEW)
*🧾 Admin account settings (change username/password)
*✉️ in app  notification alerts for new sales and username  and password updates
---

## 🧠 Coming Soon

*📈 Export dashboard to CSV/PDF
*🤖 Advanced ML forecasting & anomaly detection
*🔄 Live sync with external APIs (Shopify, WooCommerce)

---

## 🧠 Business Logic

This E-commerce Dashboard is more than a basic CRUD system — it simulates real-world operational workflows found in inventory and sales management systems. Here's how:

- 🔔 **Smart Notifications**  
  Admins receive real-time notifications for key events like product sales, username changes, and password updates.

- 📉 **Low Stock Alerts**  
  The system flags products with inventory below a defined threshold (e.g., 25 units), enabling proactive restocking.

- 💰 **Revenue Tracking**  
  Sales records are stored and summarized, including date filtering and real-time total revenue calculation.

- 📦 **Inventory Management with Filters**  
  Products can be searched, filtered by stock range, and sorted by quantity, price, or date added — allowing efficient inventory decisions.

- 🔐 **Secure Admin Controls**  
  Includes JWT-based login, username/password update flows, and secure password reset via token validation.

- 🧮 **Forecasting with AI**  
  A connected Python backend provides future sales predictions, overlaid on existing data for visual comparison.

- 📊 **Print-Ready Reports**  
  Sales and inventory tables are printable via optimized layouts, allowing for easy export and reporting.

- 🌐 **Mobile-Responsive UI**  
  Fully responsive design ensures optimal use across desktop, tablet, and mobile screens.

This logic was designed to reflect the actual needs of small-to-medium-sized e-commerce operations.

---

