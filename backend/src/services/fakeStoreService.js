import Product from "../models/Product.js";

// The assignment requires Fake Store API as the external catalogue source.
export const FAKE_STORE_API_URL = "https://fakestoreapi.com/products";

export function normalizeExternalProduct(product) {
  return {
    externalId: Number(product.id),
    title: product.title,
    // Fake Store API prices are USD; store customer prices in INR.
    price: Number((Number(product.price || 0) * 90).toFixed(2)),
    description: product.description,
    category: product.category,
    image: product.image,
    thumbnail: product.image,
    stock: 10,
    rating: {
      rate: Number(product?.rating?.rate || 0),
      count: Number(product?.rating?.count || 0)
    }
  };
}

export async function fetchFakeStoreProduct(externalId) {
  const response = await fetch(`${FAKE_STORE_API_URL}/${encodeURIComponent(externalId)}`);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || `Fake Store API request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return normalizeExternalProduct(data);
}

export async function syncFakeStoreProduct(externalId) {
  const normalized = await fetchFakeStoreProduct(externalId);
  return Product.findOneAndUpdate(
    { externalId: normalized.externalId },
    normalized,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
}
