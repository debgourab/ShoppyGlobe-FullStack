import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      // Forward the app's own API requests to the Express backend.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      },

      // Forward product-catalogue requests to the requested Fake Store API.
      "/fakestoreapi": {
        target: "https://fakestoreapi.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/fakestoreapi/, "")
      }
    }
  }
});
