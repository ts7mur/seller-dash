# Seller Dashboard

A focused inventory workspace for independent sellers. It combines authentication, inventory tracking and live margin visibility in one responsive dashboard.

[Open the live application](https://seller-dash-wine.vercel.app)

## Product scope

- Account creation and secure email/password authentication
- Per-user inventory records stored in Supabase
- Live inventory value, item count and average margin metrics
- Fast item creation with category, condition, pricing and tracking data
- Inline selling-price updates and automatic margin recalculation
- Light and dark interface themes

## Stack

- Next.js 14 and React 18
- Supabase Auth and PostgreSQL
- Vercel deployment
- Responsive custom CSS

## Why it exists

Seller operations often begin in disconnected spreadsheets. This project explores a clearer workflow where the numbers that matter are visible immediately and inventory updates stay close to the data.

## Run locally

```bash
npm install
npm run dev
```

The application expects `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
