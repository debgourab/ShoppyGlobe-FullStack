# ShoppyGlobe Thunder Client Testing Guide

Use this exact order. The canonical backend base URL is:

```text
http://localhost:5000/api
```

Before testing, run MongoDB and then in `backend/` run:

```bash
npm install
copy .env.example .env
npm run seed
npm run dev
```

The seed command creates an admin account:

```text
Email: admin@shoppyglobe.com
Password: Admin@12345
```

## 1. Health check

**GET** `http://localhost:5000/api/health`

Expected: `200 OK`

## 2. Register a normal user

**POST** `http://localhost:5000/api/auth/register`

Header:

```text
Content-Type: application/json
```

Body:

```json
{
  "name": "Thunder Client User",
  "email": "thunder@example.com",
  "password": "Password@123"
}
```

Expected: `201 Created`. Copy the returned `token`.

> Compatibility note: `/api/register` also works, but `/api/auth/register` is the recommended route.

## 3. Login as the normal user

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "thunder@example.com",
  "password": "Password@123"
}
```

Expected: `200 OK`. Copy the returned token.

## 4. Test the requested Fake Store API through the backend

**GET** `http://localhost:5000/api/fakestore/products`

**GET** `http://localhost:5000/api/fakestore/products/1`

Expected: `200 OK`.

## 5. Add a Fake Store product to the authenticated cart

**POST** `http://localhost:5000/api/cart`

Headers:

```text
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "productId": 1,
  "quantity": 1
}
```

Expected: `201 Created`. Numeric Fake Store IDs are supported and are automatically synchronized into MongoDB.

## 6. Get cart

**GET** `http://localhost:5000/api/cart`

Header:

```text
Authorization: Bearer YOUR_USER_TOKEN
```

Expected: `200 OK`.

## 7. Update cart quantity

**PUT** `http://localhost:5000/api/cart/1`

Headers:

```text
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "quantity": 2
}
```

Expected: `200 OK`.

## 8. Remove cart item

**DELETE** `http://localhost:5000/api/cart/1`

Header:

```text
Authorization: Bearer YOUR_USER_TOKEN
```

Expected: `200 OK`.

## 9. Login as admin

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "admin@shoppyglobe.com",
  "password": "Admin@12345"
}
```

Expected: `200 OK`. Copy the admin token.

## 10. Create a product

**POST** `http://localhost:5000/api/products`

Headers:

```text
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "title": "Thunder Test Product",
  "price": 999,
  "description": "Product created for API testing.",
  "category": "testing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  "stock": 10
}
```

Expected: `201 Created`.

`thumbnail` is optional. If it is omitted, the backend automatically uses `image` as the thumbnail. Copy `product._id` from the response.

## 11. Update the created product

**PUT** `http://localhost:5000/api/products/PRODUCT_MONGODB_ID`

Headers:

```text
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "price": 1099,
  "stock": 15
}
```

Expected: `200 OK`.

## 12. Delete the created product

**DELETE** `http://localhost:5000/api/products/PRODUCT_MONGODB_ID`

Header:

```text
Authorization: Bearer YOUR_ADMIN_TOKEN
```

Expected: `200 OK`.

## Common errors

- `404 Route not found`: check the URL exactly. Use `/api/auth/register` and `/api/auth/login`.
- `401 Authentication required`: add `Authorization: Bearer <token>`.
- `403 Admin access required`: login with the seeded admin account for product POST/PUT/DELETE.
- `400 Validation failed`: verify JSON field names and make sure numbers are sent as JSON numbers.
- `Failed to fetch`: backend is not running, MongoDB failed to connect, or the frontend proxy was not restarted after a config change.
