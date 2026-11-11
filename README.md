# QUIET BATTLES™

> **"Wear Your Battles"** — An architectural streetwear and editorial storytelling e-commerce platform.

QUIET BATTLES™ merges luxury heavyweight streetwear with chapter-based editorial narratives (*The Archive: Series 01*). The platform features an interactive storefront, a chapter-driven garment archive, a slide-out cart drawer, and a built-in CMS administrative panel to manage products, editorial content, and orders.

---

## ✦ Features

- **Editorial Storytelling**: Collections structured as **Series** and **Chapters** (Chapters I–V) connecting narrative text, mood galleries, and specific garments.
- **Garment Showcase & Specs**: Detailed garment views with material specifications (GSM, fabric weight, cold-dyed pigment wash, country of origin, sizing).
- **Archive Bag & Checkout**: Slide-out cart drawer with quantity controls, size selection (S, M, L, XL), and order confirmation.
- **Administrative CMS**: Secure modal dashboard to create, edit, archive products, and track customer orders.
- **Dual Lookups**: Flexible API querying by both MongoDB `ObjectId` and SEO-friendly `slug`.
- **Responsive Dark Aesthetic**: Minimalist, high-fashion brutalist/editorial aesthetic with fluid mobile responsiveness.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Server**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **Middleware**: CORS, Dotenv

---

## 📁 Project Structure

```text
quiet-battles/
├── backend/
│   ├── models.js             # Mongoose schemas (Product, Series, Chapter)
│   ├── server.js             # Express API server, routes & admin auth
│   ├── seed_editorial.js     # Database seeder script
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # CartContext (bag state management)
│   │   ├── pages/            # StoreFrontPages, AdminDashboard
│   │   ├── App.jsx           # Routing & layout navigation
│   │   └── main.jsx          # React DOM root entry
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI (or local MongoDB instance)

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ADMIN_USER=admin
   ADMIN_PASS=quietbattles2026
   ADMIN_TOKEN=qb-editorial-cms-token-2026
   ```

5. *(Optional)* Seed initial Series 01 data and garments:
   ```bash
   npm run seed
   ```

6. Start the API server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Configure your backend API endpoint in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

---

## 🔑 CMS Admin Access

The platform includes a built-in editorial CMS modal accessible from the top navigation bar (**CMS Admin** button):

- **Default Username**: `admin` *(configurable via `ADMIN_USER`)*
- **Default Password**: `quietbattles2026` *(configurable via `ADMIN_PASS`)*
- **Clearance Token**: `qb-editorial-cms-token-2026` *(configurable via `ADMIN_TOKEN`)*

Use the CMS to add new garments, edit fabric details/pricing, adjust inventory, and monitor incoming orders.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | API health check & DB status | No |
| `GET` | `/api/products` | Retrieve all archive garments | No |
| `GET` | `/api/products/:identifier` | Retrieve garment by ID or slug | No |
| `POST` | `/api/products` | Create a new garment artifact | **Yes** (Admin Token) |
| `PUT` | `/api/products/:identifier` | Update an existing garment | **Yes** (Admin Token) |
| `DELETE`| `/api/products/:identifier` | Archive / delete a garment | **Yes** (Admin Token) |
| `GET` | `/api/series` | Fetch all archive series & chapters | No |
| `GET` | `/api/series/:slug` | Fetch specific series by slug | No |
| `GET` | `/api/chapters` | Fetch all editorial chapters | No |
| `GET` | `/api/chapters/:slug` | Fetch single chapter narrative & garment | No |
| `POST` | `/api/orders` | Place a customer checkout order | No |
| `GET` | `/api/orders` | View list of placed orders | **Yes** (Admin Token) |
| `POST` | `/api/admin/login` | Authenticate CMS admin credentials | No |

---

## 🌐 Deployment

- **Frontend**: Configured for instant deployment on [Vercel](https://vercel.com/) (includes client-side routing rewrites in `vercel.json`).
- **Backend**: Ready to deploy on [Render](https://render.com/), [Fly.io](https://fly.io/), or [Railway](https://railway.app/). Ensure environment variables are mirrored in your hosting provider's dashboard.

---

## 📄 License

ISC License. Built for QUIET BATTLES™.

