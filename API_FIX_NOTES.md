# Fake Store API Fix

The product catalogue now uses the requested external API:

`https://fakestoreapi.com/products`

## Why the old version failed

The frontend product service was calling the local Express/MongoDB API at `http://localhost:5000/api/products`, not Fake Store API. If the backend was not running, the browser showed `Failed to fetch`.

The browser can also reject direct third-party API calls because of CORS. The frontend now requests `/fakestoreapi/...` and Vite proxies those requests to `https://fakestoreapi.com` during development.

## What was changed

- `src/api/productsApi.js` now uses the Fake Store API through `/fakestoreapi`.
- `vite.config.js` contains a CORS-safe development proxy to `https://fakestoreapi.com`.
- Product details use the same external API.
- Fake Store API prices are USD and are converted to INR at the project's demo rate of ₹90/USD for display.
- The full-stack cart still uses MongoDB and JWT authentication.
- MongoDB products now support `externalId`, which stores the Fake Store numeric product ID.
- Adding a Fake Store product to the cart automatically syncs that product into MongoDB when needed.
- Cart update/remove operations accept the Fake Store numeric ID.
- Existing backend product CRUD routes remain available for the assignment.
- Vite is configured for `http://localhost:4000` and the backend CORS example was updated accordingly.

## Important

The Vite proxy is intended for local development. For production hosting, use a server-side proxy such as the included Express backend or configure the deployment platform to proxy the external API.
