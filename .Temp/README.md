# E-Commerce Frontend

A modern Svelte application with TailwindCSS for the e-commerce microservices backend.

## Features

- **Authentication**: Login and Signup functionality
- **Product Catalog**: Browse products by category with pagination
- **Search**: Search products across the catalog
- **Product Details**: View detailed product information with SKU selection (Amazon-style)
- **Shopping Cart**: Add, update, and remove items from cart
- **Responsive Design**: Mobile-friendly UI built with TailwindCSS

## Tech Stack

- **Svelte**: Frontend framework
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework

## Setup

1. Install dependencies:

```bash
npm install
```

2. API endpoints are pre-configured with production URLs in `src/lib/config.js`:
   - Auth Worker: `https://w2-auth-worker.vg-firmly.workers.dev`
   - Cart Worker: `https://w2-cart-worker.vg-firmly.workers.dev`
   - Catalog Worker: `https://w2-catalog-worker.vg-firmly.workers.dev`
   - Inventory Worker: `https://w2-inventory-worker.vg-firmly.workers.dev`
   - Pricing Worker: `https://w2-pricing-worker.vg-firmly.workers.dev`

   To override with environment variables (e.g., for local development), create a `.env` file:

   ```bash
   VITE_AUTH_WORKER_URL=http://localhost:8787
   VITE_CART_WORKER_URL=http://localhost:8788
   VITE_CATALOG_WORKER_URL=http://localhost:8789
   VITE_INVENTORY_WORKER_URL=http://localhost:8790
   VITE_PRICING_WORKER_URL=http://localhost:8791
   ```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   └── Header.svelte
│   ├── lib/
│   │   ├── api/         # API service layer
│   │   │   ├── auth.js
│   │   │   ├── cart.js
│   │   │   ├── catalog.js
│   │   │   ├── inventory.js
│   │   │   └── pricing.js
│   │   ├── stores/      # Svelte stores
│   │   │   ├── auth.js
│   │   │   └── cart.js
│   │   ├── config.js    # API configuration
│   │   └── router.js    # Client-side router
│   ├── pages/           # Page components
│   │   ├── Home.svelte
│   │   ├── ProductDetail.svelte
│   │   ├── Cart.svelte
│   │   ├── Login.svelte
│   │   └── Signup.svelte
│   ├── App.svelte       # Main app component
│   ├── main.js          # Entry point
│   └── app.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Integration

The frontend integrates with the following microservices:

- **Auth Worker**: User authentication and registration
- **Cart Worker**: Shopping cart management
- **Catalog Worker**: Product catalog and search
- **Inventory Worker**: Stock availability
- **Pricing Worker**: Product pricing

## Features in Detail

### Home Page

- Displays company name and login/signup options in header
- Shows user name/email when logged in
- Lists all categories
- Displays products by category with pagination
- Search functionality
- Product cards with images and "View" button

### Product Detail Page

- Full product information
- Amazon-style SKU selection
- Shows price and stock for each SKU
- Add to cart functionality
- Quantity selector

### Cart Page

- View all cart items
- Update quantities
- Remove items
- Clear cart
- Order summary with total
- Continue shopping option

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_AUTH_WORKER_URL=http://localhost:8787
VITE_CART_WORKER_URL=http://localhost:8788
VITE_CATALOG_WORKER_URL=http://localhost:8789
VITE_INVENTORY_WORKER_URL=http://localhost:8790
VITE_PRICING_WORKER_URL=http://localhost:8791
```

## Authentication

The application uses **httpOnly cookies** for secure token storage:

- **Access Token**: Stored in httpOnly cookie (15 min expiry)
- **Refresh Token**: Stored in httpOnly cookie (30 days expiry)
- **Automatic Token Refresh**: When access token expires, the app automatically calls the refresh endpoint
- **No localStorage for tokens**: Tokens are never stored in localStorage for security

### Backend Requirements

The backend must be configured to:

1. Set httpOnly cookies on login/register
2. Read tokens from cookies (not request body)
3. Clear cookies on logout
4. Support automatic token refresh via cookies

See `BACKEND_REQUIREMENTS.md` for detailed backend implementation guide.

## Notes

- User info (name, email, userId) is stored in localStorage for quick access (not tokens)
- Cart works for both authenticated users and anonymous sessions
- All API calls handle errors gracefully with user-friendly messages
- The router uses hash-based routing for client-side navigation
- All requests include credentials (cookies) automatically
