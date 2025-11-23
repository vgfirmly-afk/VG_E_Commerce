# VG E-Commerce Frontend

SvelteKit frontend application for the VG E-Commerce microservices backend.

## Features

- User authentication (login/signup) and guest checkout
- Product browsing by category
- Product detail pages with SKU variants
- Shopping cart management
- Complete checkout flow (address, shipping, payment)
- PayPal integration
- Order status tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your backend URLs:
```env
VITE_AUTH_BASE_URL=https://w2-auth-worker.vg-firmly.workers.dev
VITE_CATALOG_BASE_URL=https://w2-catalog-worker.vg-firmly.workers.dev
VITE_CART_BASE_URL=https://w2-cart-worker.vg-firmly.workers.dev
VITE_CHECKOUT_BASE_URL=https://w2-checkout-worker.vg-firmly.workers.dev
VITE_PAYMENT_BASE_URL=https://w2-payment-worker.vg-firmly.workers.dev
VITE_PRICING_BASE_URL=https://w2-pricing-worker.vg-firmly.workers.dev
VITE_INVENTORY_BASE_URL=https://w2-inventory-worker.vg-firmly.workers.dev
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_FRONTEND_BASE_URL=http://localhost:5173
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Project Structure

- `src/routes/` - SvelteKit routes (pages)
- `src/lib/api/` - API client functions for backend workers
- `src/lib/stores/` - Svelte stores for state management
- `src/lib/components/` - Reusable Svelte components
- `src/lib/config.js` - Configuration and environment variables

## Tech Stack

- **SvelteKit** - Full-stack framework
- **Tailwind CSS 3** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **PayPal SDK** - Payment processing

