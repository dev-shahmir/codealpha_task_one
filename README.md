# UrbanThread — Demo E-Commerce Platform

A full-stack, Awwwards-style clothing e-commerce demo built with **Next.js (App Router)**,
**Express.js**, **MongoDB**, **Cloudinary**, **Nodemailer**, and **Socket.io**.

> ⚠️ **This is a demo/portfolio project.** Checkout uses a fully mocked payment flow — no real
> money ever moves, and every transactional email clearly states it's a demo. Do not connect a
> real payment processor without significant additional security work (PCI compliance, etc).

---

## ✨ Signature feature: Live Activity Feed

Unlike a typical storefront, every product page shows **real-time social proof** over a
Socket.io connection:

- A live "N people are viewing this" counter per product.
- A site-wide ticker in the navbar showing recent (real + simulated) purchases as they happen.
- A landing-page banner surfacing aggregate "shopping now" stats.

Real purchase events are emitted the moment an order is placed (`orderController.js`). A
lightweight simulated stream fills in demo traffic so the feature is visible even with low
real visitor counts — see `backend/utils/liveActivity.js` for exactly how, and swap it for
real concurrent-session tracking in a production build.

---

## 🗂 Project Structure

```
ecommerce-app/
├── backend/                 # Express API
│   ├── config/               # DB + Cloudinary config
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth, error handling, uploads
│   ├── models/                # Mongoose schemas (User, Product, Order)
│   ├── routes/                # Express routers
│   ├── templates/             # HTML email templates
│   ├── utils/                  # Email, tokens, live activity, seed script
│   └── server.js
└── frontend/                 # Next.js App Router
    ├── app/                    # Pages (landing, products, cart, checkout, auth, admin)
    ├── components/             # Navbar, ProductCard, LiveTicker, etc.
    ├── context/                 # AuthContext
    ├── lib/                     # API client, socket hooks
    └── store/                   # Zustand cart store
```

---

## 🚀 Setup

### 1. Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB)
- A free [Cloudinary](https://cloudinary.com/) account
- An email account for SMTP (Gmail + [App Password](https://myaccount.google.com/apppasswords) is easiest)

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, CLOUDINARY_*, SMTP_*, ADMIN_EMAIL, ADMIN_PASSWORD
npm run seed     # creates sample products + your admin account
npm run dev      # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Defaults point at http://localhost:5000 — update if you deploy the backend elsewhere
npm run dev      # starts on http://localhost:3000
```

### 4. Log in as admin
Use the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env`, then visit `/admin`.
Only accounts with `role: "admin"` can reach any `/admin` route or `/api/admin/*` /
product-write endpoints — this is enforced server-side in `middleware/auth.js`, not just hidden
in the UI.

---

## 📧 Emails sent by this app

All emails share one HTML template with a clear **"THIS IS A DEMO STORE"** banner
(`backend/templates/baseTemplate.js`):

1. **Welcome / verify email** — on registration
2. **Forgot password** — reset link (1 hour expiry)
3. **Password changed** — confirmation after reset
4. **Order confirmation** — after mock checkout
5. **Order status update** — admin changes order status
6. **Order delivered** — completion notice

---

## 🔐 Security notes

- Passwords hashed with bcrypt (cost factor 12)
- JWT auth via httpOnly cookie + Bearer token support
- Rate limiting, `helmet`, and Mongo query sanitization on the API
- Admin routes protected by both route middleware (`restrictTo('admin')`) and a client-side
  redirect guard — the real enforcement is server-side
- All product prices are recalculated server-side at checkout; the client can never set its own price

---

## 🎨 Design system

- **Colors:** paper `#F7F7F3`, ink `#14141A`, ash `#6E6E76`, hairline `#DEDED8`, signal `#E4FF3C` (reserved for live-activity UI only), rust `#B94A2C`
- **Type:** Archivo Black (display) + Inter (body)
- **Signature element:** the signal-yellow live indicator dot/ticker — used nowhere else in the UI, so it always reads as "this is live data"

---

## 🧩 Feature list

- Storefront: landing, category browsing with sidebar filters, product detail with variant/size/color selection, size guide modal, store locator modal ("Find in Store")
- **Wishlist ("The Archive")** — heart-toggle on any product card or detail page, backed by `/api/users/wishlist`, viewable in Account → The Archive
- **Saved addresses** — full CRUD in Account → Addresses, backed by `/api/users/addresses`, selectable at checkout
- Cart ("Atelier Bag"), mock checkout with saved-address quick-select, order confirmation
- Auth: register, login, email verification, forgot/reset password — all emailed via Nodemailer
- Account: order history, profile, addresses, archive (wishlist)
- Admin dashboard: stats, product CRUD with Cloudinary image upload, order status management — admin-only server-side
- Live activity feed (signature feature): per-product live viewer count + site-wide recent-purchase ticker over Socket.io
- SEO: per-product metadata, sitemap.xml, robots.txt

---

## 🧩 Extending this project

- Swap mock payment (`orderController.mockProcessPayment`) for Stripe/PayPal
- Replace the simulated viewer stream with real Socket.io room counts (`io.sockets.adapter.rooms`)
- Add product search autocomplete, wishlist page, and coupon codes (models already have `wishlist` on `User`)
- Add image optimization pipeline / responsive Cloudinary transformations
