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
│   ├── .env.example
│   └── package.json
├── public/
├── src/
├── .env.example
├── index.html
├── netlify.toml
├── package.json
└── README.md
```

## Local Setup

### Quick frontend-only setup

The Vite development server proxies `/api` requests to the deployed Render backend by default, so you can run the frontend locally without starting Express.

```bash
git clone https://github.com/debgourab/ShoppyGlobe-FullStack.git
cd ShoppyGlobe-FullStack
npm install
npm run dev
```

### Run the backend locally

Install backend dependencies:

```bash
cd backend
npm install
```

Create a real local environment file from the safe template.

Windows Command Prompt:

```bash
copy .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Then edit `backend/.env` and replace the placeholders with your own private values:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4000,http://localhost:4001,http://localhost:5173,https://shoppyglobe-deb.netlify.app
ADMIN_EMAIL=admin@shoppyglobe.com
ADMIN_PASSWORD=your_strong_admin_password
```

Start the backend:

```bash
npm run dev
```

Test it in the browser:

```text
http://localhost:5000/api/health
http://localhost:5000/api/fakestore/products
```

To make the local frontend use the local backend, create `.env.local` in the project root:

```env
VITE_DEV_API_PROXY_TARGET=http://localhost:5000
```

Then restart the frontend development server.

> `backend/.env` is intentionally ignored by Git and must never be pushed to GitHub. Only `backend/.env.example` belongs in the repository.

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
CLIENT_URL=https://shoppyglobe-deb.netlify.app,http://localhost:4000,http://localhost:4001,http://localhost:5173
```

### Frontend — Netlify

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
