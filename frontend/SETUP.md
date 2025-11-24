# Frontend Setup Guide

## Quick Start

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables**

   Create a `.env` file in the `frontend` directory with the following variables:

   ```env
   VITE_AUTH_BASE_URL=https://w2-auth-worker.vg-firmly.workers.dev
   VITE_CATALOG_BASE_URL=https://w2-catalog-worker.vg-firmly.workers.dev
   VITE_CART_BASE_URL=https://w2-cart-worker.vg-firmly.workers.dev
   VITE_CHECKOUT_BASE_URL=https://w2-checkout-worker.vg-firmly.workers.dev
   VITE_PAYMENT_BASE_URL=https://w2-payment-worker.vg-firmly.workers.dev
   VITE_PRICING_BASE_URL=https://w2-pricing-worker.vg-firmly.workers.dev
   VITE_INVENTORY_BASE_URL=https://w2-inventory-worker.vg-firmly.workers.dev
   VITE_PAYPAL_CLIENT_ID=your-paypal-client-id-here
   VITE_FRONTEND_BASE_URL=http://localhost:5173
   ```

   **Note:** Update the URLs to match your actual Cloudflare Worker deployments.

3. **Run Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

4. **Build for Production**

   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Features Implemented

### ✅ Authentication

- User registration and login
- Guest session support (stored in localStorage)
- Token management with refresh capability
- Protected routes

### ✅ Home Page

- Displays products grouped by category
- Each category in a single row
- Product cards with images, title, description, and category
- Responsive grid layout

### ✅ Product Detail Page

- Full product information display
- Multiple SKU variants selection
- Price display for each SKU
- Add to cart functionality
- Quantity selector

### ✅ Shopping Cart

- View all cart items
- Increase/decrease quantity
- Remove items from cart
- Cart total calculation
- Proceed to checkout button

### ✅ Checkout Flow

1. **Delivery Address** - Collect delivery information
2. **Billing Address** - Optional (can use same as delivery)
3. **Shipping Method** - Select from available shipping options
4. **Order Summary** - Review order details, pricing, and stock status
5. **Payment** - PayPal integration (redirects to PayPal for payment)

### ✅ Order Status Page

- Shows payment status (success/pending/failed)
- Displays order details
- Shows delivery address
- Shows shipping method
- Lists all order items
- Payment transaction information

## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── api/          # API client functions
│   │   │   ├── auth.js
│   │   │   ├── catalog.js
│   │   │   ├── cart.js
│   │   │   ├── checkout.js
│   │   │   ├── payment.js
│   │   │   └── pricing.js
│   │   ├── components/   # Reusable components
│   │   │   ├── Header.svelte
│   │   │   └── ProductCard.svelte
│   │   ├── stores/       # Svelte stores
│   │   │   ├── auth.js
│   │   │   └── cart.js
│   │   └── config.js     # Configuration
│   ├── routes/           # SvelteKit routes
│   │   ├── +page.svelte  # Home page
│   │   ├── +layout.svelte # Layout wrapper
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── products/[id]/
│   └── app.css           # Global styles
├── package.json
├── vite.config.js
├── svelte.config.js
├── tailwind.config.js
└── postcss.config.js
```

## API Integration

The frontend integrates with all backend workers:

- **Auth Worker**: User registration, login, token management
- **Catalog Worker**: Product listing, product details, home page
- **Cart Worker**: Cart management, add/remove items, quantity updates
- **Checkout Worker**: Checkout session, addresses, shipping, summary
- **Payment Worker**: Payment intent creation, PayPal integration
- **Pricing Worker**: Product and SKU pricing

## Guest Checkout Flow

1. Guest user adds products to cart (uses session ID from localStorage)
2. Proceeds to checkout
3. Enters delivery and billing addresses
4. Selects shipping method
5. Reviews order summary
6. Redirects to PayPal for payment
7. Returns to order status page with checkout_id

## User Checkout Flow

1. User logs in or registers
2. Adds products to cart (uses user_id)
3. Proceeds to checkout
4. Enters delivery and billing addresses
5. Selects shipping method
6. Reviews order summary
7. Redirects to PayPal for payment
8. Returns to order status page with checkout_id

## PayPal Integration

The checkout flow creates a payment intent via the Payment Worker, which returns a PayPal approval URL. The user is redirected to PayPal to complete the payment, then returns to the order status page.

## State Management

- **Auth Store**: Manages user authentication state and tokens
- **Cart Store**: Manages shopping cart state
- **Guest Session**: Manages guest session ID in localStorage

All stores persist data to localStorage for session persistence.

## Styling

The application uses Tailwind CSS 3 with:

- Responsive design (mobile-first)
- Modern UI components
- Consistent color scheme (blue primary)
- Form styling with Tailwind Forms plugin

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- LocalStorage support required
- ES6+ JavaScript support required
