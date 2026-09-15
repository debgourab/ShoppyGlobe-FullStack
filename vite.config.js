import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget =
    env.VITE_DEV_API_PROXY_TARGET || "https://shoppyglobe-fullstack-nmb6.onrender.com";

  return {
    plugins: [react()],
    server: {
      port: 4000,
      proxy: {
        // In local development the browser calls /api on Vite. By default Vite
        // forwards those requests to the deployed Render backend, so the frontend
        // works even when a local Express server is not running.
        // To develop against a local backend, set:
        // VITE_DEV_API_PROXY_TARGET=http://localhost:5000
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: apiProxyTarget.startsWith("https://")
        },

        "/fakestoreapi": {
          target: "https://fakestoreapi.com",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/fakestoreapi/, "")
        }
      }
    }
  };
});
