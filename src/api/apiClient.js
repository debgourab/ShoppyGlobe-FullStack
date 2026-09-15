// In development always use Vite's /api proxy. This avoids CORS issues and keeps
// the frontend working even when the local Express backend is not running.
// In production Netlify uses VITE_API_URL to reach the deployed Render backend.
const API_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL || "/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("shoppyglobe_token");
  const headers = new Headers(options.headers || {});

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (error) {
    const networkError = new Error(
      "Cannot reach the backend API. Check your network connection and backend configuration."
    );
    networkError.cause = error;
    throw networkError;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}.`);
    error.status = response.status;
    error.details = data.errors || [];
    throw error;
  }

  return data;
}

export { API_URL };
