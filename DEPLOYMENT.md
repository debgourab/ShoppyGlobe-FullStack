# ShoppyGlobe Deployment Guide

This project has two deployable parts:

- React + Vite frontend in the project root.
- Express + MongoDB backend in `backend/`.

The simplest setup is MongoDB Atlas for the database, Render for the backend API, and Vercel for the frontend.

## 1. Prepare The Repository

Push this project to GitHub first.

Make sure `.env` files and `node_modules` are not committed.

## 2. Create MongoDB Atlas Database

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add network access for your deployment provider. For quick student/demo deployment, `0.0.0.0/0` works, but restrict it later if you know the exact outbound IPs.
4. Copy the application connection string.

Use a database name in the URI:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/shoppyglobe?retryWrites=true&w=majority
```

If your password contains special characters, URL-encode it before adding it to the URI.

## 3. Deploy Backend On Render

Create a new Render Web Service from your GitHub repository.

Use these settings:

```text
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Add these environment variables in Render:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/shoppyglobe?retryWrites=true&w=majority
JWT_SECRET=use_a_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4000
ADMIN_EMAIL=admin@shoppyglobe.com
ADMIN_PASSWORD=replace_with_a_strong_password
NODE_VERSION=24.14.1
```

Do not set `PORT`; Render provides it automatically and the backend already reads `process.env.PORT`.

After deployment, test:

```text
https://YOUR-BACKEND.onrender.com/api/health
```

You should see:

```json
{ "success": true, "status": "ok", "service": "ShoppyGlobe API" }
```

## 4. Seed The Production Database

On your computer, create `backend/.env` with your Atlas `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`, then run:

```bash
cd backend
npm install
npm run seed
```

This creates sample products and an admin user in Atlas.

## 5. Deploy Frontend On Vercel

Create a new Vercel project from the same GitHub repository.

Use these settings:

```text
Framework Preset: Vite
Root Directory: .
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Add this Vercel environment variable:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

Deploy the frontend. Copy the Vercel production URL.

The included `vercel.json` rewrites all frontend routes to `index.html`, so direct visits and refreshes on React Router pages work in production.

## 6. Update Backend CORS

Go back to the Render backend service and update:

```env
CLIENT_URL=https://YOUR-FRONTEND.vercel.app
```

If you also want local development to keep working against the deployed backend, use a comma-separated list:

```env
CLIENT_URL=https://YOUR-FRONTEND.vercel.app,http://localhost:4000,http://localhost:5173
```

Redeploy the backend after changing `CLIENT_URL`.

## 7. Final Production Check

Open the frontend URL and verify:

- Product list loads.
- Product detail page opens.
- Register works.
- Login works.
- Add to cart works after login.
- Cart still shows after refreshing the page.

If the frontend loads but cart or auth fails, check `VITE_API_URL` in Vercel and `CLIENT_URL` in Render first.
