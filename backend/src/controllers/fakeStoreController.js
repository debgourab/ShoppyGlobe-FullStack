import { FAKE_STORE_API_URL, fetchFakeStoreProduct, normalizeExternalProduct } from "../services/fakeStoreService.js";

export async function getFakeStoreProducts(req, res, next) {
  try {
    // Server-side proxy avoids browser CORS restrictions while preserving the requested API source.
    const response = await fetch(FAKE_STORE_API_URL);
    const data = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(data)) {
      return res.status(response.status || 502).json({ message: "Unable to load products from Fake Store API." });
    }
    res.json(data.map(normalizeExternalProduct));
  } catch (error) {
    next(error);
  }
}

export async function getFakeStoreProduct(req, res, next) {
  try {
    const product = await fetchFakeStoreProduct(req.params.id);
    res.json(product);
  } catch (error) {
    next(error);
  }
}
