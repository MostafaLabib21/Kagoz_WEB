# Project Feature Gaps

Date: 2026-04-12

## 1) Explicit Placeholder Features

### About Page
- Current state: placeholder route and placeholder component are used.
- Route:
  - /about
- Evidence:
  - frontend/src/App.js
  - frontend/src/components/PlaceholderPage.jsx
- Needed work:
  - Build a real About page and replace the placeholder route element.

## 2) Missing Customer-Facing Pages (Linked but Not Implemented)

### My Orders
- Current state: linked from customer UI but no route/page exists.
- Linked from:
  - frontend/src/components/customer/Navbar.jsx
  - frontend/src/components/customer/MobileDrawer.jsx
  - frontend/src/components/customer/Footer.jsx
- Missing:
  - Route: /my-orders
  - Page component for order history and status list
- Suggested data source:
  - GET /api/orders/my-orders

### Contact
- Current state: linked in footer but no route/page exists.
- Link in:
  - frontend/src/components/customer/Footer.jsx
- Missing:
  - Route: /contact
  - Contact page content and submit flow (optional backend endpoint if form required)

### Shipping
- Current state: linked in footer but no route/page exists.
- Link in:
  - frontend/src/components/customer/Footer.jsx
- Missing:
  - Route: /shipping
  - Shipping policy page

### Returns
- Current state: linked in footer but no route/page exists.
- Link in:
  - frontend/src/components/customer/Footer.jsx
- Missing:
  - Route: /returns
  - Returns/refund policy page

## 3) Implemented but Broken/Incomplete Flows

### Checkout Success Navigation Mismatch
- Current state:
  - Checkout redirects to /account/orders/:orderId
  - App route is /order-confirmation/:orderId
- Evidence:
  - frontend/src/pages/customer/CheckoutPage.jsx
  - frontend/src/App.js
- Needed fix:
  - Navigate to /order-confirmation/:orderId after successful order creation.

### Order Confirmation Data Shape Mismatch
- Current state:
  - Backend response wraps order in { order }
  - Frontend reads response as direct order object
- Evidence:
  - backend/controllers/orderController.js
  - frontend/src/pages/customer/OrderConfirmationPage.jsx
- Needed fix:
  - Read response.data.order in order confirmation query logic.

## 4) Backend Placeholder Check

- No explicit TODO/FIXME/TBD placeholder markers found in backend source folders during scan.
- Core auth/admin/public/order routes are implemented.

## Priority Recommendation

1. Fix checkout and confirmation mismatches (production bug).
2. Build My Orders page and route (already linked in multiple places).
3. Replace About placeholder with real content.
4. Add Contact, Shipping, Returns pages and route wiring.
