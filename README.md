# 🍽️ Afsaana by Scooters — Luxury Restaurant Website
🚀 Live Demo: https://afsaana-premium-restaurant.vercel.app/

A hyper-premium, full-stack restaurant reservation platform with real-time booking management, AI chatbot integration, and admin dashboard.

A hyper-premium, cinematic restaurant website built with **Next.js 14**, **Framer Motion**, and **TypeScript**.

## ✨ Features

- **Cinematic Preloader** with percentage counter
- **Welcome Entry Screen** with animated reveal
- **Hero** — full-screen video background with letter-by-letter animation
- **About, Experience, Gallery** — parallax, lightbox, auto-play video
- **Signature Dishes** — 3D tilt cards (desktop) / always-visible info (mobile)
- **AI Chatbot** — keyword-smart assistant
- **Reservations** — full booking form with:
  - Time slot conflict detection (no double-bookings)
  - Unique booking reference number (e.g. `AFS-20260315-8421`)
  - On-screen luxury confirmation screen
- **Admin Dashboard** (`/admin`) — password protected:
  - All bookings with real-time data
  - Cancel bookings with one click
  - WhatsApp auto-opens with pre-filled cancellation message to customer
- **ntfy.sh Push Notifications** — instant phone alerts on every new booking/cancellation
- **Custom Magnetic Cursor**
- **Golden Scroll Progress Bar**
- **Mobile**: Full slide-out navigation drawer, sticky Call Now button
- **Contact** — direct Google Maps link to exact restaurant location

---

## 🚀 Deploying to Vercel

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "Initial production ready build"
git push origin main
```

### Step 2 — Import on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework Preset: **Next.js** (auto-detected)

### Step 3 — Add Environment Variables on Vercel
Go to Project Settings → Environment Variables and add:

| Variable | Value |
|---|---|
| `GMAIL_USER` | your-gmail@gmail.com |
| `GMAIL_APP_PASSWORD` | xxxx-xxxx-xxxx-xxxx |
| `OWNER_EMAIL` | your-email@gmail.com |
| `NTFY_TOPIC` | afsaana-bookings-private |

### Step 4 — Add Your Media Files

> ⚠️ Videos and images are excluded from Git (too large). You must upload them manually.

Place your files in:
- `public/videos/` — Hero video, gallery videos, experience videos
- `public/images/` — Gallery images, dish photos

### Step 5 — Important: Booking Data on Vercel

> ⚠️ **Vercel serverless functions cannot write to the filesystem.** The `bookings.json` data layer works perfectly for local development (`npm run dev`), but on Vercel you need a cloud database.

**Recommended (free): Connect Vercel KV**
1. In Vercel dashboard → Storage → Create KV Database → Connect to your project
2. Vercel will auto-add `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars
3. Contact developer to update the API routes to use `@vercel/kv`

---

## 🔐 Admin Access

Visit `/admin` or **tap the copyright text 5 times quickly** in the footer.

Admin password removed for security (available on request)*

---

## 📲 ntfy Notifications

1. Install **ntfy** app (Android/iOS — free)
2. Subscribe to topic: `afsaana-bookings-private`
3. Get instant push notifications for every new booking and cancellation

---

## 🛠️ Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Playfair Display + Inter (Google Fonts)
- **Notifications**: ntfy.sh (free push), Nodemailer (email)
