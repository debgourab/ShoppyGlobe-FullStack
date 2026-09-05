import { apiRequest } from "./apiClient";

export function getCart() {
  return apiRequest("/cart");
}

export function addCartItem(productId, quantity = 1) {
  return apiRequest("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity })
  });
}

export function updateCartItem(productId, quantity) {
  return apiRequest(`/cart/${encodeURIComponent(productId)}`, {
    method: "PUT",
    body: JSON.stringify({ quantity })
  });
}

export function removeCartItem(productId) {
  return apiRequest(`/cart/${encodeURIComponent(productId)}`, {
    method: "DELETE"
  });
}

export function clearRemoteCart() {
  return apiRequest("/cart", { method: "DELETE" });
}
