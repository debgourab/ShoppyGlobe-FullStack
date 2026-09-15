# ShoppyGlobe — Full-Stack E-commerce Application

ShoppyGlobe is a MERN-style e-commerce application built with React, Redux Toolkit, Node.js, Express.js, and MongoDB. It includes product browsing, search, authentication, a persistent shopping cart, protected API routes, admin product CRUD, INR pricing, and deployment support for Netlify + Render.

## Author

**Deb Gourab Biswas**

GitHub Repository: https://github.com/debgourab/ShoppyGlobe-FullStack

## Tech Stack

### Frontend
- React
- Vite
- Redux Toolkit
- React Router
- JavaScript ES6+
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs
- express-validator

## Main Features

- Responsive professional e-commerce UI
- Product catalogue with API, MongoDB cache, and bundled fallback support
- Product search and category filtering
- Product details
- User registration and login
- JWT-based authentication
- Protected cart routes
- Add, update, remove, and clear cart items
- MongoDB cart persistence
- Admin product CRUD
- INR pricing
- Centralized API error handling
- Netlify SPA routing
- Render-ready backend
- Resilient local-development API proxy

## Project Structure

```text
ShoppyGlobe-FullStack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── store/
│   ├── styles/
│   └── utils/
├── .env.example
├── index.html
├── netlify.toml
├── package.json
└── README.md
```

## Local Setup

### Quick frontend-only setup

The development server now proxies `/api` requests to the deployed Render backend by default. This means you can run the frontend locally without starting the Express backend.

```bash
git clone https://github.com/debgourab/ShoppyGlobe-FullStack.git
cd ShoppyGlobe-FullStack
npm install
npm run dev
```

Open the localhost URL printed by Vite. No frontend `.env` file is required for this default workflow.

### Optional: develop against the backend locally

Install backend dependencies:

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example` and configure:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4000,http://localhost:4001
ADMIN_EMAIL=admin@shoppyglobe.com
ADMIN_PASSWORD=replace_with_a_strong_password
```

Start the backend:

```bash
npm run dev
```

Then create `.env.local` in the project root:

```env
VITE_DEV_API_PROXY_TARGET=http://localhost:5000
```

Restart the Vite development server after changing `.env.local`.

## API Endpoints

### Health

```text
GET /api/health
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Cart

```text
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:productId
DELETE /api/cart/:productId
DELETE /api/cart
```

## Product Source and Fallback

The storefront first attempts to load products through the backend from Fake Store API. When that external service is unavailable, the backend can use cached MongoDB products and a bundled fallback catalogue so the storefront remains usable.

## Deployment

### Backend — Render

Use these settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Required Render environment variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-site.netlify.app
```

### Frontend — Netlify

Use these settings:

```text
Base Directory: leave blank
Build Command: npm run build
Publish Directory: dist
```

Required Netlify environment variable:

```env
VITE_API_URL=https://shoppyglobe-fullstack-nmb6.onrender.com/api
```

The included `netlify.toml` handles SPA route refreshes.

## Security Notes

- Never commit `.env` files or database credentials.
- Use a strong production `JWT_SECRET`.
- Restrict `CLIENT_URL` to trusted frontend origins.
- Rotate any credential that has been exposed publicly.
- Use a strong admin password in production.

## License

This project is intended for learning, portfolio, and demonstration purposes.
