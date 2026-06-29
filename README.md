# Wornora — Storefront

Premium Indian ethnic women's fashion e-commerce frontend (clothing + jewellery).
Warm, festive, heritage-inspired design system built on the brand's gold & beige palette.

Built with **React 19 · Vite · Tailwind CSS v4 · React Router v7 · Axios · Lucide**.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # serve the production build
npm run lint     # eslint
```

A backend is expected at `http://localhost:5000` (proxied via `/api`, configurable
through `BACKEND_URL` / `VITE_API_URL`). When the API is unreachable the catalogue
gracefully falls back to a bundled sample dataset, so the storefront is fully
browsable on its own.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home (hero carousel, categories, new arrivals, promos, featured, testimonials) |
| `/shop` | Product listing — filters, sort, infinite scroll. Query: `?category=&subcategory=&filter=new\|sale&search=&sort=` |
| `/product/:id` | Product details — gallery, variants, tabs, related |
| `/cart` | Cart — quantities, coupon, order summary |
| `/wishlist` | Saved items |
| `/profile` | Account dashboard — profile, orders, wishlist, addresses |
| `/about`, `/contact` | Brand story & contact |
| `/login`, `/register` | Brand-styled auth |
| `/admin/*` | Existing admin panel (protected) |
| `*` | 404 (also `/500`, `/offline` error pages) |

## Architecture

Layered per `AGENT.md`: **API → services → hooks → pages → components**.

```
src/
  api/            (existing axios instance lives in services/api.js)
  components/
    ui/           shared primitives (Button, Input, Card, Badge, Modal, Drawer, …)
    layout/       header, footer, search, mobile nav, announcement bar
    product/      ProductCard, ProductGrid, ProductRail, gallery, info, tabs
    home/ shop/ cart/ profile/   page-specific feature components
  context/        Auth, Cart, Wishlist, Toast (React Context)
  hooks/          useCatalog, useShopProducts, useProduct, useInfiniteScroll, …
  services/       *Api.js (axios) + catalog.js (cached, sample fallback)
  pages/          one component per route
  layout/         StoreLayout (storefront shell), AdminLayout
  constants/      brand, shop, sampleData
  utils/          cn, format, product, coupon
  index.css       Tailwind v4 @theme design tokens + base styles
```

### Design system

Tokens live in `src/index.css` (`@theme`): colours (`gold`, `beige`, `maroon`,
`ink`, …), fonts (`font-heading` Playfair Display, `font-body` Inter,
`font-accent` DM Sans), radii (`rounded-card/btn/input/image`), shadows
(`shadow-soft/card/lift/gold`) and the motion system. Use the Tailwind utilities
generated from these tokens — never hardcode hex values.
