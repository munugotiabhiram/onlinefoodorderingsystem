# Online Food Ordering System (OFOS) 🍕🍔🍚

A premium, modern, 3D-themed online food ordering platform and full-stack management dashboard built with **Node.js**, **Express.js**, **HTML5**, **CSS3**, and **JavaScript**, featuring real **Google OAuth 2.0** and **Demo Account** authentication.

---

## 🌟 Key Features

1. **Modern 3D-Themed UI/UX**:
   - Interactive 3D ambient particle canvas and floating food spheres.
   - Glassmorphic card design with backdrop blur and tilt hover animations.
   - Realistic photography for Pizzas, Burgers, Biryani, Chinese, South Indian, North Indian, Desserts, and Beverages.
   - Dark Obsidian theme with glowing gradients (`#FF5722`, `#FF9800`, `#10B981`).

2. **Two Authentication Options (Strictly 2 Methods)**:
   - **Option 1: Login with Demo Account**: One-click instant login as a predefined customer (`demo@foodie.com`) or store admin (`admin@foodie.com`).
   - **Option 2: Continue with Google**: Genuine Google OAuth 2.0 integration using Google Identity Services (GIS) and backend verification (`google-auth-library`).

3. **Customer Dashboard**:
   - Welcome banner with active promo code pills (`WELCOME50`, `FOODIE30`, `FREEDEL`).
   - 8 Category navigations with live filtering.
   - Live search with instant debounce and Veg-only toggle.
   - Sorting by Popularity, Rating, Price (Low to High), and Price (High to Low).
   - Favorite heart toggle synced to user account.

4. **Shopping Cart & Checkout**:
   - Slide-out glassmorphism cart drawer with quantity counter (`+`/`-`).
   - Live calculation: Subtotal, coupon discount, delivery fee, 5% GST taxes, and total payable amount.
   - Checkout modal with saved address selection, new address creation, and demo payment methods (Card, UPI / QR, Cash on Delivery, NetBanking).

5. **Live 5-Stage Order Tracking**:
   - Real-time progress bar through 5 stages:
     1. Order Placed
     2. Restaurant Accepted
     3. Food Preparing
     4. Out for Delivery
     5. Delivered
   - Driver name, phone, delivery address, and estimated arrival countdown.
   - Evaluator **"Next Stage &rarr;"** button to simulate live progression.

6. **User Profile**:
   - Avatar, customer name, email, editable phone number.
   - Saved delivery address book (Add / Delete).
   - Past order history with receipt view and one-click tracking.

7. **Store Admin Dashboard**:
   - Protected role-based access (`role: admin`).
   - Interactive sales analytics and 7-day revenue trend chart.
   - Live order stage management (updates customer tracking in real time).
   - Menu items CRUD (Add, edit, delete dishes).
   - Customer directory with order counts.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Default settings work immediately out-of-the-box!)*

### 3. Start the Application
```bash
npm start
```
The server will start on: **`http://localhost:3000`**

---

## 🔑 Demo Account Credentials

| Account Role | Email | Password | Access Target |
| :--- | :--- | :--- | :--- |
| **Demo Customer** | `demo@foodie.com` | `demo123` | Customer Dashboard (`/dashboard.html`) |
| **Demo Admin** | `admin@foodie.com` | `admin123` | Store Admin Panel (`/admin.html`) |

*Tip: On the login page, you can toggle between **Customer Demo** and **Admin Demo** and click **"Login with Demo Account"** for one-click access!*

---

## 🌐 Google OAuth 2.0 Configuration

To enable your own Google account sign-in:
1. Go to [Google Cloud Console &rarr; Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   ```
4. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
5. Paste your credentials into `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```
6. Restart the server (`npm start`). The **"Continue with Google"** button will now authenticate real Google accounts!

---

## 🗄️ Database Options

The project includes multi-tier database flexibility:
1. **Embedded Persistent JSON Store (`data/db.json`)**: Configured by default. Automatically initializes with 24 gourmet dishes across 8 categories, 5 partner restaurants, active coupons, and sample orders. No external database setup needed!
2. **MySQL Database**: Execute `db/schema.sql` in MySQL Workbench or via:
   ```bash
   mysql -u root -p < db/schema.sql
   ```
   Then set `DB_TYPE=mysql` in `.env`.
3. **MongoDB**: Mongoose schema specifications are provided in `db/mongo-schema.js`. Set `MONGO_URI` in `.env`.

---

## 🧪 Automated Testing

Run the automated end-to-end test suite:
```bash
node test/run-all.js
```
All 14 tests verify authentication, menu filtering, order creation, live tracking stages, and admin CRUD operations.
