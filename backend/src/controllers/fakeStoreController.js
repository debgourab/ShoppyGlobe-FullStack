import Product from "../models/Product.js";
import { FAKE_STORE_API_URL, fetchFakeStoreProduct, normalizeExternalProduct } from "../services/fakeStoreService.js";

async function cacheProducts(products) {
  if (!products.length) return;

  await Product.bulkWrite(
    products.map((product) => ({
      updateOne: {
        filter: { externalId: product.externalId },
        update: { $set: product },
        upsert: true
      }
    })),
    { ordered: false }
  );
}

async function getCachedProducts() {
  return Product.find({ externalId: { $exists: true, $ne: null } })
    .sort({ externalId: 1 })
    .lean();
}

export async function getFakeStoreProducts(req, res, next) {
  try {
    // Fake Store is the primary catalogue source. Whenever it works, keep a
    // MongoDB copy so production can continue working if the upstream API is
    // temporarily blocked or unavailable from Render.
    try {
      const response = await fetch(FAKE_STORE_API_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "ShoppyGlobe/1.0"
        }
      });
      const data = await response.json().catch(() => null);

      if (response.ok && Array.isArray(data)) {
        const products = data.map(normalizeExternalProduct);
        await cacheProducts(products);
        res.set("X-Product-Source", "fakestoreapi");
        return res.status(200).json(products);
      }
    } catch (upstreamError) {
      // Continue to the MongoDB fallback below.
      console.warn("Fake Store API unavailable; using MongoDB cache.", upstreamError.message);
    }

    const cachedProducts = await getCachedProducts();
    if (cachedProducts.length > 0) {
      res.set("X-Product-Source", "mongodb-cache");
      return res.status(200).json(cachedProducts);
    }

    return res.status(503).json({
      message: "Fake Store API is unavailable and no cached products are available yet."
    });
  } catch (error) {
    next(error);
  }
}

export async function getFakeStoreProduct(req, res, next) {
  try {
    try {
      const product = await fetchFakeStoreProduct(req.params.id);

      await Product.findOneAndUpdate(
        { externalId: product.externalId },
        { $set: product },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );

      res.set("X-Product-Source", "fakestoreapi");
      return res.status(200).json(product);
    } catch (upstreamError) {
      const externalId = Number(req.params.id);

      if (Number.isFinite(externalId)) {
        const cachedProduct = await Product.findOne({ externalId }).lean();
        if (cachedProduct) {
          res.set("X-Product-Source", "mongodb-cache");
          return res.status(200).json(cachedProduct);
        }
      }

      throw upstreamError;
    }
  } catch (error) {
    next(error);
  }
}
