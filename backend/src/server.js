import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`ShoppyGlobe API running on port ${PORT}`);
  });

  async function shutdown(signal) {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
