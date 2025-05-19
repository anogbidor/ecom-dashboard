# 🛍️ E-commerce Dashboard – Frontend

A modern, interactive e-commerce analytics dashboard built with **React**, **TypeScript**, **Vite**, and **TailwindCSS**. This frontend connects to backend APIs and visualizes real-time sales, inventory, and customer data using interactive charts.

---

## 🚀 Tech Stack

- **React + TypeScript** – Component-based UI
- **Vite** – Lightning-fast build tool
- **Tailwind CSS** – Utility-first CSS framework
- **Chart.js & D3.js** – Data visualization (coming soon)
- **ESLint & Prettier** – Linting and formatting

---

## 📁 Project Structure

client/ 
├── public/                         # Static files and icons
├── src/
│   ├── assets/                     # Images, logos, and other media
│   ├── components/
│   │   ├── layout/                 # Layout components
│   │   │   ├── Sidebar.tsx        # Sidebar navigation
│   │   │   ├── Navbar.tsx         # Top navigation bar
│   │   │   └── DashboardLayout.tsx# Main layout wrapper
│   │   └── cards/
│   │       └── StatCard.tsx       # Reusable stat display card
│   ├── pages/
│   │   └── Dashboard.tsx          # Main dashboard page
│   ├── App.tsx                    # Entry point for components
│   └── main.tsx                   # Vite/React entry
├── .gitignore
├── index.html                     # App entry HTML
├── package.json                   # Project metadata and scripts
├── postcss.config.js              # Tailwind PostCSS config
├── tailwind.config.js             # Tailwind custom configuration
└── tsconfig.json                  # TypeScript configuration
---

## 💻 Getting Started

### 1. Install dependencies

```bash
cd client
npm install
npm run dev

Then open http://localhost:5173 to view your dashboard in the browser.

✨ Features (Phase 1)
•✅ Fully responsive dashboard layout
•✅ Sidebar + Top navbar UI
•✅ Stat cards with sample data
•⏳ Dynamic charts with Chart.js & D3.js (coming soon)
