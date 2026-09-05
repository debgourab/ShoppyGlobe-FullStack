# ShoppyGlobe — Full-Stack E-commerce Application

ShoppyGlobe is now a full-stack e-commerce project with the existing **React + Vite + Redux** frontend and a new **Node.js + Express + MongoDB** backend.

The backend implementation follows the supplied API assignment: Express API setup, MongoDB product/cart collections, CRUD operations, validation/error handling, JWT authentication, protected cart routes, and Thunder Client testing documentation. fileciteturn0file0L2-L17 fileciteturn0file0L18-L34

## Full-stack architecture

```text
ShoppyGlobe-React-main/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── docs/
│   ├── THUNDERCLIENT_TESTING.md
│   └── screenshots/
│       └── README.md
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── cartController.js
│       │   └── productController.js
│       ├── middleware/
│       │   ├── auth.js
│       │   └── errorHandler.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Product.js
│       │   └── Cart.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── productRoutes.js
│       │   └── cartRoutes.js
│       ├── seed/
│       │   └── seed.js
│       └── utils/
│           └── auth.js
└── src/
    ├── api/
    │   ├── apiClient.js
    │   ├── authApi.js
    │   ├── cartApi.js
    │   └── productsApi.js
    ├── components/
    ├── hooks/
    ├── pages/
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   └── Register.jsx
    ├── store/
    └── styles/
```

## Backend assignment coverage

| Requirement | Implementation |
|---|---|
| Node.js + Express | `backend/src/server.js` and `backend/src/app.js` |
| GET product list | `GET /api/products` |
| GET single product | `GET /api/products/:id` |
| POST cart item | `POST /api/cart` |
| PUT cart quantity | `PUT /api/cart/:productId` |
| DELETE cart item | `DELETE /api/cart/:productId` |
| MongoDB | Mongoose connection in `backend/src/config/db.js` |
| Products collection | `Product` model |
| Cart collection | `Cart` model linked to users/products |
| Product CRUD | Admin-only POST/PUT/DELETE product endpoints |
| Cart CRUD | Add, read, update, remove and clear cart |
| Validation | `express-validator` + Mongoose validation |
| Error handling | Central Express error middleware |
| JWT authentication | Register/login + Bearer-token middleware |
| User registration | `POST /api/auth/register` |
| User login | `POST /api/auth/login` |
| Protected cart | All `/api/cart` routes require JWT |
| Thunder Client | Complete request checklist in `docs/THUNDERCLIENT_TESTING.md` |
| Documentation | README + API/testing documentation |

The supplied assignment specifically requires the `/products` and `/cart` routes, MongoDB storage, validation/error handling, JWT authentication, protected cart access, and Thunder Client testing. fileciteturn0file0L7-L17 fileciteturn0file0L18-L34 fileciteturn0file0L36-L42

## 1. Prerequisites

Install:

- Node.js 20.19+ 
- MongoDB Community Server **or** a MongoDB Atlas database
- Git
- Thunder Client extension for VS Code (for the assignment testing screenshots)

## 2. Configure MongoDB and backend

Open a terminal in the project root:

```bash
cd backend
```

Create your environment file:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shoppyglobe
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4000,http://localhost:5173
ADMIN_EMAIL=admin@shoppyglobe.com
ADMIN_PASSWORD=Admin@12345
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

## 3. Install and seed the backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

The seed command creates sample products and an admin account.

**Demo admin credentials**

```text
Email: admin@shoppyglobe.com
Password: Admin@12345
```

Change these credentials before using the project outside a classroom/demo environment.

## 4. Configure and run the React frontend

Open a second terminal:

```bash
cd ShoppyGlobe-React-main
npm install
npm run dev
```

The frontend expects the backend at:

```text
http://localhost:5000/api
```

To use another backend URL, create `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

## Authentication flow

1. Register at `/register`, or login at `/login`; the frontend calls `/api/auth/register` and `/api/auth/login`.
2. The backend hashes passwords with `bcryptjs`.
3. Login/registration returns a JWT.
4. The frontend stores the JWT in browser local storage.
5. API requests automatically send `Authorization: Bearer <token>`.
6. The backend verifies the token before allowing cart operations.
7. Each user gets a separate MongoDB cart.

## API endpoints

### Public endpoints

```text
GET    /api/health
POST   /api/auth/register
POST   /api/auth/login
GET    /api/products
GET    /api/products/:id
```

### Protected cart endpoints

```text
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:productId
DELETE /api/cart/:productId
DELETE /api/cart
```

### Admin product CRUD

Admin JWT required:

```text
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Example requests

### Register

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "Password@123"
}
```

### Login

```json
{
  "email": "demo@example.com",
  "password": "Password@123"
}
```

### Add to cart

```json
{
  "productId": "MONGODB_PRODUCT_ID",
  "quantity": 1
}
```

### Update cart quantity

```json
{
  "quantity": 2
}
```

## MongoDB collections

### users

Stores:

- name
- email
- hashed password
- role
- timestamps

### products

Stores:

- title
- price in INR
- description
- category
- image/thumbnail
- stock
- rating
- timestamps

### carts

Stores:

- user reference
- product references
- quantity
- timestamps

## Fake Store API integration

The storefront product catalogue uses the requested external API:

```text
https://fakestoreapi.com/products
```

For local development, `vite.config.js` proxies `/fakestoreapi/*` to Fake Store API. This avoids browser CORS failures while keeping the requested API as the product source. Product prices returned by Fake Store API are USD and are displayed as INR using the project's ₹90/USD demonstration conversion.

The Express/MongoDB backend remains responsible for authentication and the persistent cart. When a logged-in user adds a Fake Store product to the cart, the backend syncs that external product into MongoDB using its numeric `externalId`.

## Frontend integration

The product catalogue now uses the requested Fake Store API (`https://fakestoreapi.com/products`). During local development, Vite proxies `/fakestoreapi/*` to Fake Store API to avoid browser CORS failures. Authentication and cart operations continue to use the Express + MongoDB backend. The backend can also sync Fake Store products into MongoDB when an item is added to a cart.

Frontend API modules:

```text
src/api/apiClient.js
src/api/productsApi.js
src/api/authApi.js
src/api/cartApi.js
```

Redux now manages:

```text
auth
cart
search
```

Cart changes are persisted to MongoDB instead of only being held in browser memory.

## INR pricing

The frontend and backend use Indian Rupees (`₹`). The seeded catalogue uses INR values derived from the original demo catalogue's USD prices at the project's ₹90/USD demonstration rate.

## Thunder Client testing

See:

```text
docs/THUNDERCLIENT_TESTING.md
```

The document contains the exact request order, authentication flow, headers, request bodies, expected status codes, and screenshot checklist required for submission.

The supplied assignment asks for Thunder Client testing and documentation/screenshots of API testing. fileciteturn0file0L36-L42

## MongoDB screenshots

Actual MongoDB screenshots cannot be pre-generated because they depend on the MongoDB database instance you run locally or in Atlas.

Use the checklist in:

```text
docs/screenshots/README.md
```

After running `npm run seed`, capture screenshots showing the `users`, `products`, and `carts` collections in MongoDB Compass/Atlas.

## Production notes

Before deploying:

- Use a strong random `JWT_SECRET`.
- Replace the demo admin password.
- Restrict `CLIENT_URL` to the real frontend domain.
- Use MongoDB Atlas or another managed MongoDB deployment.
- Configure HTTPS.
- Never commit `.env`.
- Keep `node_modules` out of GitHub.

GitHub Repo : [https://github.com/debgourab/ShoppyGlobe-FullStack.git]
