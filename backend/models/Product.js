// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    sku: { type: String, unique: true },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
