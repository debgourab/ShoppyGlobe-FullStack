// Fake Store API is requested through the Vite development proxy so the browser does not
// make a cross-origin request directly to the third-party API.
const FAKE_STORE_API = "/fakestoreapi";

function normalizeProduct(product) {
  // Fake Store API prices are USD. The UI converts them to INR in currency.js.
  return {
    ...product,
    price: Number(product.price),
    image: product.image,
    thumbnail: product.image,
    rating: Number(product?.rating?.rate || 0),
    ratingCount: Number(product?.rating?.count || 0),
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
