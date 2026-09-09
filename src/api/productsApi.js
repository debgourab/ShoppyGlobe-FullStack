import { API_URL } from "./apiClient";

// Use the Express backend proxy in both development and production.
const FAKE_STORE_API = `${API_URL}/fakestore`;

function normalizeProduct(product) {
  const id = product.id ?? product.externalId;
  const rating = typeof product.rating === "number" ? product.rating : Number(product?.rating?.rate || 0);
  const ratingCount = product.ratingCount ?? product?.rating?.count ?? 0;

  return {
    ...product,
    id,
    price: Number(product.price),
    image: product.image,
    thumbnail: product.image,
    rating,
    ratingCount: Number(ratingCount),
    stock: Number(product.stock || 10)
  };
}

async function request(path, signal) {
  const response = await fetch(`${FAKE_STORE_API}${path}`, { signal });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || `Fake Store API request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function fetchProducts(signal) {
  const data = await request("/products", signal);
  if (!Array.isArray(data)) {
    throw new Error("Fake Store API returned an unexpected product response.");
  }
  return data.map(normalizeProduct);
}

export async function fetchProductById(productId, signal) {
  try {
    const data = await request(`/products/${encodeURIComponent(productId)}`, signal);
    return normalizeProduct(data);
  } catch (error) {
    if (error.status === 404) throw new Error("PRODUCT_NOT_FOUND");
    throw error;
  }
}
