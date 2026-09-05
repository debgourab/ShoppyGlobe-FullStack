import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import fakeStoreRoutes from "./routes/fakeStoreRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// Allow the Vite development server and any explicitly configured frontend origins.
const configuredOrigins = (process.env.CLIENT_URL || "http://localhost:4000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Thunder Client, Postman and server-to-server requests may not send an Origin header.
      if (!origin || configuredOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true
  })
);

// Parse JSON bodies sent by POST/PUT/PATCH requests.
app.use(express.json({ limit: "1mb" }));

// Simple route used to confirm the backend is running before testing other endpoints.
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok", service: "ShoppyGlobe API" });
});

// Canonical route groups.
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/fakestore", fakeStoreRoutes);
app.use("/api/cart", cartRoutes);

// Backward-compatible aliases so older frontend/tests using /api/register or /api/login do not 404.
app.use("/api", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
