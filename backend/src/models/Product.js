import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    externalId: { type: Number, unique: true, sparse: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 10 },
    rating: { rate: { type: Number, min: 0, max: 5, default: 0 }, count: { type: Number, min: 0, default: 0 } }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
