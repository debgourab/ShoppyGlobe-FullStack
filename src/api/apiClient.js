// Use the Vite /api proxy in development. This avoids browser CORS/network issues and
// keeps the same frontend code usable with a deployed backend via VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL || "/api";

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
      "Cannot reach the backend API. Make sure MongoDB and the backend server are running on port 5000."
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
