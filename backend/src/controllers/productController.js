import mongoose from "mongoose";
import Product from "../models/Product.js";

export async function getProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const payload = {
      ...req.body,
      // Let a normal Fake Store-style request omit thumbnail and stock.
      thumbnail: req.body.thumbnail || req.body.image,
      stock: req.body.stock ?? 10
    };

    const product = await Product.create(payload);
    res.status(201).json({ success: true, message: "Product created successfully.", product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const updates = { ...req.body };
    if (updates.image && !updates.thumbnail) updates.thumbnail = updates.image;

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.status(200).json({ success: true, message: "Product updated successfully.", product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
}
