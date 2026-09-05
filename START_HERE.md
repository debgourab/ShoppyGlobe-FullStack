# Start Here — ShoppyGlobe API

## 1. Start MongoDB

Make sure MongoDB Community Server is running, or replace `MONGODB_URI` with your Atlas connection string.

## 2. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Expected backend URL:

```text
http://localhost:5000
```

Test first:

```text
GET http://localhost:5000/api/health
```

## 3. Frontend

Open a second terminal from the project root:

```bash
npm install
npm run dev
```

Expected frontend URL:

```text
http://localhost:4000
```

## 4. POST routes to test

```text
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
POST http://localhost:5000/api/cart
POST http://localhost:5000/api/products
```

- Cart POST requires a normal-user or admin JWT.
- Product POST requires the seeded admin JWT.
- See `docs/THUNDERCLIENT_TESTING.md` for exact bodies and headers.
