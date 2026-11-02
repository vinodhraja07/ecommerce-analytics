# NexusSales — E-Commerce Sales Analytics Platform

A polished, production-style full-stack E-Commerce Sales Analytics Platform built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Recharts on the frontend, and FastAPI, SQLAlchemy, SQLite, and Pandas on the backend.

> **No external API key is required.** The application works completely locally.

---

## Features

- **Authentication** — Local login with password hashing, protected routes, demo account
- **Dashboard** — KPI cards, revenue trend, category performance, top products, recent orders, smart insights, inventory alerts
- **Sales Management** — CRUD with search, filters, sorting, modals, and validation
- **Product Management** — CRUD with stock status filtering and inventory alerts
- **Customer Management** — List, search, purchase history, spending analysis
- **Analytics** — Revenue, orders, categories, products, regions, and customer spending with date-range filtering
- **Reports** — Sales, product, and customer reports with CSV export
- **CSV Import** — Upload sales CSV via Pandas with column validation and error reporting
- **Smart Business Insights** — Rule-based analytics from actual database data
- **Inventory Alerts** — Out of Stock / Low Stock / Healthy counts
- **Dark/Light Mode** — Persistent theme toggle
- **Responsive Design** — Desktop, tablet, and mobile layouts
- **Framer Motion** — Subtle page transitions, sidebar, modals, and hover/tap interactions
- **Toast Notifications** — Success, error, and info toasts
- **Loading & Error States** — Skeletons, empty states, and error handling

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, Recharts, React Router |
| Backend | FastAPI, Uvicorn, SQLAlchemy, Pydantic, Pandas |
| Database | SQLite |
| Data Processing | Pandas |

---

## Folder Structure

```
ecommerce-analytics/
├── frontend/                  # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # Sidebar, Header, Toast, ConfirmDialog, LoadingSkeleton, EmptyState
│   │   ├── layouts/           # AppLayout
│   │   ├── pages/             # Login, Dashboard, Sales, Products, Customers, Analytics, Reports, Settings
│   │   ├── services/          # Axios API client
│   │   ├── hooks/             # useAuth, useTheme
│   │   ├── types/             # API and auth types
│   │   └── utils/             # cn (clsx + tailwind-merge)
│   └── package.json
├── backend/                   # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── main.py            # FastAPI app + route registration
│   │   ├── database.py        # Engine, session, Base
│   │   ├── models.py          # User, Customer, Product, Sale, Setting
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── auth.py            # Password hashing, JWT tokens
│   │   ├── crud.py            # CRUD operations
│   │   ├── seed.py            # Demo data seeding
│   │   ├── routes/            # auth, dashboard, sales, products, customers, analytics, reports, import, settings
│   │   └── services/          # analytics_service, insight_service
│   ├── .env.example
│   └── requirements.txt
└── README.md
```

---

## Requirements

- Python 3.10+
- Node.js 18+
- npm or yarn

---

## Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Seed the database (creates demo user + 55 customers + 43 products + 300 sales)
python -m app.seed

# Start the server
uvicorn app.main:app --reload --port 8000
```

The backend runs at `http://127.0.0.1:8000`.

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend runs at `http://localhost:3000` and proxies `/api` to the backend.

---

## Database Setup

The seed script automatically:
1. Creates all tables
2. Creates a demo admin user
3. Creates 55 customers
4. Creates 43 products
5. Creates 300 sales records

---

## Demo Credentials

- **Email:** `admin@demo.com`
- **Password:** `admin123`

---

## CSV Import Format

Expected columns:
```
order_id,date,customer,product,category,quantity,price,region
```

Example:
```
ORD-00001,2026-04-15,John Doe,iPhone 15 Pro,Electronics,1,134900,Mumbai
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| GET | `/api/dashboard/kpis` | KPI data |
| GET | `/api/dashboard/revenue` | Revenue trend |
| GET | `/api/dashboard/categories` | Category performance |
| GET | `/api/dashboard/top-products` | Top products |
| GET | `/api/dashboard/recent-orders` | Recent orders |
| GET | `/api/dashboard/insights` | Smart insights |
| GET | `/api/dashboard/inventory-alerts` | Inventory alerts |
| GET/POST | `/api/sales` | List / create sales |
| GET/PUT/DELETE | `/api/sales/{id}` | Get / update / delete sale |
| GET/POST | `/api/products` | List / create products |
| GET/PUT/DELETE | `/api/products/{id}` | Get / update / delete product |
| GET | `/api/customers` | List customers |
| GET | `/api/customers/{id}/orders` | Customer orders |
| GET | `/api/analytics/*` | Analytics charts |
| POST | `/api/import/sales` | CSV import |
| GET | `/api/reports/*` | Reports + CSV export |
| GET/PUT | `/api/settings` | Settings |

---

## Troubleshooting

- **Backend won't start:** Make sure all dependencies are installed with `pip install -r requirements.txt`.
- **Frontend won't start:** Run `npm install` in the frontend directory.
- **API errors:** Verify the backend is running at `http://127.0.0.1:8000` and the frontend `.env` has `VITE_API_URL=http://127.0.0.1:8000/api`.
- **Database is empty:** Run `python -m app.seed` in the backend directory.
- **Login fails:** Use the demo credentials shown above.

---

## License

Academic / Project Demonstration