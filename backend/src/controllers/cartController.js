import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { syncFakeStoreProduct } from "../services/fakeStoreService.js";

function serializeCart(cart) {
  return {
    id: cart._id,
    items: cart.items.map((item) => ({
      id: item.productId.externalId ?? item.productId._id,
      mongoId: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      thumbnail: item.productId.thumbnail,
      quantity: item.quantity,
      stock: item.productId.stock
    }))
  };
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

async function populatedCart(userId) {
  const cart = await getOrCreateCart(userId);
  return cart.populate("items.productId");
}

async function resolveProduct(productId) {
  const rawId = String(productId).trim();

  // First support a product already stored in MongoDB.
  if (mongoose.isValidObjectId(rawId)) {
    const localProduct = await Product.findById(rawId);
    if (localProduct) return localProduct;
  }

  // Fake Store API uses numeric ids. Check MongoDB first, then sync it from the external API.
  if (/^\d+$/.test(rawId)) {
    const externalId = Number(rawId);
    const existingProduct = await Product.findOne({ externalId });
    if (existingProduct) return existingProduct;
    return syncFakeStoreProduct(externalId);
  }

  return null;
}

async function resolveCartItemProduct(productId) {
  const rawId = String(productId).trim();
  if (mongoose.isValidObjectId(rawId)) return Product.findById(rawId);
  if (/^\d+$/.test(rawId)) return Product.findOne({ externalId: Number(rawId) });
  return null;
}

export async function getCart(req, res, next) {
  try {
    const cart = await populatedCart(req.user._id);
    res.status(200).json(serializeCart(cart));
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await resolveProduct(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    const requestedQuantity = Number(quantity);
    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive integer." });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((entry) => entry.productId.toString() === product._id.toString());
    const nextQuantity = (item?.quantity || 0) + requestedQuantity;

    if (nextQuantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} item(s) are available in stock.` });
    }

    if (item) item.quantity = nextQuantity;
    else cart.items.push({ productId: product._id, quantity: requestedQuantity });

    await cart.save();
    const populated = await cart.populate("items.productId");
    res.status(201).json({ success: true, message: "Product added to cart.", ...serializeCart(populated) });
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { productId } = req.params;
    const requestedQuantity = Number(req.body.quantity);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive integer." });
    }

    const product = await resolveCartItemProduct(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    if (requestedQuantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} item(s) are available in stock.` });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((entry) => entry.productId.toString() === product._id.toString());
    if (!item) return res.status(404).json({ success: false, message: "Cart item not found." });

    item.quantity = requestedQuantity;
    await cart.save();
    const populated = await cart.populate("items.productId");
    res.status(200).json({ success: true, message: "Cart item updated.", ...serializeCart(populated) });
  } catch (error) {
    next(error);
  }
}

export async function removeFromCart(req, res, next) {
  try {
    const { productId } = req.params;
    const product = await resolveCartItemProduct(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    const cart = await getOrCreateCart(req.user._id);
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((entry) => entry.productId.toString() !== product._id.toString());
    if (cart.items.length === originalLength) {
      return res.status(404).json({ success: false, message: "Cart item not found." });
    }

    await cart.save();
    const populated = await cart.populate("items.productId");
    res.status(200).json({ success: true, message: "Cart item removed.", ...serializeCart(populated) });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.status(200).json({ success: true, message: "Cart cleared.", id: cart._id, items: [] });
  } catch (error) {
    next(error);
  }
}
